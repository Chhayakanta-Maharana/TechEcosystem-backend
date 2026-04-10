# 🏗️ TechEcosystem Architecture & Integration Guide

## Complete System Overview

This shows how all the AWS services, credentials, and your app work together.

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         YOUR FRONTEND APP                           │
│            (React/Vue - The TechEcosystem Client UI)                │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                    Uses API Endpoints & Tokens
                                 │
                    ┌────────────▼─────────────┐
                    │   API GATEWAY (AWS)      │
                    │  • 47 Endpoints          │
                    │  • JWT Authorization     │
                    │  • CORS Enabled          │
                    └────────────┬─────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
    ┌───▼─────┐         ┌───────▼───────┐       ┌────────▼──────┐
    │ Lambda  │         │   Lambda      │       │   Lambda      │
    │ Auth    │         │   Videos      │       │   Jobs/Social │
    │ Functions         │   Functions   │       │   Functions   │
    └───┬─────┘         └───────┬───────┘       └────────┬──────┘
        │                       │                        │
        └───────────────────────┼────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼─────┐  ┌──────▼──────┐  ┌───▼──────┐
        │  DynamoDB   │  │  S3 Videos  │  │ S3 Files │
        │  Database   │  │  Bucket     │  │ Bucket   │
        │  (9 Tables) │  │  (Storage)  │  │(Storage) │
        └─────────────┘  └─────────────┘  └──────────┘
```

---

## 🔐 Credentials & Secrets Flow

```
┌─────────────────────────────────────────────────────────────┐
│ YOU PROVIDE (On Your Machine)                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. AWS Access Key ID        ─────┐                         │
│  2. AWS Secret Access Key    ─────┤                         │
│                                   │                         │
│                          ┌────────▼──────────┐              │
│                          │  AWS CLI Config   │              │
│                          │  (~/.aws/...)     │              │
│                          │                   │              │
│                          └────────┬──────────┘              │
│                                   │                         │
│  3. JWT Secret           ─────┐   │                         │
│  4. .env Configuration   ─────┤   │                         │
│                               │   │                         │
│                          ┌────▼───▼──────────┐              │
│                          │  .env File        │              │
│                          │  (In Project)     │              │
│                          │                   │              │
│                          └────────┬──────────┘              │
│                                   │                         │
└───────────────────────────────────┼─────────────────────────┘
                                    │
                      Called during deployment
                                    │
                   ┌────────────────▼────────────────┐
                   │  Serverless Framework CLI       │
                   │  Creates all AWS Resources      │
                   │                                 │
                   │  npm run deploy:dev             │
                   └────────┬───────────────────────┘
                            │
        ┌───────────────────┼──────────────────────┐
        │                   │                      │
        ▼                   ▼                      ▼
    DynamoDB           Lambda                 API Gateway
    Tables             Functions               Endpoints
    Created            Deployed                Created
```

---

## 📦 What You Provide vs What AWS Creates

### **YOU PROVIDE:**

| Item | Format | How to Get | Example |
|------|--------|-----------|---------|
| AWS Access Key ID | Text (20 chars) | AWS Console → IAM | AKIAIOSFODNN7EXAMPLE |
| AWS Secret Key | Text (40 chars) | AWS Console → IAM | wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY |
| JWT Secret | Random string | `openssl rand -base64 32` | abc123def456ghi789jkl012 |
| S3 Bucket Names | Text | Custom names | techeco-api-videos-dev |
| Region | us-east-1 | Fixed | us-east-1 |

### **AWS CREATES AUTOMATICALLY:**

| Item | Type | Count | Created By |
|------|------|-------|-----------|
| DynamoDB Tables | Database | 9 | CloudFormation |
| Lambda Functions | Compute | 36 | Serverless CLI |
| API Endpoints | REST | 47 | CloudFormation |
| S3 Buckets | Storage | 2 | AWS CLI (you run command) |
| CloudFormation Stack | Orchestration | 1 | Serverless CLI |
| IAM Roles | Security | 3 | CloudFormation |
| CloudWatch Logs | Monitoring | 36 | Lambda |

---

## 🔄 Data Flow Example: User Registration

```
┌──────────────────┐
│  Frontend App    │
│  User clicks     │
│  "Sign Up"       │
└────────┬─────────┘
         │
         │ POST /auth/register
         │ { email, password, name }
         │
         ▼
┌──────────────────────────────────────┐
│  API Gateway (AWS)                   │
│  • Validates request                 │
│  • Routes to Lambda                  │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Lambda Function: register.js        │
│  • Hash password                     │
│  • Generate user ID                  │
│  • Call DynamoDB                     │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  DynamoDB (AWS)                      │
│  Write to: techeco-api-users-dev     │
│  • Store user record                 │
│  • Index by email                    │
└────────┬─────────────────────────────┘
         │
         ▼ Returns user record
┌──────────────────────────────────────┐
│  Lambda Function: register.js        │
│  • Generate JWT token                │
│  • Return { token, user }            │
└────────┬─────────────────────────────┘
         │
         ▼ RESPONSE: { token: "xxx..." }
┌──────────────────┐
│  Frontend App    │
│  • Save token    │
│  • Redirect      │
└──────────────────┘
```

---

## 🎯 Integration Points

### **1. Authentication Flow**

```
Frontend                API                Database
   │                    │                     │
   ├─ POST /register ──>│                     │
   │                    ├─ Check email ──────>│
   │                    │<─ User exists? ──┤  │
   │                    │                 │  │
   │                    ├─ Save user ─────────>│
   │                    │<─ Success ────────┤  │
   │                    ├─ Generate JWT     │  │
   │                    │<─ token ────────┐ │
   │<─ { token } ───────┤                │ │
   │                    │                │ │
   │ Store token in localStorage        └─
   │ Use for future requests
```

**Credentials Needed:**
- JWT_SECRET (to sign tokens)
- DynamoDB table access (provided by IAM)

---

### **2. Video Upload Flow**

```
Frontend              S3                Lambda            DynamoDB
   │                 │                  │                   │
   │ POST /upload ──────────────────────>│                   │
   │   (with JWT token)                  │                   │
   │                                     ├─ Save metadata ──>│
   │                                     │<─ Success ────────┤
   │                                     │                   │
   │<─ S3 URL ────────────────────────────┤                  │
   │                                     │                   │
   │ Upload video file to S3 URL         │                  │
   ├────────────────────────────────────>│                  │
   │                                     │                  │
```

**Credentials Needed:**
- JWT_SECRET (to verify token)
- S3 bucket name (techeco-api-videos-dev)
- S3 bucket access (provided by IAM)

---

### **3. Social Post with Like Flow**

```
Frontend              Lambda          DynamoDB
   │                   │                 │
   ├─ POST /posts ────>│                 │
   │  (JWT token)      ├─ Save post ────>│
   │                   │<─ Post ID ─────┤
   │<─ { postId } ─────┤                 │
   │                   │                 │
   │ Like button click │                 │
   │                   │                 │
   ├─ POST /like ─────>│                 │
   │  (JWT token)      ├─ Save like ────>│
   │                   ├─ Increment ────>│
   │                   │  like counter   │
   │<─ Success ────────┤<─ Updated ─────┤
```

**Credentials Needed:**
- JWT_SECRET (to verify token)
- DynamoDB access (likes table, posts table)

---

## 🗂️ File Organization After Setup

```
your-project/
├── .aws/
│   └── credentials                    # ← AWS credentials (auto-created by aws configure)
│
├── .env                               # ← YOUR SECRETS (JWT, AWS region)
│   ├── JWT_SECRET=xxx
│   ├── AWS_REGION=us-east-1
│   └── AWS_PROFILE=default
│
├── serverless.yml                     # ← Infrastructure as Code
│   ├── DynamoDB tables config
│   ├── S3 buckets config
│   ├── Lambda functions config
│   ├── API Gateway endpoints
│   └── IAM roles config
│
├── handlers/                          # ← Your Lambda function code
│   ├── auth/
│   ├── videos/
│   ├── jobs/
│   ├── social/
│   └── ...
│
├── libs/                              # ← Shared libraries
│   ├── jwt-lib.js                    # ← Uses JWT_SECRET from .env
│   ├── dynamodb-lib.js               # ← Uses AWS credentials
│   └── util-lib.js
│
└── package.json                       # ← Dependencies config
```

---

## 🔗 Connectivity Map

### **Before Deployment:**

```
Your Machine
├── .aws/credentials          (AWS credentials from aws configure)
├── .env                      (JWT_SECRET)
├── serverless.yml            (Configuration)
└── handlers/                 (Code)
```

### **After Deployment:**

```
AWS Account (us-east-1 region)
├── DynamoDB (9 tables)
│   ├── techeco-api-users-dev
│   ├── techeco-api-videos-dev
│   ├── techeco-api-jobs-dev
│   ├── techeco-api-posts-dev
│   └── ... (5 more)
│
├── S3 (2 buckets)
│   ├── techeco-api-videos-dev
│   └── techeco-api-resumes-dev
│
├── Lambda (36 functions)
│   ├── register
│   ├── uploadVideo
│   ├── createJob
│   └── ... (33 more)
│
├── API Gateway
│   └── 47 Endpoints (REST API)
│
└── CloudFormation Stack
    └── Manages all above resources
```

### **Frontend Integration:**

```
Frontend App
└── Uses API Gateway Endpoint URL
    ├── Sends JWT tokens from login
    ├── Hits 47 different endpoints
    ├── Uploads files to S3
    └── Receives data from DynamoDB
```

---

## 🔐 Security & Credentials Storage

```
┌─────────────────────────────────────────────────────┐
│        NEVER COMMIT TO GIT                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  .env (contains JWT_SECRET, AWS_PROFILE)          │
│  .aws/credentials (contains AWS keys)             │
│  .aws/config (contains AWS config)                │
│                                                     │
│  Add to .gitignore:                               │
│  .env                                             │
│  .aws/                                            │
│  node_modules/                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Safe to commit:**
```
serverless.yml          (Infrastructure config - no secrets)
package.json            (Dependencies - no secrets)
handlers/               (Code - no secrets)
.env.example            (Template - placeholder values)
README.md               (Documentation)
API_DOCUMENTATION.md    (Documentation)
```

---

## 📊 Resource Dependency Chain

```
AWS Access Keys
    ↓ (used by)
aws configure
    ↓ (stores in)
.aws/credentials
    ↓ (read by)
serverless deploy
    ↓ (creates)
DynamoDB Tables ─────┐
Lambda Functions ────├─→ CloudFormation Stack ─→ API Gateway
IAM Roles ───────────┘
    ↓
Frontend connects to API Gateway using endpoints
    ↓
All requests use DynamoDB (via Lambda)
    ↓
All auth tokens use JWT_SECRET (in environment)
    ↓
File uploads go to S3 buckets
```

---

## 🚀 Step-by-Step Integration

### **Phase 1: Local Setup (Your Machine)**
```
1. aws configure              (use AWS credentials)
   └─ stores in ~/.aws/
2. Generate JWT_SECRET        (openssl rand -base64 32)
   └─ store in .env
3. Update .env file           (AWS_REGION, STAGE, etc)
```

### **Phase 2: Create S3 Buckets**
```
1. aws s3 mb s3://techeco-api-videos-dev
2. aws s3 mb s3://techeco-api-resumes-dev
   (These are referenced in serverless.yml)
```

### **Phase 3: Deploy Backend**
```
1. npm install --legacy-peer-deps
2. npm run deploy:dev
   └─ Reads credentials from ~/.aws/
   └─ Reads secrets from .env
   └─ Creates all AWS resources
   └─ Outputs API Gateway URL
```

### **Phase 4: Connect Frontend**
```
1. Copy API Gateway URL
2. Update frontend config
3. Make API calls with JWT tokens
4. Files uploaded to S3
5. Data stored in DynamoDB
```

---

## ✅ Verification After Deployment

```bash
# 1. Check DynamoDB tables created
aws dynamodb list-tables --region us-east-1

# 2. Check S3 buckets
aws s3 ls

# 3. Check Lambda functions
aws lambda list-functions --region us-east-1

# 4. Check CloudFormation stack
aws cloudformation describe-stacks --region us-east-1 \
  --stack-name techeco-api-dev

# 5. Test API endpoint
curl https://YOUR-API-URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 🎯 Summary: What Connects Where

| Component | What It Needs | Where From | Purpose |
|-----------|---------------|-----------|---------|
| **aws configure** | Access Key + Secret | AWS Console | Authenticate to AWS |
| **.env file** | JWT_SECRET | `openssl` command | Encrypt tokens |
| **serverless.yml** | Region + Names | Hardcoded | Define infrastructure |
| **Lambda** | JWT_SECRET | .env file | Sign/verify tokens |
| **Lambda** | AWS credentials | ~/.aws/ | Access DynamoDB/S3 |
| **DynamoDB** | Nothing (created) | Auto | Store data |
| **S3** | Bucket names | serverless.yml | Store files |
| **Frontend** | API URL + Token | After deploy | Call endpoints |

---

**Everything is now ready! 🚀**

Next step: **Gather your credentials and deploy!**
