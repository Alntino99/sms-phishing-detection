package com.smsshield.presentation.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SMSListScreen(navController: NavController) {
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "Spam", "Safe", "Phishing")
    
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
            modifier = Modifier.fillMaxSize()
        ) {
            SMSListHeader(navController, selectedFilter, filters) { selectedFilter = it }
            
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(getSampleSMSMessages(selectedFilter)) { message ->
                    SMSMessageItem(message = message)
                }
            }
        }
    }
}

@Composable
fun SMSListHeader(
    navController: NavController,
    selectedFilter: String,
    filters: List<String>,
    onFilterSelected: (String) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
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
                    text = "SMS Messages",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937)
                )
                
                Spacer(modifier = Modifier.weight(1f))
                
                IconButton(onClick = { /* Search functionality */ }) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = Color(0xFF6366F1)
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Filter tabs
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                filters.forEach { filter ->
                    FilterChip(
                        selected = selectedFilter == filter,
                        onClick = { onFilterSelected(filter) },
                        label = { Text(filter) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Color(0xFF6366F1),
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }
        }
    }
}

@Composable
fun SMSMessageItem(message: SMSMessageData) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (message.isSpam) 
                Color(0xFFFEF2F2) else Color(0xFFF0FDF4)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = if (message.isSpam) Icons.Default.Warning else Icons.Default.CheckCircle,
                    contentDescription = if (message.isSpam) "Spam" else "Safe",
                    modifier = Modifier.size(20.dp),
                    tint = if (message.isSpam) Color(0xFFEF4444) else Color(0xFF10B981)
                )
                
                Spacer(modifier = Modifier.width(12.dp))
                
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = message.sender,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF1F2937)
                    )
                    
                    Text(
                        text = message.timestamp,
                        fontSize = 12.sp,
                        color = Color(0xFF6B7280)
                    )
                }
                
                Text(
                    text = "${message.confidence}%",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (message.isSpam) Color(0xFFEF4444) else Color(0xFF10B981)
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = message.content,
                fontSize = 14.sp,
                color = Color(0xFF1F2937),
                maxLines = 3,
                overflow = TextOverflow.Ellipsis
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(
                    onClick = { /* View details */ },
                    colors = ButtonDefaults.textButtonColors(
                        contentColor = Color(0xFF6366F1)
                    )
                ) {
                    Text("View Details")
                }
                
                Spacer(modifier = Modifier.width(8.dp))
                
                TextButton(
                    onClick = { /* Report/Block */ },
                    colors = ButtonDefaults.textButtonColors(
                        contentColor = if (message.isSpam) Color(0xFFEF4444) else Color(0xFF6B7280)
                    )
                ) {
                    Text(if (message.isSpam) "Block" else "Report")
                }
            }
        }
    }
}

@Composable
fun FilterChip(
    selected: Boolean,
    onClick: () -> Unit,
    label: @Composable () -> Unit,
    colors: FilterChipColors
) {
    FilterChip(
        selected = selected,
        onClick = onClick,
        label = label,
        colors = colors
    )
}

// Sample data class for SMS messages
data class SMSMessageData(
    val id: String,
    val sender: String,
    val content: String,
    val timestamp: String,
    val isSpam: Boolean,
    val confidence: Int,
    val category: String
)

// Sample data
fun getSampleSMSMessages(filter: String): List<SMSMessageData> {
    val allMessages = listOf(
        SMSMessageData(
            id = "1",
            sender = "+233 24 XXX XXXX",
            content = "Congratulations! You've won $10,000 in our lottery. Click here to claim your prize now!",
            timestamp = "2 minutes ago",
            isSpam = true,
            confidence = 95,
            category = "Spam"
        ),
        SMSMessageData(
            id = "2",
            sender = "MTN Ghana",
            content = "Your MTN Ghana account has been credited with 5.00 GHS. Thank you for using our services.",
            timestamp = "5 minutes ago",
            isSpam = false,
            confidence = 87,
            category = "Safe"
        ),
        SMSMessageData(
            id = "3",
            sender = "Unknown",
            content = "URGENT: Your bank account has been suspended. Call +233 XX XXX XXXX immediately to verify.",
            timestamp = "12 minutes ago",
            isSpam = true,
            confidence = 98,
            category = "Phishing"
        ),
        SMSMessageData(
            id = "4",
            sender = "Vodafone Ghana",
            content = "Your Vodafone Ghana bill of 25.50 GHS is due on 15th December. Pay online to avoid disconnection.",
            timestamp = "1 hour ago",
            isSpam = false,
            confidence = 92,
            category = "Safe"
        ),
        SMSMessageData(
            id = "5",
            sender = "+233 20 XXX XXXX",
            content = "FREE AIRTIME! Send 'YES' to 1234 to receive 10 GHS airtime instantly. Limited time offer!",
            timestamp = "2 hours ago",
            isSpam = true,
            confidence = 89,
            category = "Spam"
        )
    )
    
    return when (filter) {
        "Spam" -> allMessages.filter { it.isSpam }
        "Safe" -> allMessages.filter { !it.isSpam }
        "Phishing" -> allMessages.filter { it.category == "Phishing" }
        else -> allMessages
    }
}
