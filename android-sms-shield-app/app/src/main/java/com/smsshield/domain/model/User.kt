package com.smsshield.domain.model

import java.util.Date

data class User(
    val id: String,
    val email: String,
    val displayName: String,
    val phoneNumber: String? = null,
    val profileImageUrl: String? = null,
    val isPremium: Boolean = false,
    val subscriptionType: SubscriptionType = SubscriptionType.FREE,
    val subscriptionExpiry: Date? = null,
    val preferences: UserPreferences = UserPreferences(),
    val createdAt: Date = Date(),
    val lastLoginAt: Date = Date()
)

enum class SubscriptionType {
    FREE, BASIC, PREMIUM, ENTERPRISE
}

data class UserPreferences(
    val isDarkMode: Boolean = false,
    val notificationsEnabled: Boolean = true,
    val autoBlockSpam: Boolean = true,
    val scanIncomingSMS: Boolean = true,
    val scanOutgoingSMS: Boolean = false,
    val preferredLanguage: String = "en",
    val timezone: String = "UTC",
    val privacyMode: Boolean = false,
    val dataSyncEnabled: Boolean = true
)
