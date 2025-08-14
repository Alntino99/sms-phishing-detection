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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavController) {
    val scrollState = rememberScrollState()
    
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
                .verticalScroll(scrollState)
                .padding(16.dp)
        ) {
            // Hero Section
            HeroSection(navController)
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Quick Stats
            QuickStatsSection()
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Features Section
            FeaturesSection(navController)
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Recent Activity
            RecentActivitySection()
        }
    }
}

@Composable
fun HeroSection(navController: NavController) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(200.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.9f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.Shield,
                contentDescription = "Shield",
                modifier = Modifier.size(48.dp),
                tint = Color(0xFF6366F1)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "SMS Shield",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Text(
                text = "AI-Powered SMS Protection",
                fontSize = 16.sp,
                color = Color(0xFF6B7280),
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = { navController.navigate("scan") },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF6366F1)
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Scan",
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Start Scanning")
            }
        }
    }
}

@Composable
fun QuickStatsSection() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        StatCard(
            title = "Messages Scanned",
            value = "1,247",
            icon = Icons.Default.Message,
            color = Color(0xFF10B981),
            modifier = Modifier.weight(1f)
        )
        
        StatCard(
            title = "Spam Detected",
            value = "89",
            icon = Icons.Default.Warning,
            color = Color(0xFFEF4444),
            modifier = Modifier.weight(1f)
        )
        
        StatCard(
            title = "Protection Rate",
            value = "92.8%",
            icon = Icons.Default.Shield,
            color = Color(0xFF6366F1),
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.9f)
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
                color = Color(0xFF1F2937)
            )
            
            Text(
                text = title,
                fontSize = 12.sp,
                color = Color(0xFF6B7280),
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun FeaturesSection(navController: NavController) {
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
                text = "Key Features",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            FeatureItem(
                icon = Icons.Default.Psychology,
                title = "AI-Powered Detection",
                description = "Advanced ML models trained on Ghana-specific spam patterns",
                onClick = { navController.navigate("scan") }
            )
            
            FeatureItem(
                icon = Icons.Default.Analytics,
                title = "Real-time Analytics",
                description = "Track spam trends and model performance",
                onClick = { navController.navigate("analytics") }
            )
            
            FeatureItem(
                icon = Icons.Default.Notifications,
                title = "Smart Notifications",
                description = "Get alerts for suspicious messages",
                onClick = { navController.navigate("settings") }
            )
            
            FeatureItem(
                icon = Icons.Default.Security,
                title = "Privacy First",
                description = "All processing happens locally on your device",
                onClick = { navController.navigate("profile") }
            )
        }
    }
}

@Composable
fun FeatureItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    description: String,
    onClick: () -> Unit
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
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                modifier = Modifier.size(32.dp),
                tint = Color(0xFF6366F1)
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = title,
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
            
            Icon(
                imageVector = Icons.Default.ArrowForward,
                contentDescription = "Navigate",
                modifier = Modifier.size(20.dp),
                tint = Color(0xFF9CA3AF)
            )
        }
    }
}

@Composable
fun RecentActivitySection() {
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
                text = "Recent Activity",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            ActivityItem(
                message = "Spam detected from +233 24 XXX XXXX",
                time = "2 minutes ago",
                isSpam = true
            )
            
            ActivityItem(
                message = "Safe message from MTN Ghana",
                time = "5 minutes ago",
                isSpam = false
            )
            
            ActivityItem(
                message = "Spam detected from unknown sender",
                time = "12 minutes ago",
                isSpam = true
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            TextButton(
                onClick = { navController.navigate("sms_list") },
                modifier = Modifier.align(Alignment.End)
            ) {
                Text("View All Messages")
                Icon(
                    imageVector = Icons.Default.ArrowForward,
                    contentDescription = "View All",
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

@Composable
fun ActivityItem(
    message: String,
    time: String,
    isSpam: Boolean
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = if (isSpam) Icons.Default.Warning else Icons.Default.CheckCircle,
            contentDescription = if (isSpam) "Spam" else "Safe",
            modifier = Modifier.size(20.dp),
            tint = if (isSpam) Color(0xFFEF4444) else Color(0xFF10B981)
        )
        
        Spacer(modifier = Modifier.width(12.dp))
        
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = message,
                fontSize = 14.sp,
                color = Color(0xFF1F2937)
            )
            
            Text(
                text = time,
                fontSize = 12.sp,
                color = Color(0xFF6B7280)
            )
        }
    }
}
