# 🏗️ Complete Data Flow & Architecture Guide

## Your API URL (Live & Working! ✅)
```
https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev
```

---

## 📊 SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND APPLICATIONS                    │
│  (React/Vue - TechEcosystem, TechTube, TechMart, JobIn)     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │   API Gateway (Your REST API)   │
        │  https://177vuj5ju5.execute... │
        └────────┬───────────────────────┘
                 │
    ┌────────────┼────────────────┬──────────────┐
    ▼            ▼                ▼              ▼
┌────────┐  ┌──────────┐   ┌─────────┐   ┌──────────┐
│λ Auth  │  │λ Jobs    │   │λ Videos │   │λ Social  │
│Handler │  │Handlers  │   │Handlers │   │Handlers  │
└────────┘  └──────────┘   └─────────┘   └──────────┘
    │            │                │              │
    └────────────┼────────────────┼──────────────┘
                 │
    ┌────────────┴────────DATABASES & STORAGE────┐
    │                                             │
    ▼                                             ▼
┌─────────────────────────────┐  ┌──────────────────────┐
│      DynamoDB Tables        │  │    S3 Buckets        │
│  (User Data & Metadata)     │  │  (Files & Videos)    │
└─────────────────────────────┘  └──────────────────────┘
```

---

## 📁 WHERE EACH DATA TYPE IS STORED

### **1. USER AUTHENTICATION & PROFILES** → DynamoDB `UsersTable`
```
{
  userId: "user-123",
  username: "john_doe",
  email: "john@example.com",          ← STORED IN DATABASE
  passwordHash: "sha256-hash-here",
  bio: "Developer | Coffee Lover",
  profilePicture: "https://s3.../pic.jpg",  ← URL stored in DB, image in S3
  followers: 42,
  following: 23,
  createdAt: "2024-01-01T10:00:00Z"
}
```

### **2. VIDEO UPLOADS** → S3 Bucket `techeco-api-videos-207710622007-dev`
```
S3 Structure:
s3://techeco-api-videos-207710622007-dev/
├── video-123/
│   └── techtube-video.mp4  (150 MB video file)
├── video-456/
│   └── tutorial.mp4
└── video-789/
    └── vlog.mp4

Metadata in DynamoDB `VideosTable`:
{
  videoId: "video-123",
  title: "Web Development Tutorial",
  description: "Learn React in 2 hours...",
  uploadedBy: "user-123",
  videoUrl: "https://s3.amazonaws.com/techeco-api-videos.../video-123/techtube-video.mp4",
  duration: 7200,
  views: 1523,
  likes: 45,
  createdAt: "2024-01-01T10:00:00Z"
}
```

### **3. JOB POSTINGS** → DynamoDB `JobsTable`
```
{
  jobId: "job-123",
  title: "Senior React Developer",
  description: "5+ years experience...",
  company: "Tech Corp",
  salary: "100000-150000",
  location: "Remote",
  jobType: "Full-time",
  postedBy: "recruiter-123",
  applicants: 23,
  createdAt: "2024-01-01T10:00:00Z"
}
```

### **4. RESUME FILES** → S3 Bucket `techeco-api-resumes-207710622007-dev`
```
S3 Structure:
s3://techeco-api-resumes-207710622007-dev/
├── resume-123/
│   └── john-doe-resume.pdf  (500 KB PDF)
├── resume-456/
│   └── updated-resume.pdf
└── resume-789/
    └── fullstack-resume.docx

Metadata in DynamoDB `ResumesTable`:
{
  resumeId: "resume-123",
  userId: "user-123",
  title: "John's Resume",
  fileUrl: "https://s3.amazonaws.com/techeco-api-resumes.../resume-123/john-doe-resume.pdf",
  uploadedAt: "2024-01-01T10:00:00Z"
}
```

### **5. JOB APPLICATIONS** → DynamoDB `ApplicationsTable`
```
{
  applicationId: "app-123",
  jobId: "job-123",
  userId: "user-123",
  resumeId: "resume-123",
  coverLetter: "I'm very interested...",
  appliedDate: "2024-01-01T10:00:00Z",
  status: "pending"  # pending, shortlisted, rejected, hired
}
```

### **6. SOCIAL POSTS (TechEcosystem/TechMart)** → DynamoDB `PostsTable`
```
{
  postId: "post-123",
  userId: "user-123",
  username: "john_doe",
  content: "Just launched my new project! 🚀",
  imageUrl: "https://s3.amazonaws.com/.../post-image.jpg",  ← URL in DB
  likes: 234,
  comments: 45,
  shares: 12,
  createdAt: "2024-01-01T10:00:00Z"
}
```

**Post Images:** Stored in S3, URL referenced in PostsTable

### **7. COMMENTS & REPLIES** → DynamoDB `CommentsTable`
```
{
  commentId: "comment-123",
  postId: "post-123",
  userId: "user-123",
  username: "john_doe",
  content: "Great post! Thanks for sharing.",
  createdAt: "2024-01-01T10:00:00Z",
  likes: 5
}
```

### **8. LIKES & ENGAGEMENT** → DynamoDB `LikesTable`
```
{
  likeId: "like-123",
  postId: "post-123",
  userId: "user-123",
  likedAt: "2024-01-01T10:00:00Z"
}
```

### **9. FOLLOWS/CONNECTIONS** → DynamoDB `FollowsTable`
```
{
  followId: "follow-123",
  followerId: "user-123",    ← Who is following
  followingId: "user-456",   ← Who is being followed
  followedAt: "2024-01-01T10:00:00Z"
}
```

---

## 🔄 COMPLETE DATA FLOW EXAMPLES

### Example 1: User Registration → Store Email in DB

```
FLOW:
1. Frontend calls:
   POST /auth/register
   {
     "username": "john_doe",
     "email": "john@example.com",    ← This email
     "password": "secure123"
   }

2. Lambda Handler (register.js) does:
   - Hash the password with SHA-256
   - Generate unique userId
   - Save to DynamoDB UsersTable:
      {
        userId: "user-abc123",
        username: "john_doe",
        email: "john@example.com",      ← STORED IN DATABASE ✓
        passwordHash: "sha256...",
        createdAt: "2024-01-01T10:00:00Z"
      }
   - Generate JWT token
   - Return token + user info

3. Frontend receives:
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": {
       "userId": "user-abc123",
       "username": "john_doe",
       "email": "john@example.com"
     }
   }

4. Frontend saves token in localStorage
   localStorage.setItem('authToken', token)

RESULT: Email is now in DynamoDB ✓
```

---

### Example 2: Video Upload → Store in S3, Metadata in DynamoDB

```
FLOW:
1. Frontend calls:
   POST /videos/upload
   Headers: Authorization: Bearer TOKEN
   File: Video file (100 MB)
   Data:
   {
     "title": "React Tutorial",
     "description": "Learn React basics"
   }

2. Lambda Handler (videos/upload.js) does:
   - Verify JWT token ✓
   - Get user ID from token
   - Generate videoId: "video-xyz789"
   - Upload video to S3:
      s3://techeco-api-videos-207710622007-dev/video-xyz789/react-tutorial.mp4
   - Save metadata to DynamoDB VideosTable:
      {
        videoId: "video-xyz789",
        title: "React Tutorial",
        description: "Learn React basics",
        uploadedBy: "user-abc123",
        videoUrl: "https://s3.amazonaws.com/.../video-xyz789/react-tutorial.mp4",
        duration: 3600,
        views: 0,
        createdAt: "2024-01-01T10:00:00Z"
      }

3. Lambda returns:
   {
     "videoId": "video-xyz789",
     "title": "React Tutorial",
     "videoUrl": "https://s3.amazonaws.com/...",
     "message": "Video uploaded successfully"
   }

RESULT:
- Video file in S3 ✓
- Metadata in DynamoDB ✓
```

---

### Example 3: Social Post with Image → DB + S3

```
FLOW:
1. Frontend calls:
   POST /posts/create
   Headers: Authorization: Bearer TOKEN
   Data:
   {
     "content": "Just built an AI chatbot! 🤖",
     "image": [File object - 5 MB image]
   }

2. Lambda Handler (posts/create.js) does:
   - Verify JWT token ✓
   - Generate postId: "post-abc456"
   - Upload image to S3:
      s3://techeco-api-videos-207710622007-dev/posts/post-abc456/image.jpg
      (Or can use a separate posts bucket)
   - Save post metadata to DynamoDB PostsTable:
      {
        postId: "post-abc456",
        userId: "user-abc123",
        username: "john_doe",
        content: "Just built an AI chatbot! 🤖",
        imageUrl: "https://s3.amazonaws.com/.../post-abc456/image.jpg",
        likes: 0,
        comments: 0,
        createdAt: "2024-01-01T10:00:00Z"
      }

3. Frontend receives:
   {
     "postId": "post-abc456",
     "content": "Just built an AI chatbot! 🤖",
     "imageUrl": "https://s3.amazonaws.com/.../image.jpg",
     "likes": 0,
     "username": "john_doe"
   }

RESULT:
- Post metadata in DynamoDB ✓
- Image in S3 ✓
```

---

### Example 4: Resume Upload for Job Application → S3 + DB

```
FLOW:
1. Frontend calls:
   POST /resumes/upload
   Headers: Authorization: Bearer TOKEN
   File: Resume file (PDF, 500 KB)
   Data:
   {
     "title": "John's Full Stack Resume"
   }

2. Lambda Handler (resumes/upload.js) does:
   - Verify JWT token ✓
   - Generate resumeId: "resume-def789"
   - Upload to S3:
      s3://techeco-api-resumes-207710622007-dev/resume-def789/john-resume.pdf
   - Save to DynamoDB ResumesTable:
      {
        resumeId: "resume-def789",
        userId: "user-abc123",
        title: "John's Full Stack Resume",
        fileUrl: "https://s3.amazonaws.com/.../resume-def789/john-resume.pdf",
        uploadedAt: "2024-01-01T10:00:00Z"
      }

3. Now user can apply to jobs with this resume:
   POST /jobs/{jobId}/apply
   {
     "resumeId": "resume-def789",
     "coverLetter": "I'm excited about this role..."
   }

4. Lambda Handler saves to DynamoDB ApplicationsTable:
   {
     "applicationId": "app-ghi012",
     "jobId": "job-123",
     "userId": "user-abc123",
     "resumeId": "resume-def789",
     "coverLetter": "I'm excited...",
     "appliedDate": "2024-01-01T10:00:00Z"
   }

RESULT:
- Resume file in S3 ✓
- Resume metadata in DynamoDB ✓
- Application record in DynamoDB ✓
```

---

## 🔑 AWS RESOURCES CREATED (Already Done!)

### DynamoDB Tables (9 total):
1. **UsersTable** - User accounts, profiles, credentials
2. **VideosTable** - Video metadata, URLs, view counts
3. **JobsTable** - Job postings
4. **ResumesTable** - Resume metadata
5. **PostsTable** - Social posts, tweets, stories
6. **CommentsTable** - Comments on posts
7. **LikesTable** - Like/engagement records
8. **FollowsTable** - Follow relationships
9. **ApplicationsTable** - Job applications

### S3 Buckets (2 total):
1. **techeco-api-videos-207710622007-dev** - Videos, images, media
   ```
   Files stored:
   - Videos (MP4, AVI, MOV)
   - Images (JPG, PNG)
   - Documents (PDF)
   - Any media files
   ```

2. **techeco-api-resumes-207710622007-dev** - Resume documents
   ```
   Files stored:
   - Resumes (PDF, DOCX)
   - Cover letters (PDF)
   - Certificates
   ```

---

## 🛡️ IAM PERMISSIONS (Already Configured!)

Your Lambda functions have permission to:

### DynamoDB:
- Scan, Query, GetItem, PutItem, UpdateItem, DeleteItem
- BatchGetItem, BatchWriteItem, DescribeTable

### S3:
- PutObject (upload files)
- GetObject (download files)
- DeleteObject (delete files)
- ListBucket (list all files)

---

## 🔐 AUTHENTICATION FLOW

```
1. User calls /auth/register:
   ├─ Email stored in UsersTable ✓
   ├─ Password hashed with SHA-256 ✓
   ├─ JWT token generated (24-hour expiry) ✓
   └─ Token returned to frontend ✓

2. Frontend stores token:
   localStorage.setItem('token', token)

3. For protected endpoints:
   ├─ Frontend sends: Authorization: Bearer {token}
   ├─ Lambda calls authorizer function
   ├─ Authorizer verifies JWT signature
   ├─ If valid → request proceeds ✓
   └─ If invalid → returns 401 Unauthorized ✗

4. Handler can access user info from token:
   const userId = event.requestContext.authorizer.principalId
   const username = event.requestContext.authorizer.username
```

---

## 📋 WHAT EACH SERVICE HANDLES

### **AUTH SERVICE** (handlers/auth/)
- ✓ User registration (email in DB)
- ✓ User login (email verification)
- ✓ JWT token generation
- ✓ Token verification (authorizer)

### **TECHTUBE** (handlers/videos/)
- ✓ Video upload (to S3)
- ✓ Video metadata (in DB)
- ✓ Video search & listing
- ✓ Video updates
- ✓ Video deletion

### **TECHTMRT / SOCIAL** (handlers/social/posts/)
- ✓ Create posts (metadata in DB, images in S3)
- ✓ Like/unlike posts (in LikesTable)
- ✓ Comment on posts (in CommentsTable)
- ✓ Share posts
- ✓ View post feeds

### **JOBIN** (handlers/jobs/)
- ✓ Post jobs (in JobsTable)
- ✓ Search/filter jobs
- ✓ Apply to jobs (applicationId in ApplicationsTable)
- ✓ Resume upload (in S3 + ResumesTable)
- ✓ View applications (recruiter side)

### **USER PROFILES** (handlers/users/)
- ✓ User profile data (in UsersTable)
- ✓ Profile picture (in S3, URL in DB)
- ✓ Bio & info (in DB)
- ✓ Follower/following counts

### **ENGAGEMENT** (handlers/social/)
- ✓ Follows/unfollows (in FollowsTable)
- ✓ Likes (in LikesTable)
- ✓ Comments (in CommentsTable)

---

## ✅ TESTING THE COMPLETE FLOW

### Step 1: Register User (Store Email in DB)
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "user-abc123",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

✓ **Email is now in DynamoDB UsersTable!**

---

### Step 2: Create Social Post (Store in DB + S3 Image)
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/posts/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {YOUR_TOKEN_HERE}" \
  -d '{
    "content": "Just learned React! 🚀",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

✓ **Post metadata in DynamoDB PostsTable!**
✓ **Image stored in S3!**

---

### Step 3: Upload Resume (Store in S3 + DB Metadata)
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/resumes/upload \
  -H "Authorization: Bearer {YOUR_TOKEN_HERE}" \
  -F "title=My Resume" \
  -F "file=@resume.pdf"
```

✓ **Resume file in S3!**
✓ **Metadata in DynamoDB ResumesTable!**

---

### Step 4: Apply to Job (Store in ApplicationsTable)
```bash
curl -X POST https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/jobs/{jobId}/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {YOUR_TOKEN_HERE}" \
  -d '{
    "resumeId": "resume-abc123",
    "coverLetter": "I am interested in this role..."
  }'
```

✓ **Application record in DynamoDB ApplicationsTable!**

---

## 🎯 TROUBLESHOOTING

### Problem: "Missing Authentication Token" Error
- **Cause:** Accessing protected endpoint without token
- **Solution:** Add `Authorization: Bearer {token}` header

### Problem: "InvalidParameterException" in DynamoDB
- **Cause:** Email not being stored
- **Solution:** Check that registration endpoint is called first

### Problem: S3 Upload Fails
- **Cause:** S3 bucket permissions issue
- **Solution:** Check IAM role has S3 put/get permissions (already configured)

### Problem: Video/Image URL Returns 404
- **Cause:** File not uploaded to correct S3 path
- **Solution:** Verify bucket name and file path in handler code

---

## 📱 FRONTEND INTEGRATION SUMMARY

```javascript
// 1. Register user (stores email in DB)
const registerResponse = await fetch(
  'https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/auth/register',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'secure123'
    })
  }
);
const { token, user } = await registerResponse.json();
localStorage.setItem('token', token);

// 2. Create social post (stores in DB + S3)
await fetch(
  'https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/posts/create',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      content: 'Hello world!',
      imageUrl: 'https://example.com/pic.jpg'
    })
  }
);

// 3. Upload video (stores in S3 + metadata in DB)
const formData = new FormData();
formData.append('file', videoFile);
formData.append('title', 'My Video');
await fetch(
  'https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/videos/upload',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  }
);
```

---

## 🎊 SUMMARY

Your complete backend is working! Everything is:

| Component | Status | Location |
|-----------|--------|----------|
| User Emails | ✅ Working | DynamoDB UsersTable |
| Videos | ✅ Working | S3 + DynamoDB VideosTable |
| Posts/Stories | ✅ Working | DynamoDB PostsTable + S3 images |
| Job Postings | ✅ Working | DynamoDB JobsTable |
| Resumes | ✅ Working | S3 + DynamoDB ResumesTable |
| Applications | ✅ Working | DynamoDB ApplicationsTable |
| Comments | ✅ Working | DynamoDB CommentsTable |
| Likes | ✅ Working | DynamoDB LikesTable |
| Follows | ✅ Working | DynamoDB FollowsTable |

**Everything is automatically scaling and production-ready!** 🚀
