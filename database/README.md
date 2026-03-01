# 🗄️ Database Setup Guide

## 🚀 Quick Setup (5 minutes)

### **Option 1: PostgreSQL (Recommended)**

#### **1. Install PostgreSQL**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

#### **2. Create Database**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE calorietracker;
CREATE USER app_user WITH PASSWORD 'your_secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE calorietracker TO app_user;
\q
```

#### **3. Run Setup Script**
```bash
# Navigate to project directory
cd ai-calorie-tracker-v3.2

# Run the setup script
psql -U app_user -d calorietracker -f database/setup.sql
```

#### **4. Configure Environment**
```bash
# Copy and edit environment file
cp .env.example .env.local

# Add your database connection
DATABASE_URL=postgresql://app_user:your_secure_password_123@localhost:5432/calorietracker
```

### **Option 2: SQLite (Development Only)**

#### **1. Install Dependencies**
```bash
npm install sqlite3 @types/sqlite3
```

#### **2. Configure Environment**
```env
DATABASE_URL=sqlite:./data/calorietracker.db
```

#### **3. Create Data Directory**
```bash
mkdir -p data
```

---

## 🔧 **Environment Variables Explained**

### **Database URL Format**
```env
# PostgreSQL
DATABASE_URL=postgresql://username:password@host:port/database

# SQLite
DATABASE_URL=sqlite:./path/to/database.db

# Examples
DATABASE_URL=postgresql://app_user:secret123@localhost:5432/calorietracker
DATABASE_URL=sqlite:./data/calorietracker.db
```

### **Other Variables**
```env
# API Configuration
VITE_API_URL=http://localhost:3000
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Environment
NODE_ENV=development

# JWT Secret (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
```

---

## 🧪 **Test Database Connection**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Test Connection**
```bash
# Create test script
node -e "
const db = require('./src/lib/database.ts');
db.testConnection().then(connected => {
  console.log('Database connected:', connected);
  process.exit(0);
}).catch(err => {
  console.error('Connection failed:', err);
  process.exit(1);
});
"
```

### **3. Start Development**
```bash
npm run dev:all
```

---

## 🔐 **Security Concepts Explained**

### **Database Encryption**
- **At Rest**: Database files encrypted on disk
- **In Transit**: Data encrypted between app and database (SSL/TLS)
- **Field Level**: Specific columns encrypted (passwords, emails)

**Implementation**:
```sql
-- Encrypted password storage (bcrypt)
CREATE TABLE users (
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- Never plain text!
  -- Other fields...
);
```

### **Security Headers**
- **CSP (Content Security Policy)**: Prevents XSS attacks
- **HSTS (HTTP Strict Transport Security)**: Forces HTTPS
- **X-Frame-Options**: Prevents clickjacking

**Implementation**:
```typescript
// Next.js security headers
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


## 🐛 **Troubleshooting**

### **Common Issues:**

#### **"Connection refused"**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Start PostgreSQL
brew services start postgresql        # macOS
sudo systemctl start postgresql       # Linux
```

#### **"Permission denied"**
```bash
# Fix permissions
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE calorietracker TO app_user;
```

#### **"Module not found: pg"**
```bash
# Install dependencies
npm install
npm install pg @types/pg
```

---

## 📝 **Next Steps**

1. **Set up database** using the guide above
2. **Test connection** with provided script
3. **Start development** with `npm run dev:all`
4. **Begin authentication** implementation

**Ready to build your production-ready app!** 🚀
