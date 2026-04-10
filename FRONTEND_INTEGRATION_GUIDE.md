# 🔗 COMPLETE FRONTEND INTEGRATION GUIDE

## Your Backend API is Ready!
```
https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev
```

---

## 📁 SETUP OVERVIEW

```
Your Computer:
├─ Frontend Folder (Vue/React/etc)
│  └─ api.js (communication with backend)
│  └─ auth.js (handle JWT tokens)
│  └─ pages/components (use the API)
│
└─ Backend Folder (This folder - Already Deployed)
   └─ https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev
   └─ 31 endpoints ready to use
```

**Connection:** Frontend makes HTTP requests → Backend API → DynamoDB + S3

---

## 🚀 STEP 1: CREATE API CONFIGURATION FILE

### Location: Create in your frontend project
```
your-frontend-folder/
├─ src/
│  ├─ services/
│  │  ├─ api.js          ← CREATE THIS FILE
│  │  ├─ auth.js         ← CREATE THIS FILE
│  │  └─ storage.js      ← CREATE THIS FILE
│  ├─ components/
│  ├─ pages/
│  └─ App.js
└─ package.json
```

### File 1: `src/services/api.js`

**Copy this entire file:**

```javascript
// API Base Configuration
const API_BASE_URL = 'https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev';

/**
 * API Service - Handles all communication with backend
 * 
 * Features:
 * - Automatic token injection
 * - Error handling
 * - Request/response parsing
 * - File uploads
 */

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Get stored JWT token from localStorage
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Set JWT token in localStorage
   */
  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  /**
   * Remove token (logout)
   */
  clearToken() {
    localStorage.removeItem('authToken');
  }

  /**
   * Make API request with automatic token injection
   */
  async request(method, endpoint, data = null, isFormData = false) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    };

    // Add token if available
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Remove Content-Type for FormData (browser sets it automatically)
    if (isFormData) {
      delete headers['Content-Type'];
    }

    const config = {
      method,
      headers,
    };

    // Add body for non-GET requests
    if (method !== 'GET' && data) {
      if (isFormData) {
        config.body = data; // FormData object
      } else {
        config.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(url, config);
      
      // Parse response
      const responseData = await response.json();

      // Handle errors
      if (!response.ok) {
        const error = new Error(responseData.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = responseData;
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // ========== AUTHENTICATION ==========

  async register(username, email, password) {
    const response = await this.request('POST', '/auth/register', {
      username,
      email,
      password,
    });
    
    // Save token
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(email, password) {
    const response = await this.request('POST', '/auth/login', {
      email,
      password,
    });
    
    // Save token
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    this.clearToken();
  }

  // ========== VIDEOS ==========

  async uploadVideo(file, title, description) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    
    return this.request('POST', '/videos/upload', formData, true);
  }

  async getVideo(videoId) {
    return this.request('GET', `/videos/${videoId}`);
  }

  async listVideos(search = '', page = 1, limit = 10) {
    const params = new URLSearchParams({
      search,
      page,
      limit,
    });
    
    return this.request('GET', `/videos?${params.toString()}`);
  }

  async updateVideo(videoId, updates) {
    return this.request('PUT', `/videos/${videoId}`, updates);
  }

  async deleteVideo(videoId) {
    return this.request('DELETE', `/videos/${videoId}`);
  }

  // ========== JOBS ==========

  async createJob(jobData) {
    return this.request('POST', '/jobs', jobData);
  }

  async getJob(jobId) {
    return this.request('GET', `/jobs/${jobId}`);
  }

  async listJobs(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request('GET', `/jobs?${params.toString()}`);
  }

  async updateJob(jobId, updates) {
    return this.request('PUT', `/jobs/${jobId}`, updates);
  }

  async deleteJob(jobId) {
    return this.request('DELETE', `/jobs/${jobId}`);
  }

  async applyForJob(jobId, resumeId, coverLetter) {
    return this.request('POST', `/jobs/${jobId}/apply`, {
      resumeId,
      coverLetter,
    });
  }

  async getJobApplications(jobId) {
    return this.request('GET', `/jobs/${jobId}/applications`);
  }

  // ========== RESUMES ==========

  async uploadResume(file, title) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    
    return this.request('POST', '/resumes', formData, true);
  }

  async listResumes() {
    return this.request('GET', '/resumes/list');
  }

  async updateResume(resumeId, title) {
    return this.request('PUT', `/resumes/${resumeId}`, { title });
  }

  async deleteResume(resumeId) {
    return this.request('DELETE', `/resumes/${resumeId}`);
  }

  // ========== USERS ==========

  async getProfile(userId) {
    return this.request('GET', `/users/${userId}`);
  }

  async updateProfile(userId, profileData) {
    return this.request('PUT', `/users/${userId}`, profileData);
  }

  async updateProfilePicture(userId, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request('POST', `/users/${userId}/picture`, formData, true);
  }

  // ========== SOCIAL POSTS ==========

  async createPost(content, imageUrl = null) {
    return this.request('POST', '/posts/create', {
      content,
      imageUrl,
    });
  }

  async getPost(postId) {
    return this.request('GET', `/posts/${postId}`);
  }

  async listUserPosts(userId, page = 1, limit = 10) {
    const params = new URLSearchParams({ page, limit });
    return this.request('GET', `/posts/user/${userId}?${params.toString()}`);
  }

  async updatePost(postId, content) {
    return this.request('PUT', `/posts/${postId}`, { content });
  }

  async deletePost(postId) {
    return this.request('DELETE', `/posts/${postId}`);
  }

  // ========== LIKES ==========

  async likePost(postId) {
    return this.request('POST', `/posts/${postId}/like`);
  }

  async unlikePost(postId) {
    return this.request('DELETE', `/posts/${postId}/like`);
  }

  // ========== COMMENTS ==========

  async addComment(postId, content) {
    return this.request('POST', `/posts/${postId}/comments`, {
      content,
    });
  }

  async getComments(postId, page = 1, limit = 10) {
    const params = new URLSearchParams({ page, limit });
    return this.request('GET', `/posts/${postId}/comments?${params.toString()}`);
  }

  async deleteComment(commentId) {
    return this.request('DELETE', `/posts/comments/${commentId}`);
  }

  // ========== FOLLOWS ==========

  async followUser(userId) {
    return this.request('POST', `/users/${userId}/follow`);
  }

  async unfollowUser(userId) {
    return this.request('DELETE', `/users/${userId}/follow`);
  }
}

// Create singleton instance
const apiService = new APIService();

export default apiService;
```

---

## 🛡️ STEP 2: CREATE AUTHENTICATION HELPER

### File: `src/services/auth.js`

```javascript
import apiService from './api';

/**
 * Authentication helper functions
 */

export const auth = {
  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Get current user info
   */
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Set current user info
   */
  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  /**
   * Register new user
   */
  async register(username, email, password) {
    try {
      const response = await apiService.register(username, email, password);
      
      // Save user info
      this.setCurrentUser({
        userId: response.user.userId,
        username: response.user.username,
        email: response.user.email,
      });

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await apiService.login(email, password);
      
      // Save user info
      this.setCurrentUser({
        userId: response.user.userId,
        username: response.user.username,
        email: response.user.email,
      });

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    apiService.logout();
  },

  /**
   * Get auth token
   */
  getToken() {
    return localStorage.getItem('authToken');
  },
};

export default auth;
```

---

## 💾 STEP 3: ENVIRONMENT VARIABLES

### File: `.env` (in your frontend root)

```
REACT_APP_API_BASE_URL=https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev
REACT_APP_ENV=development
```

### OR Update `api.js` to use env vars:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  'https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev';
```

---

## 📱 STEP 4: USE IN COMPONENTS (React Example)

### Example: Login Page

```jsx
import { useState } from 'react';
import apiService from '../services/api';
import { auth } from '../services/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await auth.login(email, password);
      
      // Success! User is logged in
      console.log('Login successful:', response.user);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      {error && <div className="error">{error}</div>}
      
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example: Create Post Page

```jsx
import { useState } from 'react';
import apiService from '../services/api';
import { auth } from '../services/auth';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.isLoggedIn()) {
      alert('Please login first');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.createPost(content);
      
      console.log('Post created:', response);
      setContent(''); // Clear form
      
      // Refresh posts list
      // ... reload posts
    } catch (error) {
      alert('Error creating post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        required
      />
      <button disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}
```

### Example: Upload Video

```jsx
import { useState } from 'react';
import apiService from '../services/api';

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Select a video file');
      return;
    }

    setUploading(true);

    try {
      const response = await apiService.uploadVideo(file, title, description);
      
      console.log('Video uploaded:', response);
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      
      alert('Video uploaded successfully!');
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Video title"
        required
      />
      
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      
      <button disabled={uploading}>
        {uploading ? `Uploading (${progress}%)...` : 'Upload Video'}
      </button>
    </form>
  );
}
```

---

## 🔄 STEP 5: PROTECTED ROUTES (React Router)

### File: `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { auth } from '../services/auth';

export default function ProtectedRoute({ children }) {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### Use in App.js:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import UploadVideo from './pages/UploadVideo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/create-post" 
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/upload-video" 
          element={
            <ProtectedRoute>
              <UploadVideo />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🎯 STEP 6: HANDLING IMAGES & FILES

### Display Image from S3

```jsx
// Videos from S3
<video>
  <source src={videoUrl} type="video/mp4" />
</video>

// Images from S3
<img src={imageUrl} alt="Post" />

// Download Resume
<a href={resumeUrl} download>
  Download Resume
</a>
```

The URLs come automatically from your API responses!

---

## ⚠️ ERROR HANDLING

### Handle API Errors

```javascript
import apiService from '../services/api';

async function example() {
  try {
    const result = await apiService.createPost('Hello');
  } catch (error) {
    // Different error types
    if (error.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
    } else if (error.status === 404) {
      // Not found
      console.error('Resource not found');
    } else if (error.status === 500) {
      // Server error
      console.error('Server error - try again later');
    } else {
      // Other error
      console.error(error.message);
    }
  }
}
```

---

## 🔐 CORS & SECURITY

### CORS is Already Enabled on Backend! ✅

Your backend has CORS configured, so these requests will work:

```javascript
// These all work from any frontend origin:
fetch('https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... })
});
```

### No CORS Errors Needed!

---

## 📋 STEP-BY-STEP SETUP CHECKLIST

- [ ] **Step 1:** Create `src/services/api.js` in your frontend folder
- [ ] **Step 2:** Create `src/services/auth.js` in your frontend folder
- [ ] **Step 3:** Create `.env` file with API URL
- [ ] **Step 4:** Update your login page to use `auth.login()`
- [ ] **Step 5:** Create protected routes wrapper
- [ ] **Step 6:** Update other components to use apiService
- [ ] **Test:** Try logging in
- [ ] **Test:** Try creating a post
- [ ] **Test:** Try uploading a video
- [ ] **Test:** Check data in AWS Console

---

## 🧪 COMPLETE EXAMPLE: Vue.js

### For Vue.js, here's how to use the same API:

```vue
<template>
  <div>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import apiService from '@/services/api';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';

      try {
        const response = await apiService.login(this.email, this.password);
        
        // Navigate to dashboard
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err.message || 'Login failed';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

---

## 🔗 COMPLETE DATA FLOW

```
Frontend Action:
1. User clicks "Login"
2. Frontend calls: auth.login(email, password)
3. auth.js calls: apiService.login()
4. apiService.js makes HTTP request to backend
5. Request includes token in Authorization header
6. Backend Lambda function receives request
7. Backend queries DynamoDB
8. Backend returns response
9. Frontend stores token
10. Frontend redirects to dashboard

Result: User is logged in ✓
```

---

## 📊 ALL API ENDPOINTS & USAGE

| Action | Frontend Code |
|--------|---------------|
| **Register** | `await apiService.register(username, email, password)` |
| **Login** | `await apiService.login(email, password)` |
| **Create Post** | `await apiService.createPost(content, imageUrl)` |
| **Get Post** | `await apiService.getPost(postId)` |
| **Like Post** | `await apiService.likePost(postId)` |
| **Comment** | `await apiService.addComment(postId, content)` |
| **Upload Video** | `await apiService.uploadVideo(file, title, desc)` |
| **List Videos** | `await apiService.listVideos(search, page, limit)` |
| **Create Job** | `await apiService.createJob(jobData)` |
| **List Jobs** | `await apiService.listJobs(filters)` |
| **Apply Job** | `await apiService.applyForJob(jobId, resumeId, cover)` |
| **Upload Resume** | `await apiService.uploadResume(file, title)` |
| **Follow User** | `await apiService.followUser(userId)` |
| **Get Profile** | `await apiService.getProfile(userId)` |
| **Update Profile** | `await apiService.updateProfile(userId, data)` |

---

## 🚀 TESTING CONNECTION

### Test 1: Register & Login

```javascript
// In browser console
import apiService from './services/api';

// Register
const reg = await apiService.register('testuser', 'test@example.com', 'password123');
console.log(reg); // Should show token and user

// Token should be in localStorage
console.log(localStorage.getItem('authToken'));
```

### Test 2: Create Post

```javascript
// Token automatically included
const post = await apiService.createPost('Hello world');
console.log(post); // Should show post created
```

### Test 3: Verify in AWS

```
Go to AWS Console → DynamoDB → PostsTable
You should see your post data! ✓
```

---

## 🎬 COMMON INTEGRATION PATTERNS

### Pattern 1: Login & Redirect

```javascript
const handleLogin = async (email, password) => {
  try {
    await auth.login(email, password);
    navigate('/dashboard'); // Redirect
  } catch (error) {
    setError(error.message);
  }
};
```

### Pattern 2: Load Data on Mount

```javascript
useEffect(() => {
  const loadPosts = async () => {
    const user = auth.getCurrentUser();
    const posts = await apiService.listUserPosts(user.userId);
    setPosts(posts);
  };
  
  loadPosts();
}, []);
```

### Pattern 3: Handle File Upload

```javascript
const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

const handleUpload = async () => {
  const result = await apiService.uploadVideo(file, title, description);
  console.log('Uploaded:', result);
};
```

### Pattern 4: Error Handling

```javascript
try {
  await apiService.someCall();
} catch (error) {
  if (error.status === 401) {
    // Token expired, redirect to login
    auth.logout();
    navigate('/login');
  } else {
    // Show error to user
    toast.error(error.message);
  }
}
```

---

## ✅ FINAL CHECKLIST

- [ ] Backend deployed and working
- [ ] API URL: https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev
- [ ] Frontend folder created with src/services/
- [ ] api.js written and imported
- [ ] auth.js written and imported
- [ ] .env configured
- [ ] Components updated to use apiService
- [ ] Login page working
- [ ] Protected routes implemented
- [ ] Can create posts
- [ ] Can upload videos
- [ ] Can apply for jobs
- [ ] Data appears in AWS Console

---

## 🎉 YOU'RE READY!

Your frontend can now communicate with your backend!

**Next: Start adding features to your frontend using the apiService methods.** 🚀

---

## 📞 QUICK DEBUG TIPS

### "API not responding"
```javascript
// Check if token exists
console.log(localStorage.getItem('authToken'));

// Test API directly
fetch('https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev/videos').then(r => r.json()).then(d => console.log(d))
```

### "401 Unauthorized"
```javascript
// Token missing or expired
// Solution: Login again
auth.logout();
// Redirect to login page
```

### "CORS Error"
```
// Should NOT happen - CORS is enabled on backend
// If you see CORS error, check:
// 1. API URL is correct
// 2. Method (GET/POST) is correct
// 3. Headers are correct
```

### "Network Error"
```
// Check if:
// 1. Internet connection working
// 2. API URL is correct (no typos)
// 3. Backend is deployed (check AWS Console)
```

---

**Your complete frontend integration guide is ready!** 🎊

Start with Step 1 and follow through. You'll have a fully functional frontend connected to your backend! 🚀
