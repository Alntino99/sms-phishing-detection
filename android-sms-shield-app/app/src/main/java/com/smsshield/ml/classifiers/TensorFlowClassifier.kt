package com.smsshield.ml.classifiers

import android.content.Context
import android.content.res.AssetManager
import com.smsshield.domain.model.SMSMessage
import com.smsshield.domain.model.SpamCategory
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.common.FileUtil
import org.tensorflow.lite.support.common.TensorOperator
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer
import java.io.File
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.concurrent.Executors
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

class TensorFlowClassifier(
    private val context: Context,
    private val modelName: String = "sms_spam_model.tflite"
) : BaseSMSClassifier() {
    
    override val modelName: String = "TensorFlow Lite SMS Classifier"
    override val modelVersion: String = "1.0.0"
    
    private var interpreter: Interpreter? = null
    private val executor = Executors.newSingleThreadExecutor()
    private val ghanaKeywords = setOf(
        "mtn", "vodafone", "airtel", "glo", "ghana", "cedi", "gh₵", "ghs",
        "ecobank", "gt bank", "zenith", "cal bank", "fidelity", "access bank",
        "ghana post", "ghana police", "ghana revenue", "ghanapost", "ghanapolice",
        "ghanarevenue", "ghanacard", "ghanapassport", "ghanadrivers", "ghanavoters"
    )
    
    private val spamKeywords = setOf(
        "congratulations", "winner", "prize", "claim", "urgent", "limited time",
        "free", "cash", "money", "lottery", "inheritance", "bank transfer",
        "account suspended", "verify", "confirm", "click here", "call now",
        "act now", "limited offer", "exclusive", "secret", "guaranteed",
        "risk free", "no obligation", "no purchase", "no cost", "no fee"
    )
    
    init {
        loadModel()
    }
    
    private fun loadModel() {
        try {
            val modelFile = File(context.getExternalFilesDir(null), modelName)
            if (!modelFile.exists()) {
                // Copy from assets if not exists
                copyModelFromAssets()
            }
            
            val options = Interpreter.Options().apply {
                setNumThreads(4)
                setUseNNAPI(true)
            }
            
            interpreter = Interpreter(modelFile, options)
        } catch (e: Exception) {
            // Fallback to rule-based classification if model fails to load
            println("Failed to load TensorFlow model: ${e.message}")
        }
    }
    
    private fun copyModelFromAssets() {
        try {
            val assetManager = context.assets
            val inputStream = assetManager.open(modelName)
            val outputFile = File(context.getExternalFilesDir(null), modelName)
            outputFile.outputStream().use { outputStream ->
                inputStream.copyTo(outputStream)
            }
        } catch (e: Exception) {
            println("Failed to copy model from assets: ${e.message}")
        }
    }
    
    override suspend fun classify(message: SMSMessage): ClassificationResult = suspendCoroutine { continuation ->
        executor.execute {
            try {
                val startTime = System.currentTimeMillis()
                val features = extractFeatures(message)
                
                val result = if (interpreter != null) {
                    classifyWithTensorFlow(features)
                } else {
                    classifyWithRules(features)
                }
                
                val processingTime = System.currentTimeMillis() - startTime
                
                continuation.resume(ClassificationResult(
                    messageId = message.id,
                    category = result.first,
                    confidence = result.second,
                    processingTime = processingTime,
                    features = features,
                    modelName = this.modelName
                ))
            } catch (e: Exception) {
                continuation.resumeWithException(e)
            }
        }
    }
    
    private fun classifyWithTensorFlow(features: Map<String, Float>): Pair<SpamCategory, Float> {
        val interpreter = interpreter ?: return classifyWithRules(features)
        
        try {
            // Prepare input tensor
            val inputBuffer = TensorBuffer.createFixedSize(intArrayOf(1, features.size), org.tensorflow.lite.DataType.FLOAT32)
            val inputArray = features.values.toFloatArray()
            inputBuffer.loadArray(inputArray)
            
            // Prepare output tensor
            val outputBuffer = TensorBuffer.createFixedSize(intArrayOf(1, 2), org.tensorflow.lite.DataType.FLOAT32)
            
            // Run inference
            interpreter.run(inputBuffer.buffer, outputBuffer.buffer)
            
            // Get results
            val outputArray = outputBuffer.floatArray
            val spamProbability = outputArray[1]
            val safeProbability = outputArray[0]
            
            val category = if (spamProbability > safeProbability) SpamCategory.SPAM else SpamCategory.SAFE
            val confidence = maxOf(spamProbability, safeProbability)
            
            return Pair(category, confidence)
        } catch (e: Exception) {
            return classifyWithRules(features)
        }
    }
    
    private fun classifyWithRules(features: Map<String, Float>): Pair<SpamCategory, Float> {
        var spamScore = 0.0f
        var totalScore = 0.0f
        
        // Check for spam keywords
        val spamKeywordCount = features["spam_keyword_count"] ?: 0f
        spamScore += spamKeywordCount * 0.3f
        totalScore += 0.3f
        
        // Check for Ghana-specific keywords (lower spam score for legitimate Ghana services)
        val ghanaKeywordCount = features["ghana_keyword_count"] ?: 0f
        spamScore -= ghanaKeywordCount * 0.1f // Reduce spam score for Ghana keywords
        totalScore += 0.1f
        
        // Check message length
        val messageLength = features["message_length"] ?: 0f
        if (messageLength > 160) spamScore += 0.1f // Longer messages might be spam
        totalScore += 0.1f
        
        // Check for URLs
        val hasUrls = features["has_urls"] ?: 0f
        spamScore += hasUrls * 0.2f
        totalScore += 0.2f
        
        // Check for phone numbers
        val hasPhoneNumbers = features["has_phone_numbers"] ?: 0f
        spamScore += hasPhoneNumbers * 0.15f
        totalScore += 0.15f
        
        // Check for urgency words
        val urgencyWords = features["urgency_words"] ?: 0f
        spamScore += urgencyWords * 0.25f
        totalScore += 0.25f
        
        val spamProbability = if (totalScore > 0) spamScore / totalScore else 0.0f
        val category = if (spamProbability > 0.5f) SpamCategory.SPAM else SpamCategory.SAFE
        
        return Pair(category, maxOf(spamProbability, 1 - spamProbability))
    }
    
    private fun extractFeatures(message: SMSMessage): Map<String, Float> {
        val body = message.body.lowercase()
        val words = body.split("\\s+".toRegex())
        
        val features = mutableMapOf<String, Float>()
        
        // Message length
        features["message_length"] = body.length.toFloat()
        
        // Word count
        features["word_count"] = words.size.toFloat()
        
        // Spam keyword count
        val spamKeywordCount = words.count { word ->
            spamKeywords.any { keyword -> word.contains(keyword) }
        }
        features["spam_keyword_count"] = spamKeywordCount.toFloat()
        
        // Ghana keyword count
        val ghanaKeywordCount = words.count { word ->
            ghanaKeywords.any { keyword -> word.contains(keyword) }
        }
        features["ghana_keyword_count"] = ghanaKeywordCount.toFloat()
        
        // Has URLs
        features["has_urls"] = if (body.contains("http") || body.contains("www")) 1.0f else 0.0f
        
        // Has phone numbers
        features["has_phone_numbers"] = if (body.contains(Regex("\\+?\\d{10,}"))) 1.0f else 0.0f
        
        // Urgency words
        val urgencyWords = words.count { word ->
            word.contains("urgent") || word.contains("now") || word.contains("immediate") ||
            word.contains("limited") || word.contains("expire") || word.contains("last")
        }
        features["urgency_words"] = urgencyWords.toFloat()
        
        // Special characters
        features["special_characters"] = body.count { !it.isLetterOrDigit() && !it.isWhitespace() }.toFloat()
        
        // Uppercase ratio
        val uppercaseCount = body.count { it.isUpperCase() }
        features["uppercase_ratio"] = if (body.isNotEmpty()) uppercaseCount.toFloat() / body.length else 0.0f
        
        // Digit ratio
        val digitCount = body.count { it.isDigit() }
        features["digit_ratio"] = if (body.isNotEmpty()) digitCount.toFloat() / body.length else 0.0f
        
        return features
    }
    
    override suspend fun batchClassify(messages: List<SMSMessage>): List<ClassificationResult> {
        return messages.map { message ->
            classify(message)
        }
    }
    
    override suspend fun updateModel(modelPath: String): Boolean {
        return try {
            val newModelFile = File(modelPath)
            if (newModelFile.exists()) {
                val currentModelFile = File(context.getExternalFilesDir(null), modelName)
                newModelFile.copyTo(currentModelFile, overwrite = true)
                loadModel()
                true
            } else {
                false
            }
        } catch (e: Exception) {
            false
        }
    }
    
    fun close() {
        interpreter?.close()
        executor.shutdown()
    }
}
