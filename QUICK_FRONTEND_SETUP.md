# ⚡ QUICK FRONTEND INTEGRATION - 5 MINUTE SETUP

## Your Backend API URL
```
https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev
```

---

## 🚀 FASTEST WAY TO CONNECT (Copy & Paste)

### Step 1: Copy This File to Your Frontend

**Location:** `src/services/api.js`

```javascript
const API_URL = 'https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev';

class API {
  async request(method, path, data = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (data) options.body = JSON.stringify(data);

    const res = await fetch(API_URL + path, options);
    return res.json();
  }

  // Auth
  register(username, email, password) {
    return this.request('POST', '/auth/register', { username, email, password });
  }
  login(email, password) {
    return this.request('POST', '/auth/login', { email, password });
  }

  // Posts
  createPost(content) {
    return this.request('POST', '/posts/create', { content });
  }
  getPost(postId) {
    return this.request('GET', `/posts/${postId}`);
  }
  listUserPosts(userId) {
    return this.request('GET', `/posts/user/${userId}`);
  }
  likePost(postId) {
    return this.request('POST', `/posts/${postId}/like`);
  }

  // Videos
  listVideos() {
    return this.request('GET', '/videos');
  }

  // Jobs
  listJobs() {
    return this.request('GET', '/jobs');
  }

  // Users
  getProfile(userId) {
    return this.request('GET', `/users/${userId}`);
  }
}

export default new API();
```

---

### Step 2: Use in Your Components

#### React Example:
```jsx
import API from './services/api';

export default function Login() {
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await API.login(email, password);
    localStorage.setItem('token', result.token);
    // Redirect to dashboard
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

#### Vue Example:
```vue
<script>
import API from '@/services/api';

export default {
  methods: {
    async login() {
      const result = await API.login(this.email, this.password);
      localStorage.setItem('token', result.token);
      this.$router.push('/dashboard');
    }
  }
}
</script>
```

---

### Step 3: Test It Works

**Open browser console and paste:**

```javascript
import API from './services/api';

// Test register
const user = await API.register('test', 'test@test.com', 'pass');
console.log(user);

// Should see: { token: "...", user: { userId, username, email } }
```

---

## 📋 ALL METHODS YOU CAN USE

```javascript
// Authentication
API.register(username, email, password)
API.login(email, password)

// Posts
API.createPost(content)
API.getPost(postId)
API.listUserPosts(userId)
API.likePost(postId)
API.addComment(postId, content)

// Videos
API.listVideos()
API.getVideo(videoId)

// Jobs
API.listJobs()
API.getJob(jobId)
API.applyForJob(jobId, resumeId, coverLetter)

// Users
API.getProfile(userId)
API.updateProfile(userId, data)

// Resumes
API.uploadResume(file, title)
API.listResumes()
```

---

## 🔐 TOKEN HANDLING

```javascript
// After login, save token
const result = await API.login(email, password);
localStorage.setItem('token', result.token);

// Token automatically sent to backend in all requests!
// (api.js handles this)

// To logout
localStorage.removeItem('token');
```

---

## ✅ THAT'S IT!

Your frontend is now connected to your backend! 🎉

**Test with:** Try logging in and creating a post
**Check backend:** Go to AWS Console → DynamoDB → See your data

---

## 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| API returns error | Check token exists in localStorage |
| 401 Unauthorized | Login first to get token |
| CORS error | Should not happen - already enabled |
| Data not saving | Check AWS Console DynamoDB tables |
| File upload fails | Make sure using FormData |

---

**Now connect your frontend and start building!** 🚀
