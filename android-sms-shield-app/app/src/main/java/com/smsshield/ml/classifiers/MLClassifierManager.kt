package com.smsshield.ml.classifiers

import android.content.Context
import android.util.Log
import com.smsshield.domain.model.SMSClassification
import com.smsshield.domain.model.SMSFeatures
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.tensorflow.lite.Interpreter
import java.io.File
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import kotlin.math.exp
import kotlin.math.sqrt

class MLClassifierManager(private val context: Context) {
    
    private val tag = "MLClassifierManager"
    private var currentModel: String = "random_forest"
    private val modelCache = mutableMapOf<String, Interpreter>()
    
    companion object {
        const val MODEL_RANDOM_FOREST = "random_forest"
        const val MODEL_SVM = "svm"
        const val MODEL_NAIVE_BAYES = "naive_bayes"
        const val MODEL_LOGISTIC_REGRESSION = "logistic_regression"
        const val MODEL_NEURAL_NETWORK = "neural_network"
        
        private const val MODEL_FILE_SUFFIX = ".tflite"
        private const val FEATURE_COUNT = 17 // Number of features in SMSFeatures
    }
    
    // Available models
    val availableModels = listOf(
        MODEL_RANDOM_FOREST,
        MODEL_SVM,
        MODEL_NAIVE_BAYES,
        MODEL_LOGISTIC_REGRESSION,
        MODEL_NEURAL_NETWORK
    )
    
    init {
        loadModels()
    }
    
    private fun loadModels() {
        try {
            availableModels.forEach { modelName ->
                loadModel(modelName)
            }
            Log.d(tag, "All models loaded successfully")
        } catch (e: Exception) {
            Log.e(tag, "Error loading models: ${e.message}")
        }
    }
    
    private fun loadModel(modelName: String) {
        try {
            val modelFile = getModelFile(modelName)
            if (modelFile.exists()) {
                val interpreter = Interpreter(modelFile)
                modelCache[modelName] = interpreter
                Log.d(tag, "Model $modelName loaded successfully")
            } else {
                Log.w(tag, "Model file for $modelName not found, using fallback classifier")
                // Use fallback classifier for missing models
                modelCache[modelName] = FallbackClassifier()
            }
        } catch (e: Exception) {
            Log.e(tag, "Error loading model $modelName: ${e.message}")
            modelCache[modelName] = FallbackClassifier()
        }
    }
    
    private fun getModelFile(modelName: String): MappedByteBuffer {
        val modelPath = "models/${modelName}${MODEL_FILE_SUFFIX}"
        val file = File(context.getExternalFilesDir(null), modelPath)
        
        if (!file.exists()) {
            // Try to copy from assets if not in external storage
            copyModelFromAssets(modelName)
        }
        
        return file.inputStream().channel.use { channel ->
            channel.map(FileChannel.MapMode.READ_ONLY, 0, file.length())
        }
    }
    
    private fun copyModelFromAssets(modelName: String) {
        try {
            val assetManager = context.assets
            val inputStream = assetManager.open("models/${modelName}${MODEL_FILE_SUFFIX}")
            val outputFile = File(context.getExternalFilesDir(null), "models/${modelName}${MODEL_FILE_SUFFIX}")
            
            outputFile.parentFile?.mkdirs()
            outputFile.outputStream().use { outputStream ->
                inputStream.copyTo(outputStream)
            }
            inputStream.close()
        } catch (e: Exception) {
            Log.e(tag, "Error copying model from assets: ${e.message}")
        }
    }
    
    suspend fun classifySMS(
        features: SMSFeatures,
        modelName: String = currentModel
    ): SMSClassificationResult = withContext(Dispatchers.Default) {
        try {
            val interpreter = modelCache[modelName] ?: throw Exception("Model $modelName not found")
            
            val startTime = System.currentTimeMillis()
            val result = when (interpreter) {
                is FallbackClassifier -> interpreter.classify(features)
                else -> classifyWithTensorFlow(interpreter, features)
            }
            val processingTime = System.currentTimeMillis() - startTime
            
            SMSClassificationResult(
                classification = result.classification,
                confidence = result.confidence,
                modelUsed = modelName,
                processingTime = processingTime
            )
        } catch (e: Exception) {
            Log.e(tag, "Error classifying SMS: ${e.message}")
            SMSClassificationResult(
                classification = SMSClassification.UNKNOWN,
                confidence = 0.0f,
                modelUsed = modelName,
                processingTime = 0
            )
        }
    }
    
    private fun classifyWithTensorFlow(interpreter: Interpreter, features: SMSFeatures): ClassificationResult {
        // Convert features to input tensor
        val inputBuffer = ByteBuffer.allocateDirect(FEATURE_COUNT * 4) // 4 bytes per float
        inputBuffer.order(ByteOrder.nativeOrder())
        
        // Add features to buffer in the same order as training
        inputBuffer.putFloat(features.messageLength.toFloat())
        inputBuffer.putFloat(features.wordCount.toFloat())
        inputBuffer.putFloat(if (features.hasUrls) 1.0f else 0.0f)
        inputBuffer.putFloat(if (features.hasPhoneNumbers) 1.0f else 0.0f)
        inputBuffer.putFloat(if (features.hasCurrencySymbols) 1.0f else 0.0f)
        inputBuffer.putFloat(if (features.hasUrgentWords) 1.0f else 0.0f)
        inputBuffer.putFloat(if (features.hasSpamKeywords) 1.0f else 0.0f)
        inputBuffer.putFloat(features.senderReputation)
        inputBuffer.putFloat(features.timeOfDay.toFloat())
        inputBuffer.putFloat(features.dayOfWeek.toFloat())
        inputBuffer.putFloat(features.sentiment)
        inputBuffer.putFloat(features.complexity)
        inputBuffer.putFloat(features.specialCharacters.toFloat())
        inputBuffer.putFloat(features.uppercaseRatio)
        inputBuffer.putFloat(features.digitRatio)
        inputBuffer.putFloat(0.0f) // Placeholder for language encoding
        
        inputBuffer.rewind()
        
        // Prepare output buffer
        val outputBuffer = ByteBuffer.allocateDirect(3 * 4) // 3 classes * 4 bytes per float
        outputBuffer.order(ByteOrder.nativeOrder())
        
        // Run inference
        interpreter.run(inputBuffer, outputBuffer)
        
        // Process output
        outputBuffer.rewind()
        val safeScore = outputBuffer.float
        val spamScore = outputBuffer.float
        val suspiciousScore = outputBuffer.float
        
        // Determine classification and confidence
        val maxScore = maxOf(safeScore, spamScore, suspiciousScore)
        val classification = when {
            spamScore == maxScore -> SMSClassification.SPAM
            suspiciousScore == maxScore -> SMSClassification.SUSPICIOUS
            else -> SMSClassification.SAFE
        }
        
        // Convert to confidence (0-1)
        val confidence = (maxScore / (safeScore + spamScore + suspiciousScore)).coerceIn(0.0f, 1.0f)
        
        return ClassificationResult(classification, confidence)
    }
    
    fun setCurrentModel(modelName: String) {
        if (availableModels.contains(modelName)) {
            currentModel = modelName
            Log.d(tag, "Current model set to: $modelName")
        } else {
            Log.w(tag, "Invalid model name: $modelName")
        }
    }
    
    fun getCurrentModel(): String = currentModel
    
    fun getModelAccuracy(modelName: String): Float {
        // This would typically be loaded from a configuration file or database
        // For now, return default accuracies based on typical performance
        return when (modelName) {
            MODEL_RANDOM_FOREST -> 0.95f
            MODEL_SVM -> 0.92f
            MODEL_NAIVE_BAYES -> 0.88f
            MODEL_LOGISTIC_REGRESSION -> 0.90f
            MODEL_NEURAL_NETWORK -> 0.94f
            else -> 0.85f
        }
    }
    
    fun isModelLoaded(modelName: String): Boolean {
        return modelCache.containsKey(modelName)
    }
    
    fun cleanup() {
        modelCache.values.forEach { interpreter ->
            if (interpreter !is FallbackClassifier) {
                interpreter.close()
            }
        }
        modelCache.clear()
    }
    
    // Fallback classifier for when TensorFlow models are not available
    private class FallbackClassifier : Interpreter(null) {
        fun classify(features: SMSFeatures): ClassificationResult {
            // Simple rule-based classification as fallback
            var spamScore = 0.0f
            
            if (features.hasUrls) spamScore += 0.3f
            if (features.hasCurrencySymbols) spamScore += 0.2f
            if (features.hasUrgentWords) spamScore += 0.2f
            if (features.hasSpamKeywords) spamScore += 0.4f
            if (features.specialCharacters > 10) spamScore += 0.1f
            if (features.uppercaseRatio > 0.5f) spamScore += 0.1f
            
            val classification = when {
                spamScore > 0.7f -> SMSClassification.SPAM
                spamScore > 0.4f -> SMSClassification.SUSPICIOUS
                else -> SMSClassification.SAFE
            }
            
            return ClassificationResult(classification, spamScore.coerceIn(0.0f, 1.0f))
        }
        
        override fun run(input: Any?, output: Any?) {
            // Not used in fallback classifier
        }
        
        override fun run(input: Any?, output: Any?, options: Interpreter.Options?) {
            // Not used in fallback classifier
        }
    }
    
    private data class ClassificationResult(
        val classification: SMSClassification,
        val confidence: Float
    )
}

data class SMSClassificationResult(
    val classification: SMSClassification,
    val confidence: Float,
    val modelUsed: String,
    val processingTime: Long
)
