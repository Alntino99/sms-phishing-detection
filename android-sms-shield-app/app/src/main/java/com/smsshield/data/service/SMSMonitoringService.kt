package com.smsshield.data.service

import android.app.*
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.smsshield.R
import com.smsshield.data.SMSModule
import com.smsshield.data.receiver.SMSReceiver
import com.smsshield.ml.classifiers.SMSClassifier
import com.smsshield.ml.classifiers.MLClassifierManager
import kotlinx.coroutines.*

class SMSMonitoringService : Service() {
    private val TAG = "SMSMonitoringService"
    private val NOTIFICATION_ID = 1001
    private val CHANNEL_ID = "sms_shield_channel"
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var smsClassifier: SMSClassifier? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        initializeClassifier()
        Log.d(TAG, "SMS Monitoring Service created")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "SMS Monitoring Service started")

        when (intent?.action) {
            "SMS_RECEIVED" -> {
                val smsId = intent.getStringExtra("sms_id") ?: ""
                val smsAddress = intent.getStringExtra("sms_address") ?: ""
                val smsBody = intent.getStringExtra("sms_body") ?: ""
                val smsDate = intent.getLongExtra("sms_date", System.currentTimeMillis())
                val smsType = intent.getStringExtra("sms_type") ?: "inbox"

                scope.launch {
                    processSMS(smsId, smsAddress, smsBody, smsDate, smsType)
                }
            }
            "START_MONITORING" -> {
                startForeground(NOTIFICATION_ID, createNotification("SMS Shield Active", "Monitoring SMS messages..."))
            }
            "STOP_MONITORING" -> {
                stopForeground(true)
                stopSelf()
            }
        }

        return START_STICKY
    }

    private suspend fun processSMS(id: String, address: String, body: String, date: Long, type: String) {
        try {
            val message = SMSModule.SMSMessage(id, address, body, java.util.Date(date), type)
            val result = analyzeMessage(message)

            Log.d(TAG, "SMS Analysis - From: $address, Category: ${result.category}, Confidence: ${result.confidence}")

            if (result.isSpam || result.category == "phishing") {
                showThreatNotification(address, body, result)
            }

            // Store in database for analytics
            storeSMSAnalysis(message, result)

        } catch (e: Exception) {
            Log.e(TAG, "Error processing SMS", e)
        }
    }

    private fun analyzeMessage(message: SMSModule.SMSMessage): SMSModule.SMSAnalysisResult {
        return try {
            smsClassifier?.analyze(message) ?: basicAnalysis(message)
        } catch (e: Exception) {
            Log.e(TAG, "Error in ML analysis, falling back to basic analysis", e)
            basicAnalysis(message)
        }
    }

    private fun basicAnalysis(message: SMSModule.SMSMessage): SMSModule.SMSAnalysisResult {
        val body = message.body.lowercase()
        val address = message.address

        // Enhanced spam detection patterns
        val spamPatterns = listOf(
            "urgent", "account suspended", "verify your account", "click here",
            "limited time offer", "free money", "lottery winner", "bank security",
            "unusual activity", "verify now", "account locked", "suspicious login",
            "congratulations", "you've won", "claim your prize", "limited time",
            "act now", "don't miss out", "exclusive offer", "one time only"
        )

        // Enhanced phishing patterns
        val phishingPatterns = listOf(
            "bank", "paypal", "amazon", "netflix", "apple", "google", "microsoft",
            "verify", "secure", "login", "password", "account", "ebay", "facebook",
            "instagram", "twitter", "linkedin", "dropbox", "onedrive", "icloud"
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
        val urgencyWords = listOf("urgent", "immediate", "now", "quick", "fast", "asap")
        urgencyWords.forEach { word ->
            if (body.contains(word)) {
                spamScore += 0.2
            }
        }

        // Check for suspicious phone numbers
        val suspiciousNumbers = listOf("0000", "1111", "9999", "1234", "5555")
        suspiciousNumbers.forEach { number ->
            if (address.contains(number)) {
                spamScore += 0.3
            }
        }

        val maxScore = maxOf(spamScore, phishingScore)
        
        return when {
            maxScore >= 0.7 -> SMSModule.SMSAnalysisResult(
                isSpam = true,
                confidence = maxScore,
                category = if (spamScore > phishingScore) "spam" else "phishing",
                reason = if (spamScore > phishingScore) 
                    "Contains multiple spam indicators" 
                else 
                    "Contains suspicious phishing patterns"
            )
            maxScore >= 0.4 -> SMSModule.SMSAnalysisResult(
                isSpam = false,
                confidence = maxScore,
                category = "suspicious",
                reason = "Contains some suspicious elements"
            )
            else -> SMSModule.SMSAnalysisResult(
                isSpam = false,
                confidence = 1.0 - maxScore,
                category = "legitimate",
                reason = "No suspicious patterns detected"
            )
        }
    }

    private fun showThreatNotification(address: String, body: String, result: SMSModule.SMSAnalysisResult) {
        val title = when (result.category) {
            "spam" -> "🚨 Spam SMS Detected"
            "phishing" -> "⚠️ Phishing Attempt Detected"
            else -> "⚠️ Suspicious SMS Detected"
        }

        val message = "From: $address\n${body.take(50)}${if (body.length > 50) "..." else ""}"

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(message)
            .setSmallIcon(R.drawable.ic_shield)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }

    private fun createNotification(title: String, message: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(message)
            .setSmallIcon(R.drawable.ic_shield)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "SMS Shield Notifications",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Notifications for SMS Shield security alerts"
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun initializeClassifier() {
        try {
            val classifierManager = MLClassifierManager(this)
            smsClassifier = classifierManager.getSMSClassifier()
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing SMS classifier", e)
        }
    }

    private fun storeSMSAnalysis(message: SMSModule.SMSMessage, result: SMSModule.SMSAnalysisResult) {
        // TODO: Store in local database for analytics
        Log.d(TAG, "Storing SMS analysis: ${message.address} - ${result.category}")
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
        Log.d(TAG, "SMS Monitoring Service destroyed")
    }
}
