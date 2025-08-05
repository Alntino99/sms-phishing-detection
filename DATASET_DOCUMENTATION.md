# DATASET DOCUMENTATION

## SMS Phishing Dataset

### Dataset Overview
- **Purpose:** Training ML models for SMS phishing detection
- **Size:** Comprehensive collection of phishing and legitimate SMS
- **Format:** JSON with structured data
- **Categories:** Phishing, Legitimate, Suspicious

### Data Structure
```json
{
  "id": "unique_identifier",
  "sender": "phone_number_or_name",
  "body": "SMS content",
  "category": "phishing|legitimate|suspicious",
  "threat_level": "high|medium|low",
  "confidence": 0.85,
  "timestamp": "2025-08-05T16:12:54.521Z"
}
```

### Categories

#### Phishing SMS
- Account suspension threats
- Prize/winner scams
- Package delivery scams
- Banking security alerts
- Urgent action requests

#### Legitimate SMS
- Appointment reminders
- Delivery notifications
- Banking confirmations
- Social messages
- Business communications

#### Suspicious SMS
- Unusual requests
- Suspicious links
- Urgent demands
- Unfamiliar senders

### Training Data
- **Phishing Samples:** 1000+ examples
- **Legitimate Samples:** 2000+ examples
- **Suspicious Samples:** 500+ examples
- **Total:** 3500+ SMS samples

### Model Training
- **Naive Bayes:** Word-based classification
- **LSTM:** Pattern recognition
- **Ensemble:** Combined analysis
- **Security Rules:** Rule-based detection

## Status: ✅ DOCUMENTED 