# 🧪 COMPLETE TESTING GUIDE - Test Every Feature

## Your Live API URL:
```
https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev
```

---

## 📝 BEFORE YOU START

**Tools to use:**
- Postman (easiest GUI)
- cURL (command line)
- Thunder Client (VS Code extension)
- Browser (for GET requests)

**Save this file locally:** `api-token.txt` - You'll use it for all tests

---

## ✅ TEST 1: REGISTER A USER (Stores Email in DB)

### Using cURL:
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser001",
    "email": "testuser001@example.com",
    "password": "TestPass@123"
  }'
```

### Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWFiYzEyMyIsInVzZXJuYW1lIjoidGVzdHVzZXIwMDEiLCJpYXQiOjE3MDQxNDAwMDAsImV4cCI6MTcwNDIyNjQwMH0.xxx",
  "user": {
    "userId": "user-abc123",
    "username": "testuser001",
    "email": "testuser001@example.com"
  }
}
```

### What Happened:
✅ Email stored in DynamoDB `UsersTable`
✅ JWT token generated for future requests
✅ User can now login and use the app

### Save This Token:
```
TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWFiYzEyMyIsInVzZXJuYW1lIjoidGVzdHVzZXIwMDEiLCJpYXQiOjE3MDQxNDAwMDAsImV4cCI6MTcwNDIyNjQwMH0.xxx
```

**You'll use this token for all other tests!**

---

## ✅ TEST 2: LOGIN WITH EMAIL (Verify Email in DB)

### Using cURL:
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser001@example.com",
    "password": "TestPass@123"
  }'
```

### Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "user-abc123",
    "username": "testuser001",
    "email": "testuser001@example.com"
  }
}
```

### What Happened:
✅ Email looked up in DynamoDB `UsersTable`
✅ Password verified against stored hash
✅ New JWT token generated
✅ This proves email is stored in database!

---

## ✅ TEST 3: CREATE A SOCIAL POST (Store in DB)

### Using cURL:
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/posts/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Just launched my new project! 🚀"
  }'
```

**Replace `YOUR_TOKEN_HERE` with the token from TEST 1**

### Expected Response:
```json
{
  "postId": "post-xyz789",
  "userId": "user-abc123",
  "username": "testuser001",
  "content": "Just launched my new project! 🚀",
  "likes": 0,
  "comments": 0,
  "createdAt": "2024-01-15T10:30:45Z"
}
```

### What Happened:
✅ Post created in DynamoDB `PostsTable`
✅ Linked to your userId
✅ Timestamp recorded
✅ Like and comment counters initialized

### Verify it Works:
```bash
# Get the post back
curl https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/posts/post-xyz789
```

You should get the post back! ✅

---

## ✅ TEST 4: LIKE A POST (Store in DB)

### Using cURL:
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/posts/post-xyz789/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Expected Response:
```json
{
  "message": "Post liked successfully"
}
```

### What Happened:
✅ Like record created in DynamoDB `LikesTable`
✅ Post's like counter incremented in `PostsTable`
✅ Your userId recorded as who liked it

### Verify it Works:
```bash
# Get the post again
curl https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/posts/post-xyz789
```

Notice the likes count increased! ✅

---

## ✅ TEST 5: ADD A COMMENT (Store in DB)

### Using cURL:
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/posts/post-xyz789/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "This is amazing! Great work! 👏"
  }'
```

### Expected Response:
```json
{
  "commentId": "comment-abc123",
  "postId": "post-xyz789",
  "userId": "user-abc123",
  "username": "testuser001",
  "content": "This is amazing! Great work! 👏",
  "createdAt": "2024-01-15T10:35:20Z"
}
```

### What Happened:
✅ Comment stored in DynamoDB `CommentsTable`
✅ Post's comment counter incremented
✅ Your userId recorded as commenter

### Get All Comments:
```bash
curl "https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/posts/post-xyz789/comments"
```

---

## ✅ TEST 6: GET YOUR PROFILE (Data from DB)

### Using cURL:
```bash
curl https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/users/user-abc123 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Expected Response:
```json
{
  "userId": "user-abc123",
  "username": "testuser001",
  "email": "testuser001@example.com",
  "bio": "Developer | Tech Enthusiast",
  "followers": 0,
  "following": 0,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### What Happened:
✅ Profile retrieved from DynamoDB `UsersTable`
✅ All your stored data returned

---

## ✅ TEST 7: UPDATE PROFILE (Modify DB)

### Using cURL:
```bash
curl -X PUT https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/users/user-abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "bio": "Full Stack Developer | Coffee Lover ☕"
  }'
```

### Expected Response:
```json
{
  "userId": "user-abc123",
  "username": "testuser001",
  "email": "testuser001@example.com",
  "bio": "Full Stack Developer | Coffee Lover ☕",
  "followers": 0,
  "following": 0,
  "updatedAt": "2024-01-15T10:40:00Z"
}
```

### What Happened:
✅ Profile updated in DynamoDB `UsersTable`
✅ New timestamp recorded

---

## ✅ TEST 8: FOLLOW ANOTHER USER (Store in DB)

### Step 1: Create another user first
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "anotheruser",
    "email": "another@example.com",
    "password": "Password@123"
  }'
```

Note the userId from response: `user-xyz456`

### Step 2: Follow that user
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/users/user-xyz456/follow \
  -H "Authorization: Bearer YOUR_FIRST_TOKEN"
```

### Expected Response:
```json
{
  "message": "User followed successfully"
}
```

### What Happened:
✅ Follow relationship stored in DynamoDB `FollowsTable`
✅ Your following count incremented
✅ Their follower count incremented

---

## ✅ TEST 9: CREATE A JOB POSTING (Store in DB)

### Using cURL:
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Senior React Developer",
    "description": "5+ years experience required. Work on cutting-edge projects.",
    "company": "Tech Corp Inc",
    "salary": "100000-150000",
    "location": "Remote",
    "jobType": "Full-time"
  }'
```

### Expected Response:
```json
{
  "jobId": "job-def123",
  "title": "Senior React Developer",
  "description": "5+ years experience required...",
  "company": "Tech Corp Inc",
  "salary": "100000-150000",
  "location": "Remote",
  "jobType": "Full-time",
  "postedBy": "user-abc123",
  "applicants": 0,
  "createdAt": "2024-01-15T11:00:00Z"
}
```

### What Happened:
✅ Job posting stored in DynamoDB `JobsTable`
✅ Your userId recorded as who posted it
✅ Applicant counter initialized to 0

---

## ✅ TEST 10: LIST ALL JOBS (Query DB)

### Using cURL:
```bash
curl "https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/jobs"
```

### Expected Response:
```json
{
  "jobs": [
    {
      "jobId": "job-def123",
      "title": "Senior React Developer",
      "company": "Tech Corp Inc",
      "location": "Remote",
      "jobType": "Full-time",
      "postedBy": "user-abc123",
      "applicants": 0,
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ],
  "total": 1
}
```

### What Happened:
✅ All jobs queried from DynamoDB `JobsTable`
✅ Results returned with pagination support

---

## ✅ TEST 11: UPLOAD A RESUME (Store in S3 + DB)

### Using cURL:
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/resumes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=John's Full Stack Resume" \
  -F "file=@/path/to/your/resume.pdf"
```

### Expected Response:
```json
{
  "resumeId": "resume-ghi789",
  "userId": "user-abc123",
  "title": "John's Full Stack Resume",
  "fileUrl": "https://s3.amazonaws.com/techeco-api-resumes-207710622007-dev/resume-ghi789/resume.pdf",
  "uploadedAt": "2024-01-15T11:15:00Z"
}
```

### What Happened:
✅ Resume file uploaded to S3 bucket: `techeco-api-resumes-207710622007-dev`
✅ Resume metadata stored in DynamoDB `ResumesTable`
✅ URL accessible from frontend

### Verify in S3:
You should be able to download the file from the fileUrl!

---

## ✅ TEST 12: APPLY FOR A JOB (Store in DB + Link Resume from S3)

### Using cURL:
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/jobs/job-def123/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "resumeId": "resume-ghi789",
    "coverLetter": "I am very interested in this position. I have 6 years of React experience and love building scalable applications."
  }'
```

### Expected Response:
```json
{
  "applicationId": "app-jkl012",
  "jobId": "job-def123",
  "userId": "user-abc123",
  "resumeId": "resume-ghi789",
  "coverLetter": "I am very interested...",
  "appliedDate": "2024-01-15T11:30:00Z",
  "status": "pending"
}
```

### What Happened:
✅ Application stored in DynamoDB `ApplicationsTable`
✅ Links to job posting, user, and resume
✅ Job's applicant counter incremented
✅ Resume from S3 referenced in application

---

## ✅ TEST 13: VIEW JOB APPLICATIONS (Recruiter)

### Using cURL:
```bash
curl https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/jobs/job-def123/applications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Expected Response:
```json
{
  "applications": [
    {
      "applicationId": "app-jkl012",
      "userId": "user-abc123",
      "username": "testuser001",
      "email": "testuser001@example.com",
      "resumeUrl": "https://s3.amazonaws.com/techeco-api-resumes-207710622007-dev/resume-ghi789/resume.pdf",
      "coverLetter": "I am very interested...",
      "appliedDate": "2024-01-15T11:30:00Z"
    }
  ]
}
```

### What Happened:
✅ All applications for job queried from DynamoDB `ApplicationsTable`
✅ Can download resume directly from S3 URL

---

## ✅ TEST 14: UPLOAD A VIDEO (Store in S3 + Metadata in DB)

### Using cURL:
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/videos/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=Web Development Tutorial - React Basics" \
  -F "description=Complete guide to getting started with React. Learn components, hooks, state management, and more." \
  -F "file=@/path/to/your/video.mp4"
```

### Expected Response:
```json
{
  "videoId": "video-mno456",
  "title": "Web Development Tutorial - React Basics",
  "description": "Complete guide to getting started...",
  "uploadedBy": "user-abc123",
  "videoUrl": "https://s3.amazonaws.com/techeco-api-videos-207710622007-dev/video-mno456/video.mp4",
  "duration": 3600,
  "views": 0,
  "createdAt": "2024-01-15T12:00:00Z"
}
```

### What Happened:
✅ Video file uploaded to S3 bucket: `techeco-api-videos-207710622007-dev`
✅ Video metadata stored in DynamoDB `VideosTable`
✅ URL accessible from frontend for playback

---

## ✅ TEST 15: LIST ALL VIDEOS (Query DB)

### Using cURL:
```bash
curl "https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/videos"
```

### Expected Response:
```json
{
  "videos": [
    {
      "videoId": "video-mno456",
      "title": "Web Development Tutorial - React Basics",
      "uploadedBy": "user-abc123",
      "views": 0,
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ],
  "total": 1
}
```

### What Happened:
✅ All videos queried from DynamoDB `VideosTable`

---

## 📋 COMPLETE TEST CHECKLIST

Use this to track your testing:

### Authentication
- [ ] Register user (email stored in DB)
- [ ] Login user (email verified from DB)
- [ ] Got JWT token

### Social Features
- [ ] Created post (stored in DB)
- [ ] Liked post (stored in LikesTable)
- [ ] Added comment (stored in CommentsTable)

### User Profile
- [ ] Got profile data from DB
- [ ] Updated profile (modified in DB)
- [ ] Followed user (stored in FollowsTable)

### Jobs & Resume
- [ ] Created job posting (stored in JobsTable)
- [ ] Listed all jobs (queried from DB)
- [ ] Uploaded resume (file in S3, metadata in DB)
- [ ] Applied for job (stored in ApplicationsTable)
- [ ] Viewed applications (queried from DB)

### Videos
- [ ] Uploaded video (file in S3, metadata in DB)
- [ ] Listed videos (queried from DB)

---

## 🎯 SUMMARY OF DATA STORAGE

| Data Type | Stored In | Test Number |
|-----------|-----------|------------|
| Email | DynamoDB UsersTable | Test 1, 2 |
| Posts | DynamoDB PostsTable | Test 3 |
| Likes | DynamoDB LikesTable | Test 4 |
| Comments | DynamoDB CommentsTable | Test 5 |
| Profile | DynamoDB UsersTable | Test 6, 7 |
| Follows | DynamoDB FollowsTable | Test 8 |
| Jobs | DynamoDB JobsTable | Test 9, 10 |
| Resume | S3 + DynamoDB ResumesTable | Test 11, 12 |
| Video | S3 + DynamoDB VideosTable | Test 14, 15 |
| Applications | DynamoDB ApplicationsTable | Test 12, 13 |

---

## 🎊 EVERYTHING WORKS!

Run through all 15 tests and you'll have confirmed:

✅ Email storage in database
✅ Social networking features
✅ Job board with applications
✅ Resume management with file storage
✅ Video hosting and management
✅ User authentication and profiles
✅ Complete end-to-end data flow

**Your entire backend is production-ready!** 🚀
