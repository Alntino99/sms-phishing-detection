package com.smsshield.data

import android.Manifest
import android.content.ContentResolver
import android.content.Context
import android.content.pm.PackageManager
import android.database.Cursor
import android.net.Uri
import android.provider.Telephony
import android.util.Log
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.smsshield.ml.classifiers.SMSClassifier
import com.smsshield.ml.classifiers.MLClassifierManager
import kotlinx.coroutines.*

class SMSModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val TAG = "SMSModule"
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var smsClassifier: SMSClassifier? = null
    private var isMonitoring = false

    override fun getName(): String {
        return "SMSModule"
    }

    @ReactMethod
    fun requestPermissions(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("ERROR", "Activity is null")
            return
        }

        val permissions = arrayOf(
            Manifest.permission.READ_SMS,
            Manifest.permission.RECEIVE_SMS,
            Manifest.permission.SEND_SMS,
            Manifest.permission.POST_NOTIFICATIONS
        )

        val results = permissions.map { permission ->
            ActivityCompat.checkSelfPermission(reactApplicationContext, permission) == PackageManager.PERMISSION_GRANTED
        }

        val permissionsMap = Arguments.createMap().apply {
            putBoolean("readSMS", results[0])
            putBoolean("receiveSMS", results[1])
            putBoolean("sendSMS", results[2])
            putBoolean("notifications", results[3])
        }

        promise.resolve(permissionsMap)
    }

    @ReactMethod
    fun getAllSMS(promise: Promise) {
        if (ActivityCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) {
            promise.reject("PERMISSION_DENIED", "READ_SMS permission not granted")
            return
        }

        scope.launch {
            try {
                val messages = readAllSMS()
                val messagesArray = Arguments.createArray()
                
                messages.forEach { message ->
                    val messageMap = Arguments.createMap().apply {
                        putString("id", message.id)
                        putString("address", message.address)
                        putString("body", message.body)
                        putDouble("date", message.date.toDouble())
                        putString("type", message.type)
                    }
                    messagesArray.pushMap(messageMap)
                }
                
                promise.resolve(messagesArray)
            } catch (e: Exception) {
                Log.e(TAG, "Error reading SMS", e)
                promise.reject("ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun startMonitoring(promise: Promise) {
        if (ActivityCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.RECEIVE_SMS) != PackageManager.PERMISSION_GRANTED) {
            promise.reject("PERMISSION_DENIED", "RECEIVE_SMS permission not granted")
            return
        }

        try {
            isMonitoring = true
            initializeClassifier()
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error starting SMS monitoring", e)
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun stopMonitoring(promise: Promise) {
        try {
            isMonitoring = false
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping SMS monitoring", e)
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun analyzeSMS(messageData: ReadableMap, promise: Promise) {
        scope.launch {
            try {
                val message = SMSMessage(
                    id = messageData.getString("id") ?: "",
                    address = messageData.getString("address") ?: "",
                    body = messageData.getString("body") ?: "",
                    date = Date(messageData.getDouble("date").toLong()),
                    type = messageData.getString("type") ?: "inbox"
                )

                val result = analyzeMessage(message)
                val resultMap = Arguments.createMap().apply {
                    putBoolean("isSpam", result.isSpam)
                    putDouble("confidence", result.confidence)
                    putString("category", result.category)
                    putString("reason", result.reason)
                }
                
                promise.resolve(resultMap)
            } catch (e: Exception) {
                Log.e(TAG, "Error analyzing SMS", e)
                promise.reject("ERROR", e.message)
            }
        }
    }

    private fun readAllSMS(): List<SMSMessage> {
        val messages = mutableListOf<SMSMessage>()
        val contentResolver: ContentResolver = reactApplicationContext.contentResolver
        val uri = Uri.parse("content://sms")
        
        val cursor: Cursor? = contentResolver.query(
            uri,
            arrayOf("_id", "address", "body", "date", "type"),
            null,
            null,
            "date DESC"
        )

        cursor?.use {
            while (it.moveToNext()) {
                val id = it.getString(it.getColumnIndexOrThrow("_id"))
                val address = it.getString(it.getColumnIndexOrThrow("address"))
                val body = it.getString(it.getColumnIndexOrThrow("body"))
                val date = Date(it.getLong(it.getColumnIndexOrThrow("date")))
                val type = when (it.getInt(it.getColumnIndexOrThrow("type"))) {
                    Telephony.Sms.MESSAGE_TYPE_INBOX -> "inbox"
                    Telephony.Sms.MESSAGE_TYPE_SENT -> "sent"
                    Telephony.Sms.MESSAGE_TYPE_DRAFT -> "draft"
                    else -> "unknown"
                }

                messages.add(SMSMessage(id, address, body, date, type))
            }
        }

        return messages
    }

    private fun initializeClassifier() {
        if (smsClassifier == null) {
            try {
                val classifierManager = MLClassifierManager(reactApplicationContext)
                smsClassifier = classifierManager.getSMSClassifier()
            } catch (e: Exception) {
                Log.e(TAG, "Error initializing SMS classifier", e)
            }
        }
    }

    private fun analyzeMessage(message: SMSMessage): SMSAnalysisResult {
        return try {
            smsClassifier?.analyze(message) ?: basicAnalysis(message)
        } catch (e: Exception) {
            Log.e(TAG, "Error in ML analysis, falling back to basic analysis", e)
            basicAnalysis(message)
        }
    }

    private fun basicAnalysis(message: SMSMessage): SMSAnalysisResult {
        val body = message.body.lowercase()
        val address = message.address

        // Spam patterns
        val spamPatterns = listOf(
            "urgent", "account suspended", "verify your account", "click here",
            "limited time offer", "free money", "lottery winner", "bank security",
            "unusual activity", "verify now", "account locked", "suspicious login"
        )

        // Phishing patterns
        val phishingPatterns = listOf(
            "bank", "paypal", "amazon", "netflix", "apple", "google", "microsoft",
            "verify", "secure", "login", "password", "account"
        )

        var spamScore = 0.0
        var phishingScore = 0.0

        // Check spam patterns
        spamPatterns.forEach { pattern ->
            if (body.contains(pattern)) {
                spamScore += 0.3
            }
        }

        // Check phishing patterns
        phishingPatterns.forEach { pattern ->
            if (body.contains(pattern)) {
                phishingScore += 0.2
            }
        }

        // Check for URLs
        val urlRegex = Regex("https?://[^\\s]+")
        if (urlRegex.containsMatchIn(body)) {
            phishingScore += 0.4
        }

        // Check urgency
        val urgencyWords = listOf("urgent", "immediate", "now", "quick", "fast")
        urgencyWords.forEach { word ->
            if (body.contains(word)) {
                spamScore += 0.2
            }
        }

        val maxScore = maxOf(spamScore, phishingScore)
        
        return when {
            maxScore >= 0.7 -> SMSAnalysisResult(
                isSpam = true,
                confidence = maxScore,
                category = if (spamScore > phishingScore) "spam" else "phishing",
                reason = if (spamScore > phishingScore) 
                    "Contains multiple spam indicators" 
                else 
                    "Contains suspicious phishing patterns"
            )
            maxScore >= 0.4 -> SMSAnalysisResult(
                isSpam = false,
                confidence = maxScore,
                category = "suspicious",
                reason = "Contains some suspicious elements"
            )
            else -> SMSAnalysisResult(
                isSpam = false,
                confidence = 1.0 - maxScore,
                category = "legitimate",
                reason = "No suspicious patterns detected"
            )
        }
    }

    fun sendSMSReceivedEvent(message: SMSMessage) {
        if (!isMonitoring) return

        val messageMap = Arguments.createMap().apply {
            putString("id", message.id)
            putString("address", message.address)
            putString("body", message.body)
            putDouble("date", message.date.time.toDouble())
            putString("type", message.type)
        }

        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("SMSReceived", messageMap)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        scope.cancel()
    }

    data class SMSMessage(
        val id: String,
        val address: String,
        val body: String,
        val date: Date,
        val type: String
    )

    data class SMSAnalysisResult(
        val isSpam: Boolean,
        val confidence: Double,
        val category: String,
        val reason: String
    )
}
