package com.smsshield.data.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Telephony
import android.telephony.SmsMessage
import android.util.Log
import com.smsshield.data.SMSModule
import com.smsshield.data.service.SMSMonitoringService
import java.util.*

class SMSReceiver : BroadcastReceiver() {
    private val TAG = "SMSReceiver"

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "SMS received: ${intent.action}")

        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val bundle: Bundle? = intent.extras
            if (bundle != null) {
                val pdus = bundle["pdus"] as Array<*>?
                if (pdus != null) {
                    for (pdu in pdus) {
                        val smsMessage = SmsMessage.createFromPdu(pdu as ByteArray)
                        val message = SMSModule.SMSMessage(
                            id = System.currentTimeMillis().toString(),
                            address = smsMessage.originatingAddress ?: "Unknown",
                            body = smsMessage.messageBody ?: "",
                            date = Date(smsMessage.timestampMillis),
                            type = "inbox"
                        )

                        Log.d(TAG, "SMS from: ${message.address}")
                        Log.d(TAG, "SMS body: ${message.body}")

                        // Send to monitoring service
                        val serviceIntent = Intent(context, SMSMonitoringService::class.java).apply {
                            action = "SMS_RECEIVED"
                            putExtra("sms_id", message.id)
                            putExtra("sms_address", message.address)
                            putExtra("sms_body", message.body)
                            putExtra("sms_date", message.date.time)
                            putExtra("sms_type", message.type)
                        }
                        context.startService(serviceIntent)

                        // Also send to SMSModule if available
                        try {
                            val smsModule = SMSModule(context as com.facebook.react.ReactApplicationContext)
                            smsModule.sendSMSReceivedEvent(message)
                        } catch (e: Exception) {
                            Log.e(TAG, "Error sending SMS to module", e)
                        }
                    }
                }
            }
        }
    }
}
