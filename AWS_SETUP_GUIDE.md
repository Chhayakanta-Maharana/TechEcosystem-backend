# 🎯 TechEcosystem Backend - AWS Setup Checklist

## What You Need to Provide

This guide shows **exactly what AWS resources and credentials** you need to set up for the complete serverless application.

---

## 📋 Complete Checklist

### ✅ **STEP 1: AWS Account Setup**

**What to Get:**
- [ ] AWS Account Access
- [ ] AWS Access Key ID
- [ ] AWS Secret Access Key
- [ ] AWS Region (we're using: `us-east-1`)

**Where to Get It:**
1. Go to: https://console.aws.amazon.com
2. Click your profile → "Security Credentials"
3. Create Access Key (under "Access Keys" section)
4. Save both keys securely

**Where It Goes:**
```bash
# In terminal, run:
aws configure
# Enter:
# AWS Access Key ID: [YOUR_KEY_ID]
# AWS Secret Access Key: [YOUR_SECRET_KEY]
# Default region: us-east-1
# Default output format: json
```

---

### ✅ **STEP 2: JWT Secret (For Authentication)**

**What to Get:**
- [ ] A strong secret key for JWT (JSON Web Tokens)
- [ ] This encrypts user login tokens

**How to Generate:**
```bash
# Option 1: Use OpenSSL
openssl rand -base64 32

# Option 2: Simple string (must be strong!)
# Example: "your-super-secret-key-min-32-characters-long"
```

**Where It Goes:**
File: `.env`
```
JWT_SECRET=your-generated-secret-key-here
```

---

### ✅ **STEP 3: S3 Buckets (For File Storage)**

**What to Create:**
- [ ] 1 S3 Bucket for Video Files
- [ ] 1 S3 Bucket for Resume/PDF Files

**How to Create (AWS Console):**
1. Go to: https://s3.console.aws.amazon.com
2. Click "Create Bucket"
3. Bucket Name: `techeco-api-videos-dev`
4. Region: `us-east-1`
5. Click "Create Bucket"
6. Repeat for: `techeco-api-resumes-dev`

**Or Use AWS CLI:**
```bash
aws s3 mb s3://techeco-api-videos-dev --region us-east-1
aws s3 mb s3://techeco-api-resumes-dev --region us-east-1
```

**Where It Goes:**
File: `serverless.yml` (Already configured!)
```yaml
environment:
  videosBucket: techeco-api-videos-dev
  resumesBucket: techeco-api-resumes-dev
```

**S3 Bucket URLs (For Frontend):**
```
Video Upload: https://techeco-api-videos-dev.s3.amazonaws.com/
Resume Upload: https://techeco-api-resumes-dev.s3.amazonaws.com/
```

---

### ✅ **STEP 4: DynamoDB Tables (AUTO-CREATED)**

**Note:** ✅ **These are automatically created when you deploy!**

The following tables will be created on `npm run deploy:dev`:
- `techeco-api-users-dev`
- `techeco-api-videos-dev`
- `techeco-api-jobs-dev`
- `techeco-api-resumes-dev`
- `techeco-api-posts-dev`
- `techeco-api-comments-dev`
- `techeco-api-likes-dev`
- `techeco-api-follows-dev`
- `techeco-api-applications-dev`

**You Don't Need To Do Anything** - They'll be created automatically!

---

### ✅ **STEP 5: Optional - AWS Cognito (User Authentication Alternative)**

**Note:** Currently using JWT (simpler). Only if you want AWS-managed auth.

**What to Get (Optional):**
- [ ] Cognito User Pool ID
- [ ] Cognito App Client ID
- [ ] Cognito App Client Secret
- [ ] Cognito Domain Name

**How to Create (If Needed):**
1. Go to: https://console.aws.amazon.com/cognito
2. Click "Create User Pool"
3. Name: `TechEcosystem`
4. Configure sign-in options → Select "Email"
5. Click "Create"
6. Copy User Pool ID
7. Create App Integration → Get Client ID

**Where It Goes (If Using):**
File: `.env`
```
COGNITO_USER_POOL_ID=us-east-1_xxxxx
COGNITO_CLIENT_ID=xxxxx
COGNITO_CLIENT_SECRET=xxxxx
COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
```

**For Now:** Skip this - JWT is already configured!

---

### ✅ **STEP 6: IAM Roles & Permissions**

**What to Check:**
- [ ] Your AWS user has permissions for:
  - DynamoDB (Create, Read, Update, Delete)
  - S3 (Put, Get, Delete objects)
  - Lambda (Create, Deploy, Invoke)
  - API Gateway (Create, Deploy)
  - CloudFormation (Create, Update stacks)

**How to Check:**
1. Go to: https://console.aws.amazon.com/iam
2. Click "Users" → Your username
3. Check "Permissions" tab
4. Should have these policies:
   - `AmazonDynamoDBFullAccess`
   - `AmazonS3FullAccess`
   - `AWSLambdaFullAccess`
   - `IAMFullAccess`
   - `CloudFormationFullAccess`

**If Missing:**
1. Ask your AWS admin to add policies
2. Or use: `AdministratorAccess` (if dev account)

---

### ✅ **STEP 7: Environment Variables Configuration**

**File Location:** `.env` (in your project root)

**Complete Template:**
```bash
# ===== AUTHENTICATION =====
JWT_SECRET=your-generated-secret-key-here

# ===== AWS CONFIGURATION =====
AWS_REGION=us-east-1
AWS_PROFILE=default

# ===== SERVERLESS CONFIGURATION =====
STAGE=dev
REGION=us-east-1

# ===== S3 BUCKET NAMES =====
VIDEOS_BUCKET=techeco-api-videos-dev
RESUMES_BUCKET=techeco-api-resumes-dev

# ===== OPTIONAL: COGNITO =====
# COGNITO_USER_POOL_ID=us-east-1_xxxxx
# COGNITO_CLIENT_ID=xxxxx
```

**How to Update .env:**
1. Open `.env` file in VS Code
2. Replace placeholder values with YOUR values
3. Save file (Ctrl+S)

---

## 🚀 Step-by-Step Setup Guide

### **Phase 1: AWS Account Setup (5 minutes)**

```bash
# 1. Configure AWS credentials
aws configure
# Follow prompts and enter your access keys

# 2. Verify configuration
aws sts get-caller-identity
# Should show your AWS Account ID
```

### **Phase 2: Create S3 Buckets (2 minutes)**

```bash
# Create video bucket
aws s3 mb s3://techeco-api-videos-dev --region us-east-1

# Create resumes bucket
aws s3 mb s3://techeco-api-resumes-dev --region us-east-1

# Verify buckets created
aws s3 ls
```

### **Phase 3: Generate & Configure Secrets (2 minutes)**

```bash
# Generate JWT secret
openssl rand -base64 32
# Copy the output

# Update .env file with:
# 1. JWT_SECRET=<paste-the-secret>
# 2. AWS_PROFILE=default
# 3. STAGE=dev
```

### **Phase 4: Deploy Backend (10-15 minutes)**

```bash
# Install dependencies
npm install --legacy-peer-deps

# Test locally first
npm run dev
# Open http://localhost:3000

# Deploy to AWS
npm run deploy:dev
# This creates DynamoDB tables automatically
```

---

## 📊 Resource Summary Table

| Resource | Purpose | Where to Get | Where to Configure |
|----------|---------|--------------|-------------------|
| **AWS Access Keys** | API Authentication | AWS Console → Security Credentials | `aws configure` |
| **AWS Region** | Data location | `us-east-1` (default) | `serverless.yml` |
| **JWT Secret** | User token encryption | Generate with `openssl` | `.env` file |
| **S3 Bucket (Videos)** | Video file storage | Create in S3 console | `serverless.yml` |
| **S3 Bucket (Resumes)** | Resume file storage | Create in S3 console | `serverless.yml` |
| **DynamoDB Tables** | User/post/job data | Auto-created on deploy | N/A (auto) |
| **Lambda Functions** | API handlers | Auto-created on deploy | `serverless.yml` |
| **API Gateway** | API endpoints | Auto-created on deploy | `serverless.yml` |

---

## 🔑 Credentials & Links You'll Collect

### **Before Deployment**

```
AWS Account ID: ______________________
AWS Access Key ID: ______________________
AWS Secret Access Key: ______________________
AWS Region: us-east-1
JWT Secret: ______________________
```

### **After Creating S3 Buckets**

```
Videos Bucket: techeco-api-videos-dev
Resumes Bucket: techeco-api-resumes-dev
Videos S3 URL: https://techeco-api-videos-dev.s3.amazonaws.com
Resumes S3 URL: https://techeco-api-resumes-dev.s3.amazonaws.com
```

### **After Deployment**

```
API Gateway URL: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
CloudFormation Stack: techeco-api-dev
```

---

## 🔐 Security Best Practices

### ✅ **Do This:**
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Store credentials in `.env` (NOT in code)
- [ ] Enable S3 bucket encryption
- [ ] Use AWS IAM roles with minimal permissions
- [ ] Rotate access keys quarterly
- [ ] Never commit `.env` to Git

### ❌ **Don't Do This:**
- Don't hardcode secrets in code
- Don't share AWS credentials
- Don't use simple passwords
- Don't enable public access to S3
- Don't commit `.env` file

---

## 📱 Frontend Integration Links

After deployment, your frontend will need these URLs:

```javascript
// API BASE URL (from deployment output)
const API_BASE = "https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev";

// ENDPOINTS
const endpoints = {
  // Auth
  register: `${API_BASE}/auth/register`,
  login: `${API_BASE}/auth/login`,
  
  // Videos
  uploadVideo: `${API_BASE}/videos/upload`,
  getVideo: (id) => `${API_BASE}/videos/${id}`,
  listVideos: `${API_BASE}/videos`,
  
  // Jobs
  postJob: `${API_BASE}/jobs`,
  listJobs: `${API_BASE}/jobs`,
  applyJob: (id) => `${API_BASE}/jobs/${id}/apply`,
  
  // Social
  createPost: `${API_BASE}/posts`,
  likePost: (id) => `${API_BASE}/posts/${id}/like`,
  followUser: (id) => `${API_BASE}/users/${id}/follow`,
};

// S3 UPLOAD URLS (for direct file uploads)
const s3Urls = {
  videos: "https://techeco-api-videos-dev.s3.amazonaws.com",
  resumes: "https://techeco-api-resumes-dev.s3.amazonaws.com"
};
```

---

## ⚠️ Common Issues & Solutions

### **Issue: "Invalid AWS Credentials"**
```bash
# Solution: Reconfigure
aws configure
# Verify:
aws sts get-caller-identity
```

### **Issue: "Access Denied" on S3**
```bash
# Solution: Add S3 permissions to IAM user
# Go to IAM Console → Add AmazonS3FullAccess policy
```

### **Issue: "Insufficient IAM Permissions"**
```bash
# Solution: Check your IAM policy includes:
# - dynamodb:*
# - s3:*
# - lambda:*
# - apigateway:*
# - cloudformation:*
```

### **Issue: "Bucket Already Exists"**
```bash
# Solution: S3 bucket names must be globally unique
# Use different name like:
aws s3 mb s3://techeco-api-videos-YOUR-NAME-dev
```

---

## ✅ Verification Checklist

Before deployment, verify everything:

```bash
# 1. Check AWS credentials
aws sts get-caller-identity
# ✅ Should output your account ID

# 2. Check S3 buckets
aws s3 ls
# ✅ Should list both buckets

# 3. Check .env file
cat .env
# ✅ Should have JWT_SECRET, AWS_REGION, STAGE

# 4. Check Node/npm
node --version
npm --version
# ✅ Both should be available

# 5. Check serverless CLI
npx serverless --version
# ✅ Should show version 3.x or 4.x
```

---

## 🚀 Ready to Deploy?

Once you have everything:

```bash
# Step 1: Test locally
npm run dev

# Step 2: Deploy to AWS
npm run deploy:dev

# Step 3: Get API URL from output
# Copy the "endpoints:" URLs from console output

# Step 4: Test an endpoint
curl https://your-api-url/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User","username":"testuser"}'
```

---

## 📞 Need Help?

**Check these files:**
- `API_DOCUMENTATION.md` - All API endpoints
- `BACKEND_SETUP.md` - Detailed setup instructions
- `.env.example` - Environment template
- `serverless.yml` - Infrastructure config

**Common Commands:**
```bash
npm run dev           # Start local server
npm run deploy:dev    # Deploy to AWS
npm run logs -f func  # View logs
npm run remove        # Delete AWS stack
```

---

## 🎯 Summary

You need to provide:
1. ✅ AWS Account Credentials (Access Key + Secret)
2. ✅ JWT Secret (generate with openssl)
3. ✅ S3 Bucket Names (create 2 buckets)
4. ✅ Region (us-east-1)
5. ✅ IAM Permissions (DynamoDB, S3, Lambda, API Gateway)

Everything else is **AUTO-CREATED** during deployment! 🚀

---

**Status:** Ready for your AWS credentials → Let's Deploy! 🎉
