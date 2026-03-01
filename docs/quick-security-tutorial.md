# 🔒 Quick Security & Testing Tutorial

## 🛡️ **Current Security Fixes Needed**

### **1. Input Sanitization** 
```typescript
// Current: Direct localStorage usage
localStorage.setItem('userInput', userInput);

// Fix: Sanitize first
import DOMPurify from 'dompurify';
const cleanInput = DOMPurify.sanitize(userInput);
localStorage.setItem('userInput', cleanInput);
```

### **2. Rate Limiting**
```typescript
// Add to API route
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP
});

app.use('/api/', limiter);
```

### **3. Security Headers**
```typescript
// Add to Next.js config
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self'"
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }
];
```

## 🧪 **Quick Testing Steps**

### **Manual Testing Checklist**
- [ ] Try XSS in food description: `<script>alert(1)</script>`
- [ ] Try SQL injection: `'; DROP TABLE users; --`
- [ ] Check localStorage for sensitive data
- [ ] Test session manipulation
- [ ] Verify all inputs are validated

### **Automated Testing**
```bash
# Install security tools
npm install -g owasp-zap
npm install -g sqlmap

# Run basic scan
zap-baseline.py -t http://localhost:3000
```

---

## 🗄️ **Database Setup Guide**

### **Option 1: PostgreSQL (Recommended)**
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Create database
createdb calorietracker

# Create user
psql -d calorietracker
CREATE USER app_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE calorietracker TO app_user;
```

### **Option 2: SQLite (Development)**
```bash
# No installation needed - file-based
npm install sqlite3
```

### **Environment Setup**
```env
# .env.local
DATABASE_URL=postgresql://app_user:your_password@localhost:5432/calorietracker
# or
DATABASE_URL=sqlite:./data/calorietracker.db
```

---

## 🔐 **Security Concepts Explained**

### **Database Encryption**
- **At Rest**: Database files encrypted on disk
- **In Transit**: Data encrypted between app and database
- **Field Level**: Specific columns (passwords, emails) encrypted

**Example**: 
```sql
-- Encrypted password storage
CREATE TABLE users (
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- Never store plain text!
  encrypted_data TEXT -- Sensitive info encrypted
);
```

### **Security Headers**
- **CSP (Content Security Policy)**: Prevents XSS by whitelisting allowed scripts
- **HSTS (HTTP Strict Transport Security)**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks

**Example CSP**:
```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

---

## 🌍 **Language Learning Advice**

### **Should You Switch to English Now?**

**YES! Here's why:**

1. **Industry Standard**: 95% of documentation, Stack Overflow, GitHub in English
2. **Career Opportunities**: International jobs require English
3. **Better Resources**: Latest tutorials, courses, tools in English
4. **Community**: Larger network of developers

### **Transition Strategy:**
```typescript
// Start with English prompts
"Create a React component with TypeScript that..."

// Gradually switch all prompts
"Implement authentication with JWT and refresh tokens..."

// Eventually: English code comments too
/**
 * Validates user input and sanitizes before storage
 * @param input - Raw user input
 * @returns Sanitized string
 */
```

### **Speed vs Quality Trade-off:**
- **Short term**: Slower development
- **Long term**: 10x better career opportunities
- **Investment**: 6 months adjustment → lifetime benefits

---

## 🐛 **Red Progress Bar Fix**

### **Issue**: Progress rings not turning red when exceeded

### **Solution**: Check if values are being calculated correctly
<tool_call>edit
<arg_key>file_path</arg_key>
<arg_value>d:/ai-calorie-tracker-v3.2/src/app/components/dashboard/dashboard-home.tsx
