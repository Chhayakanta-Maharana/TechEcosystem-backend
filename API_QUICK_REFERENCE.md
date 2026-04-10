# 🔗 API QUICK REFERENCE - Endpoints & Examples

## Replace This URL:
```
https://your-api-url.execute-api.us-east-1.amazonaws.com/dev
```
With the URL you get from deployment output! Example:
```
https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev
```

---

## 🔑 AUTHENTICATION ENDPOINTS

### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "user-123",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Keep the token!** Use it in all other requests:
```bash
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📺 VIDEO ENDPOINTS

### Upload Video
```bash
POST /videos/upload
Content-Type: multipart/form-data
Authorization: Bearer TOKEN

# Form fields:
title: "My Video Title"
description: "Video description"
file: [video.mp4]
```

### Get Video
```bash
GET /videos/{videoId}

Response:
{
  "videoId": "video-123",
  "title": "My Video",
  "description": "...",
  "videoUrl": "https://s3.amazonaws.com/...",
  "uploadedBy": "user-123",
  "createdAt": "2024-01-01T10:00:00Z",
  "views": 42
}
```

### List Videos
```bash
GET /videos/list?search=tutorial&page=1&limit=10

Response:
{
  "videos": [
    { videoId, title, description, ... },
    ...
  ],
  "total": 42,
  "page": 1
}
```

### Update Video
```bash
PUT /videos/{videoId}
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### Delete Video
```bash
DELETE /videos/{videoId}
Authorization: Bearer TOKEN
```

---

## 💼 JOB ENDPOINTS

### Post Job
```bash
POST /jobs/create
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "title": "Senior Developer",
  "description": "5+ years experience...",
  "company": "Tech Corp",
  "salary": "100000-150000",
  "location": "Remote",
  "jobType": "Full-time"
}
```

### Get Job
```bash
GET /jobs/{jobId}

Response:
{
  "jobId": "job-123",
  "title": "Senior Developer",
  "description": "...",
  "company": "Tech Corp",
  "salary": "100000-150000",
  "location": "Remote",
  "jobType": "Full-time",
  "postedBy": "recruiter-user-id",
  "postedDate": "2024-01-01T10:00:00Z",
  "applicants": 15
}
```

### List Jobs
```bash
GET /jobs/list?search=developer&location=Remote&page=1&limit=20

Response:
{
  "jobs": [
    { jobId, title, company, location, ... },
    ...
  ],
  "total": 156,
  "page": 1
}
```

### Apply to Job
```bash
POST /jobs/{jobId}/apply
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "resumeId": "resume-123",  # Your resume ID
  "coverLetter": "I'm very interested in this position..."
}
```

### View Applications (Recruiter)
```bash
GET /jobs/{jobId}/applications
Authorization: Bearer TOKEN

Response:
{
  "applications": [
    {
      "applicationId": "app-123",
      "userId": "user-123",
      "username": "john_doe",
      "resumeUrl": "https://s3.amazonaws.com/...",
      "coverLetter": "...",
      "appliedDate": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Delete Job
```bash
DELETE /jobs/{jobId}
Authorization: Bearer TOKEN
```

---

## 📄 RESUME ENDPOINTS

### Upload Resume
```bash
POST /resumes/upload
Content-Type: multipart/form-data
Authorization: Bearer TOKEN

# Form fields:
title: "John's Resume"
file: [resume.pdf]
```

### Get Your Resumes
```bash
GET /resumes/list
Authorization: Bearer TOKEN

Response:
{
  "resumes": [
    {
      "resumeId": "resume-123",
      "title": "John's Resume",
      "url": "https://s3.amazonaws.com/...",
      "uploadedAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Update Resume
```bash
PUT /resumes/{resumeId}
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "title": "Updated Resume Title"
}
```

### Delete Resume
```bash
DELETE /resumes/{resumeId}
Authorization: Bearer TOKEN
```

---

## 👤 USER PROFILE ENDPOINTS

### Get Profile
```bash
GET /users/{userId}

Response:
{
  "userId": "user-123",
  "username": "john_doe",
  "email": "john@example.com",
  "bio": "Developer | Coffee Enthusiast",
  "profilePicture": "https://s3.amazonaws.com/...",
  "followers": 42,
  "following": 23,
  "createdAt": "2024-01-01T10:00:00Z"
}
```

### Update Profile
```bash
PUT /users/profile
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "bio": "Developer | Open Source Enthusiast",
  "username": "john_doe_updated"
}
```

### Update Profile Picture
```bash
PUT /users/profile/picture
Content-Type: multipart/form-data
Authorization: Bearer TOKEN

# Form fields:
file: [picture.jpg]
```

---

## 📱 SOCIAL ENDPOINTS

### Create Post
```bash
POST /social/posts/create
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "content": "Just deployed my new project! 🚀",
  "imageUrl": "optional-image-url"
}
```

### Get Post
```bash
GET /social/posts/{postId}

Response:
{
  "postId": "post-123",
  "userId": "user-123",
  "username": "john_doe",
  "content": "Just deployed...",
  "imageUrl": "...",
  "likes": 23,
  "comments": 5,
  "createdAt": "2024-01-01T10:00:00Z"
}
```

### List Posts by User
```bash
GET /social/posts/user/{userId}?page=1&limit=10

Response:
{
  "posts": [
    { postId, userId, content, likes, comments, ... },
    ...
  ],
  "total": 42,
  "page": 1
}
```

### Like Post
```bash
POST /social/posts/{postId}/like
Authorization: Bearer TOKEN
```

### Unlike Post
```bash
DELETE /social/posts/{postId}/like
Authorization: Bearer TOKEN
```

### Comment on Post
```bash
POST /social/posts/{postId}/comments
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "content": "Great post! Thanks for sharing."
}

Response:
{
  "commentId": "comment-123",
  "postId": "post-123",
  "userId": "user-123",
  "username": "john_doe",
  "content": "Great post...",
  "createdAt": "2024-01-01T10:00:00Z"
}
```

### Get Comments
```bash
GET /social/posts/{postId}/comments?page=1&limit=10

Response:
{
  "comments": [
    { commentId, username, content, createdAt, ... },
    ...
  ],
  "total": 5
}
```

### Delete Comment
```bash
DELETE /social/posts/{postId}/comments/{commentId}
Authorization: Bearer TOKEN
```

### Follow User
```bash
POST /users/{userId}/follow
Authorization: Bearer TOKEN
```

### Unfollow User
```bash
DELETE /users/{userId}/follow
Authorization: Bearer TOKEN
```

---

## ⚠️ ERROR RESPONSES

### Unauthorized (Missing Token)
```
Status: 401
{
  "message": "Unauthorized - Missing Token"
}
```

### Not Found
```
Status: 404
{
  "message": "Resource not found"
}
```

### Validation Error
```
Status: 400
{
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

### Server Error
```
Status: 500
{
  "message": "Internal server error"
}
```

---

## 🧪 QUICK TEST COMMANDS

### 1. Register
```bash
curl -X POST https://your-url/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### 2. Login
```bash
curl -X POST https://your-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

Save the token from response, then use:

### 3. Get Your Profile
```bash
curl -X GET https://your-url/users/your-user-id \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create Post
```bash
curl -X POST https://your-url/social/posts/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Testing the API! 🎉"
  }'
```

### 5. List Videos
```bash
curl https://your-url/videos/list
```

---

## 📚 HEADERS YOU NEED

### All Requests
```
Content-Type: application/json
```

### Protected Endpoints
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### File Upload (multipart)
```
Content-Type: multipart/form-data
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 🔐 TOKEN TIPS

1. **Get token** from `/auth/register` or `/auth/login` response
2. **Token valid for** 24 hours
3. **Use in every request** with `Authorization: Bearer TOKEN`
4. **Token contains** your userId and username
5. **Server verifies** token is valid before processing request
6. **Expired token?** Just login again to get a new one

---

## 📝 PAGINATION

Most list endpoints support:
```
?page=1        # Page number (starts at 1)
?limit=10      # Items per page
?search=term   # Search query (if available)
```

Example:
```
GET /videos/list?search=tutorial&page=2&limit=20
```

---

## 🎁 TIMESTAMPS

All timestamps are ISO 8601 format:
```
"2024-01-01T10:30:45Z"
```

You can parse with JavaScript:
```javascript
const date = new Date("2024-01-01T10:30:45Z");
```

---

## 📞 NEED HELP?

1. Check the response status code (401, 404, 500, etc.)
2. Read the error message in response
3. Check you're using the right HTTP method (GET, POST, PUT, DELETE)
4. Verify token is included for protected endpoints
5. Check field names match exactly (case-sensitive)

**Still stuck?** Check DEPLOYMENT_CHECKLIST.md for troubleshooting! 🔧

---

**Your API is ready! Start integrating! 🚀**
