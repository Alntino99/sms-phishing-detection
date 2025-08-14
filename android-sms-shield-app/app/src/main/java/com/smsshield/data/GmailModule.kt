package com.smsshield.data

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.services.gmail.Gmail
import com.google.api.services.gmail.GmailScopes
import com.google.api.services.gmail.model.ListMessagesResponse
import com.google.api.services.gmail.model.Message
import kotlinx.coroutines.*
import java.io.ByteArrayOutputStream
import java.util.*

class GmailModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val TAG = "GmailModule"
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var gmailService: Gmail? = null
    private var googleSignInClient: GoogleSignInClient? = null
    private var currentAccount: GoogleSignInAccount? = null

    companion object {
        private const val RC_SIGN_IN = 9001
    }

    override fun getName(): String {
        return "GmailModule"
    }

    @ReactMethod
    fun authenticate(promise: Promise) {
        scope.launch {
            try {
                val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestEmail()
                    .requestScopes(com.google.android.gms.common.api.Scope(GmailScopes.GMAIL_READONLY))
                    .build()

                googleSignInClient = GoogleSignIn.getClient(reactApplicationContext, gso)
                
                val account = GoogleSignIn.getLastSignedInAccount(reactApplicationContext)
                if (account != null && GoogleSignIn.hasPermissions(account, com.google.android.gms.common.api.Scope(GmailScopes.GMAIL_READONLY))) {
                    currentAccount = account
                    initializeGmailService(account)
                    promise.resolve(Arguments.createMap().apply {
                        putBoolean("success", true)
                        putString("email", account.email)
                    })
                } else {
                    promise.resolve(Arguments.createMap().apply {
                        putBoolean("success", false)
                        putString("error", "Not signed in or missing permissions")
                    })
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error authenticating with Gmail", e)
                promise.reject("ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun checkPermissions(promise: Promise) {
        scope.launch {
            try {
                val account = GoogleSignIn.getLastSignedInAccount(reactApplicationContext)
                val hasReadPermission = account != null && GoogleSignIn.hasPermissions(
                    account, 
                    com.google.android.gms.common.api.Scope(GmailScopes.GMAIL_READONLY)
                )
                val hasModifyPermission = account != null && GoogleSignIn.hasPermissions(
                    account, 
                    com.google.android.gms.common.api.Scope(GmailScopes.GMAIL_MODIFY)
                )

                val permissionsMap = Arguments.createMap().apply {
                    putBoolean("readEmails", hasReadPermission)
                    putBoolean("sendEmails", false) // Not implemented
                    putBoolean("modifyEmails", hasModifyPermission)
                }
                promise.resolve(permissionsMap)
            } catch (e: Exception) {
                Log.e(TAG, "Error checking Gmail permissions", e)
                promise.reject("ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun getRecentEmails(limit: Int, promise: Promise) {
        scope.launch {
            try {
                if (gmailService == null) {
                    promise.reject("NOT_AUTHENTICATED", "Gmail service not initialized")
                    return@launch
                }

                val emails = getEmails("INBOX", limit)
                val emailsArray = Arguments.createArray()
                
                emails.forEach { email ->
                    val emailMap = Arguments.createMap().apply {
                        putString("id", email.id)
                        putString("threadId", email.threadId)
                        putString("from", email.from)
                        putString("to", email.to)
                        putString("subject", email.subject)
                        putString("body", email.body)
                        putDouble("date", email.date.time.toDouble())
                        putBoolean("isRead", email.isRead)
                    }
                    emailsArray.pushMap(emailMap)
                }
                
                promise.resolve(emailsArray)
            } catch (e: Exception) {
                Log.e(TAG, "Error getting recent emails", e)
                promise.reject("ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun getEmailsFromLabel(label: String, limit: Int, promise: Promise) {
        scope.launch {
            try {
                if (gmailService == null) {
                    promise.reject("NOT_AUTHENTICATED", "Gmail service not initialized")
                    return@launch
                }

                val emails = getEmails(label, limit)
                val emailsArray = Arguments.createArray()
                
                emails.forEach { email ->
                    val emailMap = Arguments.createMap().apply {
                        putString("id", email.id)
                        putString("threadId", email.threadId)
                        putString("from", email.from)
                        putString("to", email.to)
                        putString("subject", email.subject)
                        putString("body", email.body)
                        putDouble("date", email.date.time.toDouble())
                        putBoolean("isRead", email.isRead)
                    }
                    emailsArray.pushMap(emailMap)
                }
                
                promise.resolve(emailsArray)
            } catch (e: Exception) {
                Log.e(TAG, "Error getting emails from label", e)
                promise.reject("ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun analyzeEmail(emailData: ReadableMap, promise: Promise) {
        scope.launch {
            try {
                val email = GmailMessage(
                    id = emailData.getString("id") ?: "",
                    threadId = "",
                    from = emailData.getString("from") ?: "",
                    to = "",
                    subject = emailData.getString("subject") ?: "",
                    body = emailData.getString("body") ?: "",
                    date = Date(emailData.getDouble("date").toLong()),
                    isRead = false
                )

                val result = analyzeEmailMessage(email)
                val resultMap = Arguments.createMap().apply {
                    putBoolean("isSpam", result.isSpam)
                    putDouble("confidence", result.confidence)
                    putString("category", result.category)
                    putString("reason", result.reason)
                }
                
                promise.resolve(resultMap)
            } catch (e: Exception) {
                Log.e(TAG, "Error analyzing email", e)
                promise.reject("ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun markAsSpam(emailId: String, promise: Promise) {
        scope.launch {
            try {
                if (gmailService == null) {
                    promise.reject("NOT_AUTHENTICATED", "Gmail service not initialized")
                    return@launch
                }

                // Add SPAM label to the message
                val modifyRequest = com.google.api.services.gmail.model.ModifyMessageRequest()
                modifyRequest.addLabelIds("SPAM")
                
                gmailService?.users()?.messages()?.modify("me", emailId, modifyRequest)?.execute()
                
                promise.resolve(Arguments.createMap().apply {
                    putBoolean("success", true)
                })
            } catch (e: Exception) {
                Log.e(TAG, "Error marking email as spam", e)
                promise.reject("ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun moveToTrash(emailId: String, promise: Promise) {
        scope.launch {
            try {
                if (gmailService == null) {
                    promise.reject("NOT_AUTHENTICATED", "Gmail service not initialized")
                    return@launch
                }

                gmailService?.users()?.messages()?.trash("me", emailId)?.execute()
                
                promise.resolve(Arguments.createMap().apply {
                    putBoolean("success", true)
                })
            } catch (e: Exception) {
                Log.e(TAG, "Error moving email to trash", e)
                promise.reject("ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun getLabels(promise: Promise) {
        scope.launch {
            try {
                if (gmailService == null) {
                    promise.reject("NOT_AUTHENTICATED", "Gmail service not initialized")
                    return@launch
                }

                val labels = gmailService?.users()?.labels()?.list("me")?.execute()
                val labelsArray = Arguments.createArray()
                
                labels?.labels?.forEach { label ->
                    labelsArray.pushString(label.name)
                }
                
                promise.resolve(labelsArray)
            } catch (e: Exception) {
                Log.e(TAG, "Error getting labels", e)
                promise.reject("ERROR", e.message)
            }
        }
    }

    private fun initializeGmailService(account: GoogleSignInAccount) {
        val credential = GoogleAccountCredential.usingOAuth2(
            reactApplicationContext,
            listOf(GmailScopes.GMAIL_READONLY, GmailScopes.GMAIL_MODIFY)
        ).apply {
            selectedAccount = account.account
        }

        gmailService = Gmail.Builder(NetHttpTransport(), JacksonFactory(), credential)
            .setApplicationName("SMS Shield")
            .build()
    }

    private suspend fun getEmails(label: String, limit: Int): List<GmailMessage> {
        return withContext(Dispatchers.IO) {
            val messages = mutableListOf<GmailMessage>()
            
            try {
                val response: ListMessagesResponse = gmailService?.users()?.messages()?.list("me")
                    ?.setLabelIds(listOf(label))
                    ?.setMaxResults(limit.toLong())
                    ?.execute() ?: return@withContext messages

                response.messages?.forEach { messageSummary ->
                    val message: Message = gmailService?.users()?.messages()?.get("me", messageSummary.id)?.execute()
                        ?: return@forEach

                    val headers = message.payload?.headers
                    val from = headers?.find { it.name == "From" }?.value ?: ""
                    val to = headers?.find { it.name == "To" }?.value ?: ""
                    val subject = headers?.find { it.name == "Subject" }?.value ?: ""
                    val date = headers?.find { it.name == "Date" }?.value ?: ""
                    
                    val body = extractEmailBody(message)
                    val isRead = !message.labelIds?.contains("UNREAD") ?: false

                    messages.add(GmailMessage(
                        id = message.id,
                        threadId = message.threadId,
                        from = from,
                        to = to,
                        subject = subject,
                        body = body,
                        date = parseDate(date),
                        isRead = isRead
                    ))
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error getting emails", e)
            }
            
            messages
        }
    }

    private fun extractEmailBody(message: Message): String {
        return try {
            val payload = message.payload
            if (payload?.body?.data != null) {
                val data = payload.body.data
                val bytes = android.util.Base64.decode(data, android.util.Base64.URL_SAFE)
                String(bytes, Charsets.UTF_8)
            } else if (payload?.parts != null) {
                // Handle multipart messages
                val parts = payload.parts
                for (part in parts) {
                    if (part.mimeType == "text/plain" && part.body?.data != null) {
                        val data = part.body.data
                        val bytes = android.util.Base64.decode(data, android.util.Base64.URL_SAFE)
                        return String(bytes, Charsets.UTF_8)
                    }
                }
                ""
            } else {
                ""
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error extracting email body", e)
            ""
        }
    }

    private fun parseDate(dateString: String): Date {
        return try {
            // Simple date parsing - you might want to use a more robust parser
            Date()
        } catch (e: Exception) {
            Date()
        }
    }

    private fun analyzeEmailMessage(email: GmailMessage): EmailAnalysisResult {
        val subject = email.subject.lowercase()
        val body = email.body.lowercase()
        val from = email.from.lowercase()

        // Enhanced email spam patterns
        val spamPatterns = listOf(
            "urgent", "account suspended", "verify your account", "click here",
            "limited time offer", "free money", "lottery winner", "bank security",
            "unusual activity", "verify now", "account locked", "suspicious login",
            "congratulations", "you've won", "claim your prize", "limited time",
            "act now", "don't miss out", "exclusive offer", "one time only",
            "viagra", "weight loss", "make money fast", "work from home",
            "earn money online", "investment opportunity", "crypto", "bitcoin"
        )

        // Enhanced phishing patterns
        val phishingPatterns = listOf(
            "bank", "paypal", "amazon", "netflix", "apple", "google", "microsoft",
            "verify", "secure", "login", "password", "account", "ebay", "facebook",
            "instagram", "twitter", "linkedin", "dropbox", "onedrive", "icloud",
            "irs", "tax", "social security", "credit card", "banking", "paypal",
            "venmo", "zelle", "cash app"
        )

        var spamScore = 0.0
        var phishingScore = 0.0

        // Check subject line
        spamPatterns.forEach { pattern ->
            if (subject.contains(pattern)) {
                spamScore += 0.4
            }
        }

        phishingPatterns.forEach { pattern ->
            if (subject.contains(pattern)) {
                phishingScore += 0.3
            }
        }

        // Check email body
        spamPatterns.forEach { pattern ->
            if (body.contains(pattern)) {
                spamScore += 0.2
            }
        }

        phishingPatterns.forEach { pattern ->
            if (body.contains(pattern)) {
                phishingScore += 0.15
            }
        }

        // Check for suspicious URLs
        val urlRegex = Regex("https?://[^\\s]+")
        if (urlRegex.containsMatchIn(body)) {
            phishingScore += 0.3
        }

        // Check for urgency indicators
        val urgencyWords = listOf("urgent", "immediate", "now", "quick", "fast", "asap", "emergency")
        urgencyWords.forEach { word ->
            if (subject.contains(word) || body.contains(word)) {
                spamScore += 0.3
            }
        }

        // Check for suspicious sender patterns
        val suspiciousSenders = listOf(
            "noreply", "no-reply", "donotreply", "do-not-reply", "support",
            "security", "admin", "system", "service", "notification"
        )

        suspiciousSenders.forEach { sender ->
            if (from.contains(sender)) {
                spamScore += 0.2
            }
        }

        // Check for excessive capitalization
        val capitalRatio = (subject.match(Regex("[A-Z]"))?.length ?: 0) / subject.length.toDouble()
        if (capitalRatio > 0.5) {
            spamScore += 0.2
        }

        // Check for excessive punctuation
        val exclamationCount = subject.count { it == '!' }
        if (exclamationCount > 2) {
            spamScore += 0.3
        }

        val maxScore = maxOf(spamScore, phishingScore)
        
        return when {
            maxScore >= 0.7 -> EmailAnalysisResult(
                isSpam = true,
                confidence = maxScore,
                category = if (spamScore > phishingScore) "spam" else "phishing",
                reason = if (spamScore > phishingScore) 
                    "Contains multiple spam indicators" 
                else 
                    "Contains suspicious phishing patterns"
            )
            maxScore >= 0.4 -> EmailAnalysisResult(
                isSpam = false,
                confidence = maxScore,
                category = "suspicious",
                reason = "Contains some suspicious elements"
            )
            else -> EmailAnalysisResult(
                isSpam = false,
                confidence = 1.0 - maxScore,
                category = "legitimate",
                reason = "No suspicious patterns detected"
            )
        }
    }

    fun sendEmailReceivedEvent(email: GmailMessage) {
        val emailMap = Arguments.createMap().apply {
            putString("id", email.id)
            putString("threadId", email.threadId)
            putString("from", email.from)
            putString("to", email.to)
            putString("subject", email.subject)
            putString("body", email.body)
            putDouble("date", email.date.time.toDouble())
            putBoolean("isRead", email.isRead)
        }

        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("EmailReceived", emailMap)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        scope.cancel()
    }

    data class GmailMessage(
        val id: String,
        val threadId: String,
        val from: String,
        val to: String,
        val subject: String,
        val body: String,
        val date: Date,
        val isRead: Boolean
    )

    data class EmailAnalysisResult(
        val isSpam: Boolean,
        val confidence: Double,
        val category: String,
        val reason: String
    )
}
