# ✅ SETUP CHECKLIST - Check Off As You Go

## Before You Start
- [ ] **You have AWS account access** (go to console.aws.amazon.com)
- [ ] **You can run CLI commands** (terminal or command prompt)
- [ ] **Node.js is installed** (run `node --version`, need v14+)
- [ ] **Git is installed** (optional, for version control)

---

## Phase 1: Gather Your 5 Things
### Time: ~5 minutes

- [ ] **AWS Access Key ID**
  - [ ] Go to AWS Console → IAM → Users → (your username) → Security credentials
  - [ ] Copy: "Access key ID"
  - [ ] Paste in: `_keys.txt` (create a text file to store safely)

- [ ] **AWS Secret Access Key**
  - [ ] Same location as Access Key ID
  - [ ] Copy: "Secret access key"
  - [ ] Paste in: `_keys.txt`

- [ ] **JWT Secret Token**
  - [ ] Open terminal/command prompt
  - [ ] Run: `openssl rand -base64 32`
  - [ ] Copy output
  - [ ] Paste in: `_keys.txt`

- [ ] **S3 Bucket Names** (Decision)
  - [ ] Videos bucket: `techeco-api-videos-dev` ← (default, or change this)
  - [ ] Resumes bucket: `techeco-api-resumes-dev` ← (default, or change this)

- [ ] **AWS Region**
  - [ ] Region: `us-east-1` ← (already configured, don't change)

---

## Phase 2: AWS Configuration
### Time: ~2 minutes

- [ ] Navigate to project folder in terminal
- [ ] Run: `aws configure`
  - [ ] Paste "Access Key ID"
  - [ ] Paste "Secret Access Key"
  - [ ] Enter region: `us-east-1`
  - [ ] Press Enter for output format (default is fine)

- [ ] Verify it worked:
  ```bash
  aws sts get-caller-identity
  ```
  - [ ] Should show your AWS account number and user ARN

---

## Phase 3: Create S3 Buckets
### Time: ~1 minute

- [ ] Run these commands:
  ```bash
  aws s3 mb s3://techeco-api-videos-dev
  aws s3 mb s3://techeco-api-resumes-dev
  ```

- [ ] Verify buckets exist:
  ```bash
  aws s3 ls
  ```

---

## Phase 4: Update Environment Config
### Time: ~1 minute

- [ ] Open file: `.env`
- [ ] Find line: `JWT_SECRET=your-secret-here`
- [ ] Replace `your-secret-here` with your JWT secret from Phase 1
- [ ] Save file

- [ ] Check other values:
  - [ ] S3_VIDEOS_BUCKET = `techeco-api-videos-dev` (or your name)
  - [ ] S3_RESUMES_BUCKET = `techeco-api-resumes-dev` (or your name)
  - [ ] AWS_REGION = `us-east-1`

---

## Phase 5: Install Dependencies
### Time: ~3 minutes

- [ ] Run: `npm install --legacy-peer-deps`
- [ ] Wait for completion (should see "added X packages")

---

## Phase 6: Test Locally (Optional but Recommended!)
### Time: ~2 minutes

- [ ] Run: `npm run dev`
- [ ] Should see output like:
  ```
  # Offline listening on...
  # GET /videos
  # POST /auth/register
  # ... etc (should show all 36 functions)
  ```
- [ ] Press Ctrl+C to stop

---

## Phase 7: Deploy to AWS
### Time: ~10-15 minutes (grab coffee!)

- [ ] Run: `npm run deploy:dev`
- [ ] Watch the output - should show progress
- [ ] At the end, look for line like:
  ```
  endpoints:
    POST https://xyz123.execute-api.us-east-1.amazonaws.com/dev/auth/register
    POST https://xyz123.execute-api.us-east-1.amazonaws.com/dev/auth/login
    ... (should show all 47 endpoints)
  ```

- [ ] Copy the base URL: `https://xyz123.execute-api.us-east-1.amazonaws.com/dev`
- [ ] Save this URL - you'll give it to frontend team!

---

## Phase 8: Verify Deployment
### Time: ~2 minutes

- [ ] Test the API:
  ```bash
  curl https://xyz123.execute-api.us-east-1.amazonaws.com/dev/auth/register \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"test","email":"test@test.com","password":"123456"}'
  ```

- [ ] Should get a response (may be error or success, but should respond)
- [ ] If you get timeout or "not found" - check deployment output above

---

## ✅ YOU'RE DONE! 

Your backend is now live! 🚀

### What's Ready to Use:

```
✅ User Registration
✅ Login & JWT Tokens
✅ Video Upload & Streaming
✅ Job Posting & Applications
✅ Resumes
✅ Social Posts & Comments
✅ Likes & Follows
✅ User Profiles

All auto-scaling! Zero management needed!
```

---

## 🎁 Next Steps

1. **Give To Frontend Team:**
   - API URL: `https://xyz123.execute-api.us-east-1.amazonaws.com/dev`
   - They can now integrate all endpoints

2. **Monitor Usage** (Optional):
   - Go to CloudWatch in AWS Console
   - Watch logs and metrics
   - Everything is automatically logged

3. **Add More Features:**
   - Each handler follows the same pattern
   - Add new handlers in `/handlers/` folder
   - Add routes to `serverless.yml`
   - Redeploy with `npm run deploy:dev`

4. **Scale to Production:**
   - When ready, run: `npm run deploy:prod`
   - Same steps, but with production resources

---

## 🆘 Something Not Working?

Check these in order:

1. [ ] Run `aws sts get-caller-identity` - verify AWS is configured
2. [ ] Check `.env` file - JWT_SECRET and bucket names correct?
3. [ ] Check bucket names - run `aws s3 ls`, compare with .env
4. [ ] Check version - run `node --version` (need v14+)
5. [ ] Check logs - look at deployment output for error messages
6. [ ] Read `DEPLOYMENT_CHECKLIST.md` - has common issues & solutions

---

## ⏱️ Total Time Summary

| Phase | Task | Time |
|-------|------|------|
| 1 | Gather credentials | 5 min |
| 2 | AWS Configuration | 2 min |
| 3 | Create S3 buckets | 1 min |
| 4 | Update .env | 1 min |
| 5 | npm install | 3 min |
| 6 | Local test (optional) | 2 min |
| 7 | Deploy to AWS | 15 min |
| 8 | Verify deployment | 2 min |
| **TOTAL** | **All phases** | **~31 minutes** |

---

**Print this checklist and check off each step as you complete it! ✨**

Questions? Refer to other documentation files in this folder.
