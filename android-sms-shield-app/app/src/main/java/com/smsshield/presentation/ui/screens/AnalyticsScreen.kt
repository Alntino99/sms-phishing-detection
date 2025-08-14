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
fun AnalyticsScreen(navController: NavController) {
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
            AnalyticsHeader(navController)
            Spacer(modifier = Modifier.height(24.dp))
            AnalyticsOverview()
            Spacer(modifier = Modifier.height(24.dp))
            SpamTrendsChart()
            Spacer(modifier = Modifier.height(24.dp))
            ModelPerformanceSection()
            Spacer(modifier = Modifier.height(24.dp))
            TopSpamSourcesSection()
        }
    }
}

@Composable
fun AnalyticsHeader(navController: NavController) {
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
                    text = "Analytics",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937)
                )
                
                Spacer(modifier = Modifier.weight(1f))
                
                IconButton(onClick = { /* Export data */ }) {
                    Icon(
                        imageVector = Icons.Default.Download,
                        contentDescription = "Export",
                        tint = Color(0xFF6366F1)
                    )
                }
            }
        }
    }
}

@Composable
fun AnalyticsOverview() {
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
                text = "Overview (Last 30 Days)",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                AnalyticsStatCard(
                    title = "Total Messages",
                    value = "1,247",
                    change = "+12%",
                    isPositive = true,
                    icon = Icons.Default.Message,
                    color = Color(0xFF10B981),
                    modifier = Modifier.weight(1f)
                )
                
                AnalyticsStatCard(
                    title = "Spam Detected",
                    value = "89",
                    change = "-5%",
                    isPositive = true,
                    icon = Icons.Default.Warning,
                    color = Color(0xFFEF4444),
                    modifier = Modifier.weight(1f)
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                AnalyticsStatCard(
                    title = "Protection Rate",
                    value = "92.8%",
                    change = "+2.1%",
                    isPositive = true,
                    icon = Icons.Default.Shield,
                    color = Color(0xFF6366F1),
                    modifier = Modifier.weight(1f)
                )
                
                AnalyticsStatCard(
                    title = "Money Saved",
                    value = "₵450",
                    change = "+₵25",
                    isPositive = true,
                    icon = Icons.Default.AttachMoney,
                    color = Color(0xFFF59E0B),
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
fun AnalyticsStatCard(
    title: String,
    value: String,
    change: String,
    isPositive: Boolean,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = color.copy(alpha = 0.1f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                modifier = Modifier.size(24.dp),
                tint = color
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = value,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = color
            )
            
            Text(
                text = title,
                fontSize = 12.sp,
                color = Color(0xFF6B7280),
                textAlign = TextAlign.Center
            )
            
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = if (isPositive) Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                    contentDescription = "Trend",
                    modifier = Modifier.size(16.dp),
                    tint = if (isPositive) Color(0xFF10B981) else Color(0xFFEF4444)
                )
                
                Spacer(modifier = Modifier.width(4.dp))
                
                Text(
                    text = change,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = if (isPositive) Color(0xFF10B981) else Color(0xFFEF4444)
                )
            }
        }
    }
}

@Composable
fun SpamTrendsChart() {
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
                text = "Spam Trends (Last 7 Days)",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Placeholder for chart
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .background(Color(0xFFF3F4F6), RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.Analytics,
                        contentDescription = "Chart",
                        modifier = Modifier.size(48.dp),
                        tint = Color(0xFF9CA3AF)
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Text(
                        text = "Interactive chart will be implemented",
                        fontSize = 14.sp,
                        color = Color(0xFF6B7280),
                        textAlign = TextAlign.Center
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Trend summary
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                TrendItem("Mon", 12, Color(0xFF6366F1))
                TrendItem("Tue", 8, Color(0xFF10B981))
                TrendItem("Wed", 15, Color(0xFFEF4444))
                TrendItem("Thu", 6, Color(0xFF10B981))
                TrendItem("Fri", 18, Color(0xFFEF4444))
                TrendItem("Sat", 10, Color(0xFF6366F1))
                TrendItem("Sun", 7, Color(0xFF10B981))
            }
        }
    }
}

@Composable
fun TrendItem(day: String, count: Int, color: Color) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = count.toString(),
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = color
        )
        
        Text(
            text = day,
            fontSize = 12.sp,
            color = Color(0xFF6B7280)
        )
    }
}

@Composable
fun ModelPerformanceSection() {
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
                text = "Model Performance",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            ModelPerformanceItem(
                modelName = "TensorFlow Lite",
                accuracy = "94.2%",
                precision = "92.1%",
                recall = "96.3%",
                totalPredictions = 1247
            )
            
            ModelPerformanceItem(
                modelName = "Ghana-Specific",
                accuracy = "96.8%",
                precision = "95.4%",
                recall = "97.2%",
                totalPredictions = 856
            )
            
            ModelPerformanceItem(
                modelName = "Hybrid Model",
                accuracy = "95.7%",
                precision = "93.8%",
                recall = "96.9%",
                totalPredictions = 1023
            )
        }
    }
}

@Composable
fun ModelPerformanceItem(
    modelName: String,
    accuracy: String,
    precision: String,
    recall: String,
    totalPredictions: Int
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.Transparent
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = modelName,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                PerformanceMetric("Accuracy", accuracy, Color(0xFF10B981))
                PerformanceMetric("Precision", precision, Color(0xFF6366F1))
                PerformanceMetric("Recall", recall, Color(0xFFF59E0B))
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "$totalPredictions predictions",
                fontSize = 12.sp,
                color = Color(0xFF6B7280)
            )
        }
    }
}

@Composable
fun PerformanceMetric(
    label: String,
    value: String,
    color: Color
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = value,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = color
        )
        
        Text(
            text = label,
            fontSize = 12.sp,
            color = Color(0xFF6B7280)
        )
    }
}

@Composable
fun TopSpamSourcesSection() {
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
                text = "Top Spam Sources",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            SpamSourceItem("+233 24 XXX XXXX", 15, Color(0xFFEF4444))
            SpamSourceItem("+233 20 XXX XXXX", 12, Color(0xFFF59E0B))
            SpamSourceItem("+233 26 XXX XXXX", 8, Color(0xFF6366F1))
            SpamSourceItem("+233 27 XXX XXXX", 6, Color(0xFF10B981))
            SpamSourceItem("+233 28 XXX XXXX", 4, Color(0xFF8B5CF6))
        }
    }
}

@Composable
fun SpamSourceItem(
    phoneNumber: String,
    count: Int,
    color: Color
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(12.dp)
                .background(color, RoundedCornerShape(6.dp))
        )
        
        Spacer(modifier = Modifier.width(12.dp))
        
        Text(
            text = phoneNumber,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF1F2937),
            modifier = Modifier.weight(1f)
        )
        
        Text(
            text = "$count messages",
            fontSize = 14.sp,
            color = Color(0xFF6B7280)
        )
    }
}
