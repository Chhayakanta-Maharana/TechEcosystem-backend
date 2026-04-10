# TechEcosystem Backend API Documentation

## Overview
Complete serverless backend for TechEcosystem platform featuring:
- **TechTube**: Video streaming platform (YouTube-like)
- **JobIn**: Job board & resume builder
- **TechMart**: E-commerce platform
- **Social**: Instagram-like social features

## Stack
- **Framework**: Serverless Framework
- **Database**: AWS DynamoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Storage**: AWS S3 (for videos and resumes)
- **Runtime**: Node.js 16.x

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- AWS Account with credentials configured
- Serverless Framework CLI

### Installation Steps

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and set your JWT_SECRET
   ```

3. **Deploy to AWS**:
   ```bash
   npm run deploy:dev
   ```

4. **Run locally** (for development):
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### Register
```
POST /auth/register
Body: {
  "email": "user@example.com",
  "password": "secure_password",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe"
}
```

#### Login
```
POST /auth/login
Body: {
  "email": "user@example.com",
  "password": "secure_password"
}
Response: { token: "jwt_token", ... }
```

### Videos (TechTube)

#### Upload Video
```
POST /videos/upload
Headers: Authorization: Bearer {token}
Body: {
  "title": "Video Title",
  "description": "Video description",
  "videoUrl": "s3://bucket/video.mp4",
  "thumbnail": "s3://bucket/thumbnail.jpg"
}
```

#### Get Video
```
GET /videos/{videoId}
```

#### List Videos
```
GET /videos?limit=20&userId=user123
```

#### Update Video
```
PUT /videos/{videoId}
Headers: Authorization: Bearer {token}
Body: { "title": "New Title", ... }
```

#### Delete Video
```
DELETE /videos/{videoId}
Headers: Authorization: Bearer {token}
```

### Jobs (JobIn)

#### Create Job
```
POST /jobs
Headers: Authorization: Bearer {token}
Body: {
  "title": "Senior Developer",
  "company": "Tech Corp",
  "location": "New York",
  "salary": "$100k-150k",
  "jobType": "Full-time",
  "description": "...",
  "requirements": ["React", "Node.js"],
  "benefits": ["Health Insurance", "401k"]
}
```

#### Get Job
```
GET /jobs/{jobId}
```

#### List Jobs
```
GET /jobs?limit=20&search=developer
```

#### Apply for Job
```
POST /jobs/{jobId}/apply
Headers: Authorization: Bearer {token}
Body: {
  "coverLetter": "...",
  "resumeUrl": "s3://bucket/resume.pdf"
}
```

#### Get Job Applications
```
GET /jobs/{jobId}/applications
Headers: Authorization: Bearer {token}
```

### Resumes (JobIn)

#### Upload Resume
```
POST /resumes
Headers: Authorization: Bearer {token}
Body: {
  "title": "My Resume",
  "resumeUrl": "s3://bucket/resume.pdf",
  "summary": "...",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

#### Get User Resumes
```
GET /resumes/{userId}
```

#### Update Resume
```
PUT /resumes/{resumeId}
Headers: Authorization: Bearer {token}
Body: { "title": "...", ... }
```

#### Delete Resume
```
DELETE /resumes/{resumeId}
Headers: Authorization: Bearer {token}
```

### User Profiles

#### Get Profile
```
GET /users/{userId}
```

#### Update Profile
```
PUT /users/{userId}
Headers: Authorization: Bearer {token}
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software Developer",
  "profilePicture": "s3://bucket/profile.jpg",
  "username": "johndoe"
}
```

### Social Features (Instagram-like)

#### Create Post
```
POST /posts
Headers: Authorization: Bearer {token}
Body: {
  "content": "Check this out!",
  "image": "s3://bucket/image.jpg",
  "video": "s3://bucket/video.mp4"
}
```

#### Get Post
```
GET /posts/{postId}
```

#### List User Posts
```
GET /posts/user/{userId}?limit=20
```

#### Update Post
```
PUT /posts/{postId}
Headers: Authorization: Bearer {token}
Body: { "content": "Updated content" }
```

#### Delete Post
```
DELETE /posts/{postId}
Headers: Authorization: Bearer {token}
```

#### Like Post
```
POST /posts/{postId}/like
Headers: Authorization: Bearer {token}
```

#### Unlike Post
```
DELETE /posts/{postId}/like
Headers: Authorization: Bearer {token}
```

#### Add Comment
```
POST /posts/{postId}/comments
Headers: Authorization: Bearer {token}
Body: { "text": "Great post!" }
```

#### Get Comments
```
GET /posts/{postId}/comments?limit=20
```

#### Delete Comment
```
DELETE /comments/{commentId}
Headers: Authorization: Bearer {token}
```

#### Follow User
```
POST /users/{userId}/follow
Headers: Authorization: Bearer {token}
```

#### Unfollow User
```
DELETE /users/{userId}/follow
Headers: Authorization: Bearer {token}
```

## Database Schema

### Tables
- **users_table**: User profiles and authentication
- **videos_table**: Video metadata (title, URL, views, etc.)
- **jobs_table**: Job postings
- **resumes_table**: User resumes
- **posts_table**: Social media posts
- **comments_table**: Post comments
- **likes_table**: Post likes
- **follows_table**: User follow relationships
- **applications_table**: Job applications

## Deployment Commands

```bash
# Deploy to development
npm run deploy:dev

# Deploy to production
npm run deploy:prod

# Local development
npm run dev

# View logs
npm run logs -- functionName

# Remove stack
npm run remove
```

## Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in production
2. **CORS**: Currently allows all origins - restrict in production
3. **S3 Bucketing**: Ensure S3 buckets are properly configured
4. **Rate Limiting**: Consider adding rate limiting in production
5. **Input Validation**: Add additional validation as needed

## Development

### Local Testing
```bash
npm run dev
```
This starts serverless-offline on `http://localhost:3000`

### Running Tests
```bash
npm test
```

## Future Enhancements

- [ ] Pagination improvements
- [ ] Full-text search
- [ ] Image processing (thumbnails, compression)
- [ ] Video transcoding
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Advanced social features (stories, reels)
- [ ] E-commerce product catalog
- [ ] Payment integration

## Support

For issues or questions, please create an issue in the repository.

## License

MIT
