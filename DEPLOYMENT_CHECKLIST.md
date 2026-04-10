# 🚀 Deployment Checklist & Troubleshooting

## Pre-Deployment Checklist

Use this checklist to verify everything is ready before you deploy!

---

## ✅ Prerequisites Checklist

### **1. AWS Account & Credentials**

```
[ ] AWS Account Created
    ├─ Account ID: ____________________
    └─ Region: us-east-1
    
[ ] AWS Access Keys Created
    ├─ Access Key ID: ____________________
    └─ Secret Access Key: ____________________
    
[ ] aws CLI Installed
    ```bash
    aws --version
    # Should output: aws-cli/2.x.x
    ```
    
[ ] aws configure Completed
    ```bash
    aws configure
    # Paste your keys when prompted
    ```
    
[ ] Credentials Verified
    ```bash
    aws sts get-caller-identity
    # Should show your Account ID
    ```
```

### **2. JWT Secret Generated**

```
[ ] Secret Generated
    ```bash
    openssl rand -base64 32
    # Copy the output: ____________________
    ```
    
[ ] Secret Added to .env
    ```bash
    # File: .env
    JWT_SECRET=paste-your-secret-here
    ```
```

### **3. S3 Buckets Created**

```
[ ] Videos Bucket Created
    ```bash
    aws s3 mb s3://techeco-api-videos-dev --region us-east-1
    # Should output: make_bucket: techeco-api-videos-dev
    ```
    
[ ] Resumes Bucket Created
    ```bash
    aws s3 mb s3://techeco-api-resumes-dev --region us-east-1
    # Should output: make_bucket: techeco-api-resumes-dev
    ```
    
[ ] Buckets Verified
    ```bash
    aws s3 ls
    # Should show both buckets
    ```
```

### **4. Environment Configuration**

```
[ ] .env File Created
    ```bash
    # Check file exists
    ls .env
    ```
    
[ ] .env Contains:
    [ ] JWT_SECRET (from openssl)
    [ ] AWS_REGION=us-east-1
    [ ] AWS_PROFILE=default
    [ ] STAGE=dev
    [ ] REGION=us-east-1
    
[ ] .env NOT Committed to Git
    [ ] Added to .gitignore
    [ ] Not in git history
```

### **5. IAM Permissions Check**

```
[ ] User Has DynamoDB Permissions
    Go to: https://console.aws.amazon.com/iam
    Users → Your User → Permissions
    [ ] See: AmazonDynamoDBFullAccess
    
[ ] User Has S3 Permissions
    [ ] See: AmazonS3FullAccess
    
[ ] User Has Lambda Permissions
    [ ] See: AWSLambdaFullAccess
    
[ ] User Has CloudFormation Permissions
    [ ] See: CloudFormationFullAccess
    
[ ] User Has IAM Permissions
    [ ] See: IAMFullAccess
```

### **6. Node.js & NPM**

```
[ ] Node.js Installed (v14+)
    ```bash
    node --version
    # Should output: v14.x.x or v16.x.x or higher
    ```
    
[ ] NPM Installed
    ```bash
    npm --version
    # Should output: v6.x.x or higher
    ```
```

### **7. Project Dependencies**

```
[ ] Dependencies Installed
    ```bash
    npm install --legacy-peer-deps
    # Should complete without errors
    ```
    
[ ] node_modules Exists
    [ ] Folder created: node_modules/
    [ ] Approximately 1000+ packages
    
[ ] serverless CLI Available
    ```bash
    npx serverless --version
    # Should output: Framework Core: 3.x.x
    ```
```

### **8. Local Testing**

```
[ ] Local Server Starts
    ```bash
    npm run dev
    # Should see: listening on http://localhost:3000
    # Or: localhost:3002 for offline
    ```
    
[ ] Server Responds
    ```bash
    # In another terminal:
    curl http://localhost:3000/auth/login -X POST
    # Should get a response (even if error)
    ```
    
[ ] No Bundling Errors
    [ ] npm run dev completed without errors
    [ ] No "webpack" errors
    [ ] No "module not found" errors
```

---

## 🚀 Deployment Checklist

When ready to deploy:

```
[ ] All Prerequisites Passed Above
    
[ ] Final .env Check
    ```bash
    cat .env
    # Verify all values are correct
    ```
    
[ ] Git Check (Don't Commit Secrets)
    ```bash
    git status
    # Should NOT show .env
    # Should NOT show .aws/
    # .gitignore should have both
    ```
    
[ ] Deploy Command
    ```bash
    npm run deploy:dev
    # This will:
    # 1. Bundle code
    # 2. Create DynamoDB tables
    # 3. Deploy Lambda functions
    # 4. Set up API Gateway
    # 5. Create CloudFormation stack
    # Duration: 10-15 minutes
    ```
    
[ ] Deployment Success
    [ ] See: "Stack update finished"
    [ ] See: "endpoints:" section
    [ ] Copy the API URL
    
[ ] API URL Copied
    [ ] Example: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
    [ ] Save this for frontend
```

---

## ❌ Common Issues & Solutions

### **Issue 1: "InvalidParameterException" When Creating Bucket**

**Problem:**
```
Error: The bucket name is not available. The bucket may have been created by another user.
```

**Cause:** S3 bucket names must be globally unique

**Solution:**
```bash
# Use a unique name with your identifier
aws s3 mb s3://techeco-api-videos-YOUR-NAME-dev --region us-east-1
aws s3 mb s3://techeco-api-resumes-YOUR-NAME-dev --region us-east-1

# Update in serverless.yml:
environment:
  videosBucket: techeco-api-videos-YOUR-NAME-dev
  resumesBucket: techeco-api-resumes-YOUR-NAME-dev
```

---

### **Issue 2: "NOT FOUND: User: arn:aws..." (Invalid Credentials)**

**Problem:**
```
Error: NOT FOUND: User: arn:aws:iam::123456789:user/your-user
```

**Cause:** AWS credentials are invalid or expired

**Solution:**
```bash
# Reconfigure credentials
aws configure
# Enter correct Access Key ID and Secret Access Key

# Verify
aws sts get-caller-identity
# Should show your Account ID
```

---

### **Issue 3: "AccessDenied" on S3**

**Problem:**
```
User: arn:aws:iam::123456789:user/xxx is not authorized
```

**Cause:** IAM user doesn't have S3 permissions

**Solution:**
1. Go to: https://console.aws.amazon.com/iam
2. Users → Your User → Add Permissions
3. Attach Policy: `AmazonS3FullAccess`
4. Wait 1 minute for permissions to propagate
5. Try again

---

### **Issue 4: "Insufficient Permissions" During Deploy**

**Problem:**
```
User is not authorized to perform: dynamodb:CreateTable
```

**Cause:** Missing DynamoDB or CloudFormation permissions

**Solution:**
```
Add these policies to your IAM user:
1. AmazonDynamoDBFullAccess
2. CloudFormationFullAccess
3. IAMFullAccess
4. AWSLambdaFullAccess
```

---

### **Issue 5: `npm install` Fails with "ERESOLVE"**

**Problem:**
```
npm error ERESOLVE could not resolve
```

**Cause:** Peer dependency conflicts

**Solution:**
```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# Or clear cache first
npm cache clean --force
npm install --legacy-peer-deps
```

---

### **Issue 6: `.env` File Not Being Read**

**Problem:**
```
JWT_SECRET is undefined
```

**Cause:** serverless-dotenv-plugin not working or .env missing

**Solution:**
```bash
# Check .env exists
ls -la .env

# Check .env has correct format
cat .env
# Should show values, not errors

# Check serverless.yml has plugin
grep "serverless-dotenv-plugin" serverless.yml

# Reinstall dotenv plugin
npm install serverless-dotenv-plugin --save-dev --legacy-peer-deps
```

---

### **Issue 7: DynamoDB Tables Not Creating**

**Problem:**
```
CloudFormation failed: Resource creation cancelled
```

**Cause:** Missing permissions or duplicate table names

**Solution:**
```bash
# Check if tables exist
aws dynamodb list-tables --region us-east-1

# If they exist, remove old stack
aws cloudformation delete-stack --stack-name techeco-api-dev

# Wait for deletion to complete
aws cloudformation wait stack-delete-complete --stack-name techeco-api-dev

# Then deploy again
npm run deploy:dev
```

---

### **Issue 8: "Bucket Already Exists" During Deploy**

**Problem:**
```
Create failed: BucketAlreadyExists
```

**Cause:** S3 bucket created manually, serverless tries to create again

**Solution:**
1. Option A: Remove bucket from serverless.yml (manually manage S3)
2. Option B: Delete bucket and let serverless create it
3. Option C: Use different bucket name

---

### **Issue 9: Lambda Functions Timing Out**

**Problem:**
```
Task timed out after 30 seconds
```

**Cause:** Functions taking too long to execute

**Solution:**
```bash
# In serverless.yml, increase timeout:
functions:
  myFunction:
    handler: handler.main
    timeout: 60  # Increase from 30 to 60 seconds
    
# Redeploy
npm run deploy:dev
```

---

### **Issue 10: "CORS" Errors in Frontend**

**Problem:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Cause:** API doesn't allow requests from your frontend origin

**Solution:**
```bash
# In serverless.yml, update CORS:
events:
  - http:
      path: auth/login
      method: post
      cors:
        origin: '*'
        headers:
          - Content-Type
          - X-Amz-Date
          - Authorization
          
# Redeploy
npm run deploy:dev
```

---

## 🔍 Debugging Tips

### **1. Check Logs in Real-time**

```bash
# View logs for a specific function
npm run logs -f register

# View logs for all functions
aws logs tail /aws/lambda/techeco-api-dev-register --follow

# Last 50 lines
aws logs tail /aws/lambda/techeco-api-dev-register --max-items 50
```

### **2. Test Locally Before Deploying**

```bash
# Start local server
npm run dev

# Test endpoint
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User",
    "username": "testuser"
  }'
```

### **3. Check Resource Creation**

```bash
# List DynamoDB tables
aws dynamodb list-tables --region us-east-1 --output table

# Describe a table
aws dynamodb describe-table --table-name techeco-api-users-dev

# List Lambda functions
aws lambda list-functions --region us-east-1 --output table

# Check CloudFormation stack
aws cloudformation describe-stack-resources --stack-name techeco-api-dev
```

### **4. Test After Deployment**

```bash
# Get API URL from deployment output or:
aws cloudformation describe-stacks --stack-name techeco-api-dev \
  --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
  --output table

# Test a health check endpoint
curl https://YOUR-API-URL/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

---

## 📊 Post-Deployment Verification

After successful deployment:

```bash
# 1. Check all tables created
[ ] aws dynamodb list-tables | grep techeco-api

# 2. Check Lambda functions deployed
[ ] aws lambda list-functions | grep techeco-api | wc -l
    Should show: 36+ functions

# 3. Check API Gateway
[ ] aws apigateway get-rest-apis | grep techeco-api

# 4. Test register endpoint
[ ] curl -X POST https://YOUR-API-URL/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"pass","firstName":"F","lastName":"L","username":"u"}'
    Should return: { token: "...", data: {...} }

# 5. Check S3 buckets
[ ] aws s3 ls | grep techeco-api
    Should show: 2 buckets

# 6. Monitor CloudWatch logs
[ ] aws logs describe-log-groups | grep techeco-api
    Should show: ~36 log groups
```

---

## 🎯 Final Checklist Before Going Live

```
BEFORE YOU TELL USERS TO USE THIS API:

[ ] Test all 47 endpoints locally
[ ] Test user registration to login flow
[ ] Test video upload (mock S3)
[ ] Test job posting and application
[ ] Test social post creation and likes
[ ] Verify CORS is properly configured
[ ] Check rate limiting is configured
[ ] Set JWT_SECRET to strong value for prod
[ ] Enable CloudWatch alarms
[ ] Set up monitoring dashboard
[ ] Document API endpoints for team
[ ] Test error handling and edge cases
[ ] Security audit completed
[ ] Load testing completed (if expected traffic)
[ ] Rollback plan documented
```

---

## 📞 Need Help?

**If deployment fails:**
1. Note the exact error message
2. Check this troubleshooting guide
3. Check AWS CloudFormation console for events
4. Review `npm run dev` for local issues
5. Check CloudWatch logs for runtime errors

**Useful Commands:**
```bash
npm run dev           # Local testing
npm run deploy:dev    # Deploy
npm run logs -f func  # View logs
npm run remove        # Delete stack
aws events           # See what happened
```

---

**You're ready to deploy! 🚀**

Remember:
- ✅ Gather all credentials first
- ✅ Test locally with `npm run dev`
- ✅ Deploy with `npm run deploy:dev`
- ✅ Copy API URL for frontend
- ✅ Never commit .env or .aws/
