package com.smsshield.data.local

import androidx.room.*
import com.smsshield.domain.model.*
import kotlinx.coroutines.flow.Flow
import java.util.*

@Database(
    entities = [
        SMSMessageEntity::class,
        UserEntity::class,
        AnalyticsEntity::class,
        ModelPerformanceEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class SMSDatabase : RoomDatabase() {
    abstract fun smsDao(): SMSDao
    abstract fun userDao(): UserDao
    abstract fun analyticsDao(): AnalyticsDao
    abstract fun modelPerformanceDao(): ModelPerformanceDao
}

@Entity(tableName = "sms_messages")
data class SMSMessageEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val address: String,
    val body: String,
    val timestamp: Long,
    val type: String, // SMSType enum as string
    val isSpam: Boolean = false,
    val confidence: Float = 0.0f,
    val modelUsed: String = "",
    val features: String = "", // JSON string of features
    val isAnalyzed: Boolean = false,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey
    val id: String,
    val email: String,
    val displayName: String,
    val phoneNumber: String? = null,
    val profileImageUrl: String? = null,
    val isPremium: Boolean = false,
    val subscriptionType: String = "FREE", // SubscriptionType enum as string
    val subscriptionExpiry: Date? = null,
    val preferences: String = "", // JSON string of preferences
    val createdAt: Date = Date(),
    val lastLoginAt: Date = Date()
)

@Entity(tableName = "analytics")
data class AnalyticsEntity(
    @PrimaryKey
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
    val topSpamSources: String = "", // JSON array string
    val modelUsage: String = "", // JSON object string
    val createdAt: Date = Date()
)

@Entity(tableName = "model_performance")
data class ModelPerformanceEntity(
    @PrimaryKey
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

@Dao
interface SMSDao {
    @Query("SELECT * FROM sms_messages ORDER BY timestamp DESC")
    fun getAllMessages(): Flow<List<SMSMessageEntity>>
    
    @Query("SELECT * FROM sms_messages WHERE isSpam = 1 ORDER BY timestamp DESC")
    fun getSpamMessages(): Flow<List<SMSMessageEntity>>
    
    @Query("SELECT * FROM sms_messages WHERE isSpam = 0 ORDER BY timestamp DESC")
    fun getSafeMessages(): Flow<List<SMSMessageEntity>>
    
    @Query("SELECT * FROM sms_messages WHERE address LIKE :phoneNumber ORDER BY timestamp DESC")
    fun getMessagesByPhoneNumber(phoneNumber: String): Flow<List<SMSMessageEntity>>
    
    @Query("SELECT * FROM sms_messages WHERE timestamp >= :startTime ORDER BY timestamp DESC")
    fun getMessagesSince(startTime: Long): Flow<List<SMSMessageEntity>>
    
    @Query("SELECT COUNT(*) FROM sms_messages WHERE isSpam = 1")
    fun getSpamCount(): Flow<Int>
    
    @Query("SELECT COUNT(*) FROM sms_messages WHERE isSpam = 0")
    fun getSafeCount(): Flow<Int>
    
    @Query("SELECT COUNT(*) FROM sms_messages")
    fun getTotalCount(): Flow<Int>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: SMSMessageEntity): Long
    
    @Update
    suspend fun updateMessage(message: SMSMessageEntity)
    
    @Delete
    suspend fun deleteMessage(message: SMSMessageEntity)
    
    @Query("DELETE FROM sms_messages WHERE isSpam = 1")
    suspend fun deleteAllSpam()
    
    @Query("DELETE FROM sms_messages")
    suspend fun deleteAllMessages()
}

@Dao
interface UserDao {
    @Query("SELECT * FROM users WHERE id = :userId")
    suspend fun getUserById(userId: String): UserEntity?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)
    
    @Update
    suspend fun updateUser(user: UserEntity)
    
    @Delete
    suspend fun deleteUser(user: UserEntity)
}

@Dao
interface AnalyticsDao {
    @Query("SELECT * FROM analytics WHERE userId = :userId ORDER BY date DESC")
    fun getAnalyticsByUser(userId: String): Flow<List<AnalyticsEntity>>
    
    @Query("SELECT * FROM analytics WHERE userId = :userId AND date >= :startDate ORDER BY date DESC")
    fun getAnalyticsSince(userId: String, startDate: Date): Flow<List<AnalyticsEntity>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAnalytics(analytics: AnalyticsEntity)
    
    @Update
    suspend fun updateAnalytics(analytics: AnalyticsEntity)
}

@Dao
interface ModelPerformanceDao {
    @Query("SELECT * FROM model_performance ORDER BY lastUpdated DESC")
    fun getAllModelPerformance(): Flow<List<ModelPerformanceEntity>>
    
    @Query("SELECT * FROM model_performance WHERE modelName = :modelName")
    suspend fun getModelPerformance(modelName: String): ModelPerformanceEntity?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertModelPerformance(performance: ModelPerformanceEntity)
    
    @Update
    suspend fun updateModelPerformance(performance: ModelPerformanceEntity)
}

class Converters {
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? {
        return value?.let { Date(it) }
    }
    
    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? {
        return date?.time
    }
    
    @TypeConverter
    fun fromString(value: String): List<String> {
        return if (value.isEmpty()) emptyList() else value.split(",")
    }
    
    @TypeConverter
    fun fromList(list: List<String>): String {
        return list.joinToString(",")
    }
}
