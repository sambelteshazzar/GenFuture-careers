# GenFuture Careers - Error Diagnosis & Fix Guide

## 🔍 **Diagnosis Summary**

After comprehensive analysis, I've identified the **2 most likely error sources** that could cause the project to fail:

### **Primary Issue #1: Backend Setup Problems**
- Missing virtual environment
- Uninstalled Python dependencies  
- Missing database seeding
- Configuration issues

### **Primary Issue #2: Database/Data Issues**
- Empty or missing database
- Missing seeded data (universities, courses, careers)
- Database connection problems

---

## 🛠️ **Step-by-Step Fix Instructions**

### **Step 1: Run Diagnostic Tool**
```bash
./diagnose_project.sh
```
This will identify exactly what's missing or misconfigured in your setup.

### **Step 2: Fix Backend Issues**

#### **2.1 Create Virtual Environment**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

#### **2.2 Install Dependencies**
```bash
pip install -r requirements.txt
```

#### **2.3 Seed Database**
```bash
python scripts/seed.py
```

#### **2.4 Test Backend**
```bash
./start_backend.sh
```
You should see logs like:
```
✅ [DEBUG] Virtual environment created
🌱 [DEBUG] Database not found. Seeding database...
✅ [DEBUG] Database exists
🚀 [DEBUG] Starting FastAPI server...
```

### **Step 3: Fix Frontend Issues**

#### **3.1 Install Dependencies**
```bash
cd frontend
npm install
```

#### **3.2 Test Frontend**
```bash
./start_frontend.sh
```
You should see logs like:
```
✅ [DEBUG] Dependencies already installed
✅ [DEBUG] Backend is reachable
🌟 Starting development server...
```

### **Step 4: Verify Full Integration**

#### **4.1 Start Both Services**
```bash
./start_all.sh
```

#### **4.2 Test in Browser**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🚨 **Common Error Scenarios & Fixes**

### **Error: "Virtual environment not found"**
**Fix:** Run Step 2.1 above

### **Error: "Database not found"**
**Fix:** Run Step 2.3 above

### **Error: "Backend not reachable on port 8000"**
**Fix:** 
1. Check if backend is running: `ps aux | grep uvicorn`
2. Kill existing process: `kill -9 <PID>`
3. Restart backend: `./start_backend.sh`

### **Error: "Frontend not reachable on port 5173"**
**Fix:**
1. Check if frontend is running: `ps aux | grep vite`
2. Kill existing process: `kill -9 <PID>`
3. Restart frontend: `./start_frontend.sh`

### **Error: "No universities found"**
**Fix:** This means the database wasn't seeded properly. Run Step 2.3

### **Error: "Could not fetch universities"**
**Fix:** This is likely a CORS or API connectivity issue. The diagnostic logs will show the exact problem.

---

## 🔧 **Advanced Troubleshooting**

### **Check Database Contents**
```bash
cd backend
sqlite3 genfuture.db
.tables
SELECT COUNT(*) FROM universities;
SELECT COUNT(*) FROM courses;
SELECT COUNT(*) FROM career_paths;
.quit
```

### **Check API Endpoints**
```bash
# Test backend health
curl http://localhost:8000/

# Test API endpoints
curl http://localhost:8000/api/v1/universities/nearby?latitude=40.7128&longitude=-74.0060
```

### **Check Frontend API Calls**
Open browser developer tools and look for:
- Network tab: Failed API calls
- Console tab: JavaScript errors
- Console tab: Look for `[API]` log messages

---

## 📋 **Validation Checklist**

After following the fixes, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors  
- [ ] Database contains data (30+ universities)
- [ ] Can login with demo@genfuture.com / password123
- [ ] Can see universities in the app
- [ ] Can select universities and see courses
- [ ] Can select courses and see career paths
- [ ] No console errors in browser
- [ ] API calls successful in network tab

---

## 🎯 **Quick Start (If Everything Works)**

```bash
# One command to start everything
./start_all.sh

# Then visit http://localhost:5173
# Login with: demo@genfuture.com / password123
```

---

## 🆘 **If Issues Persist**

1. Run the diagnostic tool: `./diagnose_project.sh`
2. Check the logs in terminal output
3. Open browser developer tools and check console
4. Verify all steps in the validation checklist above

The enhanced logging I've added will help pinpoint exactly where the issue occurs.