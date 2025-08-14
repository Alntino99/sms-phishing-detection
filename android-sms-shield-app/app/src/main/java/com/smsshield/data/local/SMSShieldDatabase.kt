package com.smsshield.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.smsshield.data.local.dao.AnalyticsDao
import com.smsshield.data.local.dao.SMSDao
import com.smsshield.data.local.dao.UserPreferencesDao
import com.smsshield.data.local.entity.AnalyticsEntity
import com.smsshield.data.local.entity.SMSEntity
import com.smsshield.data.local.entity.UserPreferencesEntity
import com.smsshield.data.local.converter.DateConverter
import com.smsshield.data.local.converter.MapConverter

@Database(
    entities = [
        SMSEntity::class,
        UserPreferencesEntity::class,
        AnalyticsEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(DateConverter::class, MapConverter::class)
abstract class SMSShieldDatabase : RoomDatabase() {
    
    abstract fun smsDao(): SMSDao
    abstract fun userPreferencesDao(): UserPreferencesDao
    abstract fun analyticsDao(): AnalyticsDao
    
    companion object {
        const val DATABASE_NAME = "sms_shield_database"
    }
}
