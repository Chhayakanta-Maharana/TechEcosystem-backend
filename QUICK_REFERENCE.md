# 🎯 Quick Reference - What To Bring & Where To Put It

## 📋 One-Page Checklist

Print this and fill in as you gather credentials!

---

## ✅ AWS Account Credentials

### What to Collect:
```
[ ] AWS Account ID: _________________________________
[ ] AWS Access Key ID: _________________________________
[ ] AWS Secret Access Key: _________________________________
[ ] Preferred Region: us-east-1 (recommended)
```

### How to Get It:
1. Go to: https://console.aws.amazon.com
2. Top right → Your Name → Security Credentials
3. Create New Access Key under "Access Keys"
4. **Save both key ID and secret key securely!**

### Where to Put It:
```bash
aws configure
# Paste your keys when prompted
```

---

## 🔐 JWT Secret (For User Authentication)

### What to Generate:
```
[ ] JWT Secret: _________________________________
    (Must be at least 32 characters)
```

### How to Generate:
```bash
# Copy this command and run it:
openssl rand -base64 32

# Save the output - this is your JWT_SECRET
```

### Where to Put It:
**File: `.env`**
```
JWT_SECRET=paste-your-secret-here
```

---

## 🪣 S3 Buckets (For Video & Resume Storage)

### What to Create:

**Bucket 1 - Videos:**
```
[ ] Bucket Name: techeco-api-videos-dev
[ ] Region: us-east-1
[ ] Bucket URL: https://techeco-api-videos-dev.s3.amazonaws.com
```

**Bucket 2 - Resumes:**
```
[ ] Bucket Name: techeco-api-resumes-dev
[ ] Region: us-east-1
[ ] Bucket URL: https://techeco-api-resumes-dev.s3.amazonaws.com
```

### How to Create:
**Option A: AWS Console**
1. Go to: https://s3.console.aws.amazon.com
2. Click "Create Bucket"
3. Name: `techeco-api-videos-dev`
4. Region: `us-east-1`
5. Click "Create"
6. Repeat for resumes bucket

**Option B: Command Line**
```bash
aws s3 mb s3://techeco-api-videos-dev --region us-east-1
aws s3 mb s3://techeco-api-resumes-dev --region us-east-1
```

### Where to Put It:
**Already configured in `serverless.yml`** ✅
(No changes needed!)

---

## 🗄️ DynamoDB Tables

### What You Need:
```
[ ] Do nothing! Tables auto-create during deployment
```

### Tables Created Automatically:
- ✅ techeco-api-users-dev
- ✅ techeco-api-videos-dev
- ✅ techeco-api-jobs-dev
- ✅ techeco-api-resumes-dev
- ✅ techeco-api-posts-dev
- ✅ techeco-api-comments-dev
- ✅ techeco-api-likes-dev
- ✅ techeco-api-follows-dev
- ✅ techeco-api-applications-dev

---

## 👤 IAM Permissions

### What to Check:
```
[ ] DynamoDB Access (AmazonDynamoDBFullAccess)
[ ] S3 Access (AmazonS3FullAccess)
[ ] Lambda Access (AWSLambdaFullAccess)
[ ] CloudFormation Access (CloudFormationFullAccess)
[ ] IAM Access (IAMFullAccess)
```

### How to Check:
1. Go to: https://console.aws.amazon.com/iam
2. Click Users → Your Name
3. Check Permissions tab
4. Should see policies above listed

---

## 📝 .env File Configuration

**File Location:** `.env` (in your project root)

### Fill In These Values:

```bash
# Your JWT Secret (from openssl command)
JWT_SECRET=paste-your-secret-here

# AWS settings
AWS_REGION=us-east-1
AWS_PROFILE=default

# Deployment
STAGE=dev
REGION=us-east-1

# S3 Buckets (these stay the same)
VIDEOS_BUCKET=techeco-api-videos-dev
RESUMES_BUCKET=techeco-api-resumes-dev
```

---

## 🚀 Deployment Checklist

Before deploying, verify:

```bash
# 1. AWS credentials configured
[ ] aws configure done
[ ] aws sts get-caller-identity works

# 2. S3 buckets created
[ ] aws s3 ls shows both buckets

# 3. .env file updated
[ ] .env has JWT_SECRET
[ ] .env AWS_REGION=us-east-1
[ ] .env STAGE=dev

# 4. Dependencies installed
[ ] npm install --legacy-peer-deps completed
[ ] node_modules folder exists

# 5. Test locally
[ ] npm run dev works (http://localhost:3000)

# 6. Ready to deploy
[ ] All checks above passed
```

---

## 🎬 Quick Start Commands

### 1. Configure AWS
```bash
aws configure
# Enter:
# AWS Access Key ID: [YOUR_ID]
# AWS Secret Access Key: [YOUR_KEY]
# Default region: us-east-1
# Default output format: json
```

### 2. Create S3 Buckets
```bash
aws s3 mb s3://techeco-api-videos-dev --region us-east-1
aws s3 mb s3://techeco-api-resumes-dev --region us-east-1
```

### 3. Update .env File
```bash
# Edit .env and change:
# JWT_SECRET=your-openssl-output
# AWS_REGION=us-east-1
# AWS_PROFILE=default
# STAGE=dev
```

### 4. Test Locally
```bash
npm install --legacy-peer-deps
npm run dev
# Opens at http://localhost:3000
```

### 5. Deploy to AWS
```bash
npm run deploy:dev
# Wait 10-15 minutes
# Copy API URL from output
```

---

## 📊 Summary Table

| What | Where to Get | Where to Put | Type |
|-----|-------------|------------|------|
| AWS Access Key | AWS Console | `aws configure` | Required |
| AWS Secret Key | AWS Console | `aws configure` | Required |
| JWT Secret | `openssl rand -base64 32` | `.env` JWT_SECRET | Required |
| S3 Videos Bucket | Create in S3 | `serverless.yml` | Required |
| S3 Resumes Bucket | Create in S3 | `serverless.yml` | Required |
| DynamoDB Tables | Auto-created | N/A | Auto |
| API Gateway URL | After deploy | Frontend config | Auto |

---

## 🔗 Important Links

**AWS Console Links (Open These):**
- IAM & Security Credentials: https://console.aws.amazon.com/iam
- S3 Buckets: https://s3.console.aws.amazon.com
- DynamoDB: https://console.aws.amazon.com/dynamodb
- Lambda Functions: https://console.aws.amazon.com/lambda
- API Gateway: https://console.aws.amazon.com/apigateway

**Your Project Files:**
- Main config: `serverless.yml`
- Environment vars: `.env`
- AWS guide: `AWS_SETUP_GUIDE.md`
- API docs: `API_DOCUMENTATION.md`

---

## ✨ What Gets Auto-Created

When you run `npm run deploy:dev`:
1. ✅ DynamoDB Tables (9 tables)
2. ✅ Lambda Functions (36 functions)
3. ✅ API Gateway (47 endpoints)
4. ✅ CloudFormation Stack
5. ✅ IAM Roles & Policies
6. ✅ CloudWatch Logs

**You just need to provide:**
- AWS credentials
- JWT secret
- S3 bucket names

---

## 📞 Troubleshooting

**Q: Where do I get AWS Access Keys?**
A: AWS Console → IAM → Your User → Security Credentials → Create Access Key

**Q: What if bucket name is taken?**
A: S3 names are globally unique. Add your name: `techeco-videos-myname-dev`

**Q: How do I generate JWT Secret?**
A: Run: `openssl rand -base64 32` in terminal

**Q: Does DynamoDB cost extra?**
A: Using "pay per request" - only charged for actual usage

**Q: Can I see my API after deploy?**
A: Yes! Check CloudFormation outputs or in console output

---

## ✅ Ready?

Once you have:
1. ✅ AWS Account with credentials
2. ✅ Generated JWT Secret
3. ✅ Created 2 S3 buckets
4. ✅ Updated .env file

You can deploy:
```bash
npm run deploy:dev
```

---

**Good luck! 🚀**
