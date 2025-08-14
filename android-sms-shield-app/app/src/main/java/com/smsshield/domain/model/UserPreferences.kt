package com.smsshield.domain.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "user_preferences")
data class UserPreferences(
    @PrimaryKey
    val id: Int = 1, // Single user preferences record
    val isMonitoringEnabled: Boolean = false,
    val selectedModel: String = "random_forest", // Default ML model
    val notificationEnabled: Boolean = true,
    val spamAlertsEnabled: Boolean = true,
    val analysisCompleteEnabled: Boolean = false,
    val theme: AppTheme = AppTheme.SYSTEM,
    val language: String = "en",
    val isPremiumUser: Boolean = false,
    val cloudSyncEnabled: Boolean = false,
    val autoBlockSpam: Boolean = false,
    val confidenceThreshold: Float = 0.7f, // Minimum confidence for spam classification
    val analysisHistoryDays: Int = 30, // How many days of history to keep
    val isFirstLaunch: Boolean = true,
    val lastSyncTimestamp: Date? = null,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

enum class AppTheme {
    LIGHT,
    DARK,
    SYSTEM
}

// Data class for app statistics
data class AppStatistics(
    val totalMessagesAnalyzed: Int = 0,
    val spamDetected: Int = 0,
    val safeMessages: Int = 0,
    val suspiciousMessages: Int = 0,
    val averageConfidence: Float = 0.0f,
    val modelAccuracy: Map<String, Float> = emptyMap(),
    val dailyAnalysisCount: Map<String, Int> = emptyMap(),
    val lastUpdated: Date = Date()
)

// Data class for model performance tracking
data class ModelPerformance(
    val modelName: String,
    val accuracy: Float,
    val precision: Float,
    val recall: Float,
    val f1Score: Float,
    val totalPredictions: Int,
    val correctPredictions: Int,
    val lastUpdated: Date = Date()
)

// Data class for user profile
data class UserProfile(
    val userId: String,
    val email: String? = null,
    val displayName: String? = null,
    val phoneNumber: String? = null,
    val country: String = "Ghana",
    val isEmailVerified: Boolean = false,
    val subscriptionType: SubscriptionType = SubscriptionType.FREE,
    val subscriptionExpiry: Date? = null,
    val createdAt: Date = Date(),
    val lastLoginAt: Date = Date()
)

enum class SubscriptionType {
    FREE,
    PREMIUM,
    ENTERPRISE
}
