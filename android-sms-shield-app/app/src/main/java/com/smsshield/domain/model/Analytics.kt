package com.smsshield.domain.model

import java.util.Date

data class Analytics(
    val id: String,
    val userId: String,
    val date: Date,
    val totalSMS: Int = 0,
    val spamSMS: Int = 0,
    val safeSMS: Int = 0,
    val phishingSMS: Int = 0,
    val fraudSMS: Int = 0,
    val blockedSMS: Int = 0,
    val modelAccuracy: Float = 0.0f,
    val averageProcessingTime: Long = 0L,
    val mostActiveHour: Int = 0,
    val topSpamSources: List<String> = emptyList(),
    val modelUsage: Map<String, Int> = emptyMap(),
    val createdAt: Date = Date()
)

data class ModelPerformance(
    val modelName: String,
    val accuracy: Float,
    val precision: Float,
    val recall: Float,
    val f1Score: Float,
    val totalPredictions: Int,
    val correctPredictions: Int,
    val falsePositives: Int,
    val falseNegatives: Int,
    val averageInferenceTime: Long,
    val lastUpdated: Date = Date()
)

data class SpamTrend(
    val date: Date,
    val spamCount: Int,
    val totalCount: Int,
    val spamPercentage: Float
)

data class UserStats(
    val userId: String,
    val totalMessagesScanned: Int,
    val spamDetected: Int,
    val moneySaved: Double, // Estimated money saved from spam prevention
    val timeSaved: Long, // Time saved in milliseconds
    val appUsageMinutes: Int,
    val lastActive: Date
)
