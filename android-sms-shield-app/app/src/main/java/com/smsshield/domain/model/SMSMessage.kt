package com.smsshield.domain.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "sms_messages")
data class SMSMessage(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val address: String, // Sender phone number
    val body: String, // Message content
    val timestamp: Long, // Message timestamp
    val type: SMSType, // Inbox, Sent, Draft
    val isSpam: Boolean = false, // Spam detection result
    val confidence: Float = 0.0f, // ML model confidence score
    val modelUsed: String = "", // Which ML model was used
    val features: Map<String, Float> = emptyMap(), // Extracted features
    val isAnalyzed: Boolean = false, // Whether ML analysis is complete
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

enum class SMSType {
    INBOX, SENT, DRAFT, OUTBOX
}

enum class SpamCategory {
    SAFE, SPAM, PHISHING, FRAUD, UNKNOWN
}
