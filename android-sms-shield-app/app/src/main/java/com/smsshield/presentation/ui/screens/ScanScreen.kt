package com.smsshield.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScanScreen(navController: NavController) {
    var isScanning by remember { mutableStateOf(false) }
    var selectedModel by remember { mutableStateOf("TensorFlow Lite") }
    var scanProgress by remember { mutableStateOf(0f) }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF6366F1).copy(alpha = 0.1f),
                        Color(0xFF10B981).copy(alpha = 0.1f),
                        Color(0xFFF59E0B).copy(alpha = 0.1f)
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // Header
            ScanHeader(navController)
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Model Selection
            ModelSelectionSection(selectedModel) { selectedModel = it }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Scan Controls
            ScanControlsSection(
                isScanning = isScanning,
                onScanToggle = { isScanning = !isScanning },
                scanProgress = scanProgress
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Real-time Results
            RealTimeResultsSection()
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Scan Statistics
            ScanStatisticsSection()
        }
    }
}

@Composable
fun ScanHeader(navController: NavController) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.9f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { navController.navigateUp() }) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = Color(0xFF6366F1)
                    )
                }
                
                Spacer(modifier = Modifier.width(12.dp))
                
                Text(
                    text = "SMS Scanner",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937)
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Text(
                text = "AI-powered SMS analysis with Ghana-specific detection",
                fontSize = 16.sp,
                color = Color(0xFF6B7280),
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun ModelSelectionSection(selectedModel: String, onModelSelected: (String) -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.9f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = "Select AI Model",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            val models = listOf(
                "TensorFlow Lite" to "Fast, lightweight model for real-time scanning",
                "Ghana-Specific Model" to "Trained on Ghana SMS patterns",
                "Hybrid Model" to "Combines multiple detection methods",
                "Custom Model" to "User-trained model for specific patterns"
            )
            
            models.forEach { (model, description) ->
                ModelOption(
                    name = model,
                    description = description,
                    isSelected = selectedModel == model,
                    onSelect = { onModelSelected(model) }
                )
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

@Composable
fun ModelOption(
    name: String,
    description: String,
    isSelected: Boolean,
    onSelect: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) Color(0xFF6366F1).copy(alpha = 0.1f) else Color.Transparent
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            RadioButton(
                selected = isSelected,
                onClick = onSelect,
                colors = RadioButtonDefaults.colors(
                    selectedColor = Color(0xFF6366F1)
                )
            )
            
            Spacer(modifier = Modifier.width(12.dp))
            
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = name,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF1F2937)
                )
                
                Text(
                    text = description,
                    fontSize = 14.sp,
                    color = Color(0xFF6B7280)
                )
            }
        }
    }
}

@Composable
fun ScanControlsSection(
    isScanning: Boolean,
    onScanToggle: () -> Unit,
    scanProgress: Float
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.9f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Scan Controls",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(20.dp))
            
            if (isScanning) {
                CircularProgressIndicator(
                    progress = scanProgress,
                    modifier = Modifier.size(80.dp),
                    color = Color(0xFF6366F1),
                    strokeWidth = 8.dp
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = "Scanning SMS messages...",
                    fontSize = 16.sp,
                    color = Color(0xFF6B7280)
                )
                
                Text(
                    text = "${(scanProgress * 100).toInt()}%",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF6366F1)
                )
            } else {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Scan",
                    modifier = Modifier.size(80.dp),
                    tint = Color(0xFF6366F1)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = "Ready to scan",
                    fontSize = 16.sp,
                    color = Color(0xFF6B7280)
                )
            }
            
            Spacer(modifier = Modifier.height(20.dp))
            
            Button(
                onClick = onScanToggle,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isScanning) Color(0xFFEF4444) else Color(0xFF6366F1)
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = if (isScanning) Icons.Default.Stop else Icons.Default.PlayArrow,
                    contentDescription = if (isScanning) "Stop" else "Start",
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(if (isScanning) "Stop Scanning" else "Start Scanning")
            }
        }
    }
}

@Composable
fun RealTimeResultsSection() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.9f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = "Real-time Results",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            ScanResultItem(
                message = "Congratulations! You've won $10,000...",
                sender = "+233 24 XXX XXXX",
                result = "SPAM",
                confidence = "95.2%",
                isSpam = true
            )
            
            ScanResultItem(
                message = "Your MTN Ghana account has been credited...",
                sender = "MTN Ghana",
                result = "SAFE",
                confidence = "87.1%",
                isSpam = false
            )
            
            ScanResultItem(
                message = "URGENT: Your bank account has been suspended...",
                sender = "Unknown",
                result = "PHISHING",
                confidence = "98.7%",
                isSpam = true
            )
        }
    }
}

@Composable
fun ScanResultItem(
    message: String,
    sender: String,
    result: String,
    confidence: String,
    isSpam: Boolean
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSpam) Color(0xFFFEF2F2) else Color(0xFFF0FDF4)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = if (isSpam) Icons.Default.Warning else Icons.Default.CheckCircle,
                    contentDescription = result,
                    modifier = Modifier.size(20.dp),
                    tint = if (isSpam) Color(0xFFEF4444) else Color(0xFF10B981)
                )
                
                Spacer(modifier = Modifier.width(8.dp))
                
                Text(
                    text = result,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isSpam) Color(0xFFEF4444) else Color(0xFF10B981)
                )
                
                Spacer(modifier = Modifier.width(8.dp))
                
                Text(
                    text = "($confidence)",
                    fontSize = 12.sp,
                    color = Color(0xFF6B7280)
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = sender,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF6B7280)
            )
            
            Text(
                text = message,
                fontSize = 14.sp,
                color = Color(0xFF1F2937),
                maxLines = 2
            )
        }
    }
}

@Composable
fun ScanStatisticsSection() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.9f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = "Scan Statistics",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                StatItem("Messages Scanned", "247", Color(0xFF10B981))
                StatItem("Spam Detected", "23", Color(0xFFEF4444))
                StatItem("Accuracy", "94.2%", Color(0xFF6366F1))
            }
        }
    }
}

@Composable
fun StatItem(label: String, value: String, color: Color) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = value,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = color
        )
        
        Text(
            text = label,
            fontSize = 12.sp,
            color = Color(0xFF6B7280),
            textAlign = TextAlign.Center
        )
    }
}
