package com.smsshield.ml.classifiers

import com.smsshield.domain.model.SMSMessage
import com.smsshield.domain.model.SpamCategory

interface SMSClassifier {
    suspend fun classify(message: SMSMessage): ClassificationResult
    suspend fun batchClassify(messages: List<SMSMessage>): List<ClassificationResult>
    fun getModelInfo(): ModelInfo
    suspend fun updateModel(modelPath: String): Boolean
    suspend fun getModelPerformance(): ModelPerformance
}

data class ClassificationResult(
    val messageId: Long,
    val category: SpamCategory,
    val confidence: Float,
    val processingTime: Long,
    val features: Map<String, Float>,
    val modelName: String
)

data class ModelInfo(
    val name: String,
    val version: String,
    val accuracy: Float,
    val lastUpdated: Long,
    val modelSize: Long,
    val isGhanaSpecific: Boolean = false
)

data class ModelPerformance(
    val accuracy: Float,
    val precision: Float,
    val recall: Float,
    val f1Score: Float,
    val totalPredictions: Int,
    val averageInferenceTime: Long
)

abstract class BaseSMSClassifier : SMSClassifier {
    
    protected abstract val modelName: String
    protected abstract val modelVersion: String
    protected var modelAccuracy: Float = 0.0f
    protected var totalPredictions: Int = 0
    protected var correctPredictions: Int = 0
    protected var totalInferenceTime: Long = 0L
    
    override fun getModelInfo(): ModelInfo {
        return ModelInfo(
            name = modelName,
            version = modelVersion,
            accuracy = modelAccuracy,
            lastUpdated = System.currentTimeMillis(),
            modelSize = 0L, // Will be calculated from actual model file
            isGhanaSpecific = modelName.contains("ghana", ignoreCase = true)
        )
    }
    
    override suspend fun getModelPerformance(): ModelPerformance {
        val precision = if (totalPredictions > 0) correctPredictions.toFloat() / totalPredictions else 0.0f
        val recall = precision // Simplified for now
        val f1Score = if (precision + recall > 0) 2 * (precision * recall) / (precision + recall) else 0.0f
        val avgInferenceTime = if (totalPredictions > 0) totalInferenceTime / totalPredictions else 0L
        
        return ModelPerformance(
            accuracy = modelAccuracy,
            precision = precision,
            recall = recall,
            f1Score = f1Score,
            totalPredictions = totalPredictions,
            averageInferenceTime = avgInferenceTime
        )
    }
    
    protected fun updatePerformanceMetrics(isCorrect: Boolean, inferenceTime: Long) {
        totalPredictions++
        if (isCorrect) correctPredictions++
        totalInferenceTime += inferenceTime
        modelAccuracy = if (totalPredictions > 0) correctPredictions.toFloat() / totalPredictions else 0.0f
    }
}
