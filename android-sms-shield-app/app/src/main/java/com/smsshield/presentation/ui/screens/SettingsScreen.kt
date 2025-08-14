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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(navController: NavController) {
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
            SettingsHeader(navController)
            Spacer(modifier = Modifier.height(24.dp))
            ScanningSettingsSection()
            Spacer(modifier = Modifier.height(24.dp))
            NotificationSettingsSection()
            Spacer(modifier = Modifier.height(24.dp))
            PrivacySettingsSection()
            Spacer(modifier = Modifier.height(24.dp))
            AboutSection()
        }
    }
}

@Composable
fun SettingsHeader(navController: NavController) {
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
                    text = "Settings",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937)
                )
            }
        }
    }
}

@Composable
fun ScanningSettingsSection() {
    var autoScan by remember { mutableStateOf(true) }
    var scanIncoming by remember { mutableStateOf(true) }
    var scanOutgoing by remember { mutableStateOf(false) }
    var autoBlockSpam by remember { mutableStateOf(true) }
    
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
                text = "Scanning Settings",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            SettingsSwitchItem(
                icon = Icons.Default.AutoMode,
                title = "Auto-scan SMS",
                subtitle = "Automatically scan incoming messages",
                checked = autoScan,
                onCheckedChange = { autoScan = it }
            )
            
            SettingsSwitchItem(
                icon = Icons.Default.Download,
                title = "Scan incoming SMS",
                subtitle = "Analyze messages you receive",
                checked = scanIncoming,
                onCheckedChange = { scanIncoming = it }
            )
            
            SettingsSwitchItem(
                icon = Icons.Default.Upload,
                title = "Scan outgoing SMS",
                subtitle = "Analyze messages you send",
                checked = scanOutgoing,
                onCheckedChange = { scanOutgoing = it }
            )
            
            SettingsSwitchItem(
                icon = Icons.Default.Block,
                title = "Auto-block spam",
                subtitle = "Automatically block detected spam",
                checked = autoBlockSpam,
                onCheckedChange = { autoBlockSpam = it }
            )
        }
    }
}

@Composable
fun NotificationSettingsSection() {
    var spamNotifications by remember { mutableStateOf(true) }
    var dailyReports by remember { mutableStateOf(false) }
    var weeklyReports by remember { mutableStateOf(true) }
    var soundEnabled by remember { mutableStateOf(true) }
    var vibrationEnabled by remember { mutableStateOf(true) }
    
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
                text = "Notifications",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            SettingsSwitchItem(
                icon = Icons.Default.Warning,
                title = "Spam alerts",
                subtitle = "Notify when spam is detected",
                checked = spamNotifications,
                onCheckedChange = { spamNotifications = it }
            )
            
            SettingsSwitchItem(
                icon = Icons.Default.Assessment,
                title = "Daily reports",
                subtitle = "Receive daily scanning summaries",
                checked = dailyReports,
                onCheckedChange = { dailyReports = it }
            )
            
            SettingsSwitchItem(
                icon = Icons.Default.Analytics,
                title = "Weekly reports",
                subtitle = "Receive weekly analytics reports",
                checked = weeklyReports,
                onCheckedChange = { weeklyReports = it }
            )
            
            SettingsSwitchItem(
                icon = Icons.Default.VolumeUp,
                title = "Sound notifications",
                subtitle = "Play sound for notifications",
                checked = soundEnabled,
                onCheckedChange = { soundEnabled = it }
            )
            
            SettingsSwitchItem(
                icon = Icons.Default.Vibration,
                title = "Vibration",
                subtitle = "Vibrate for notifications",
                checked = vibrationEnabled,
                onCheckedChange = { vibrationEnabled = it }
            )
        }
    }
}

@Composable
fun PrivacySettingsSection() {
    var dataSync by remember { mutableStateOf(true) }
    var analyticsEnabled by remember { mutableStateOf(true) }
    var crashReports by remember { mutableStateOf(false) }
    
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
                text = "Privacy & Data",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            SettingsSwitchItem(
                icon = Icons.Default.CloudSync,
                title = "Cloud sync",
                subtitle = "Sync data across devices",
                checked = dataSync,
                onCheckedChange = { dataSync = it }
            )
            
            SettingsSwitchItem(
                icon = Icons.Default.Analytics,
                title = "Analytics",
                subtitle = "Help improve the app with usage data",
                checked = analyticsEnabled,
                onCheckedChange = { analyticsEnabled = it }
            )
            
            SettingsSwitchItem(
                icon = Icons.Default.BugReport,
                title = "Crash reports",
                subtitle = "Send crash reports to help fix issues",
                checked = crashReports,
                onCheckedChange = { crashReports = it }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = { /* Clear data logic */ },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFEF4444)
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Clear",
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Clear All Data")
            }
        }
    }
}

@Composable
fun AboutSection() {
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
                text = "About",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            AboutItem(
                icon = Icons.Default.Info,
                title = "Version",
                value = "1.0.0"
            )
            
            AboutItem(
                icon = Icons.Default.Update,
                title = "Last updated",
                value = "December 2024"
            )
            
            AboutItem(
                icon = Icons.Default.Code,
                title = "Build number",
                value = "20241201"
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = { /* Check for updates */ },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF6366F1)
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Update,
                    contentDescription = "Update",
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Check for Updates")
            }
        }
    }
}

@Composable
fun SettingsSwitchItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            modifier = Modifier.size(24.dp),
            tint = Color(0xFF6366F1)
        )
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF1F2937)
            )
            
            Text(
                text = subtitle,
                fontSize = 14.sp,
                color = Color(0xFF6B7280)
            )
        }
        
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color(0xFF6366F1),
                checkedTrackColor = Color(0xFF6366F1).copy(alpha = 0.5f)
            )
        )
    }
}

@Composable
fun AboutItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    value: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            modifier = Modifier.size(24.dp),
            tint = Color(0xFF6366F1)
        )
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Text(
            text = title,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF1F2937),
            modifier = Modifier.weight(1f)
        )
        
        Text(
            text = value,
            fontSize = 16.sp,
            color = Color(0xFF6B7280)
        )
    }
}
