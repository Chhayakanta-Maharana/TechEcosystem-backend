# 📁 FRONTEND PROJECT STRUCTURE SETUP

## Where Your Frontend Goes

```
Your Computer:
└─ Projects/
   ├─ Chhaya-Notes-api-master/        ← YOUR BACKEND (Deployed)
   │  ├─ handlers/
   │  ├─ serverless.yml
   │  ├─ package.json
   │  └─ FRONTEND_INTEGRATION_GUIDE.md (this folder)
   │
   └─ Chhaya-Notes-frontend/           ← YOUR FRONTEND (Separate folder)
      ├─ src/
      │  ├─ services/                  ← API communication
      │  │  ├─ api.js                  (copy from guide)
      │  │  ├─ auth.js                 (handles tokens)
      │  │  └─ storage.js              (localStorage helpers)
      │  ├─ pages/                     ← Your page components
      │  │  ├─ LoginPage.jsx
      │  │  ├─ RegisterPage.jsx
      │  │  ├─ DashboardPage.jsx
      │  │  ├─ CreatePostPage.jsx
      │  │  ├─ VideoPage.jsx
      │  │  └─ JobsPage.jsx
      │  ├─ components/                ← Reusable components
      │  │  ├─ Header.jsx
      │  │  ├─ PostCard.jsx
      │  │  ├─ VideoCard.jsx
      │  │  ├─ JobCard.jsx
      │  │  └─ ProtectedRoute.jsx
      │  ├─ App.jsx
      │  ├─ App.css
      │  └─ index.jsx
      ├─ public/
      │  └─ index.html
      ├─ package.json
      ├─ .env
      └─ .gitignore
```

---

## 🎯 STEP 1: CREATE FRONTEND PROJECT

### Option A: React Project

```bash
# Navigate to where you want the frontend
cd Projects/

# Create React app
npx create-react-app Chhaya-Notes-frontend

# Navigate into it
cd Chhaya-Notes-frontend

# Start development server
npm start
```

### Option B: Vue Project

```bash
# Create Vue app
npm init vue@latest Chhaya-Notes-frontend

# Navigate into it
cd Chhaya-Notes-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Option C: Vite (Faster React)

```bash
# Create Vite project
npm create vite@latest Chhaya-Notes-frontend -- --template react

# Navigate into it
cd Chhaya-Notes-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📂 STEP 2: CREATE SERVICES FOLDER

```bash
# In your frontend root directory

mkdir -p src/services

# This creates:
# src/
# └─ services/
```

---

## 🔗 STEP 3: CREATE API SERVICE

### Create file: `src/services/api.js`

Copy the complete code from **FRONTEND_INTEGRATION_GUIDE.md** or **QUICK_FRONTEND_SETUP.md**

---

## 🛡️ STEP 4: CREATE AUTH SERVICE

### Create file: `src/services/auth.js`

```javascript
import api from './api';

export const auth = {
  async register(username, email, password) {
    const response = await api.register(username, email, password);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }
    return response;
  },

  async login(email, password) {
    const response = await api.login(email, password);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }
    return response;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  isLoggedIn() {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('authToken');
  },
};

export default auth;
```

---

## 📄 STEP 5: CREATE .ENV FILE

### Create file: `.env` (in frontend root)

```
REACT_APP_API_BASE_URL=https://177vuj5ju5.execute-api.us-east-1.amazonaws.com/dev
REACT_APP_ENV=development
```

---

## 🎨 STEP 6: CREATE PROTECTED ROUTE

### Create file: `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { auth } from '../services/auth';

export default function ProtectedRoute({ children }) {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return children;
}
```

---

## 📝 STEP 7: UPDATE APP.JSX

### Create file: `src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreatePostPage from './pages/CreatePostPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/create-post" 
          element={
            <ProtectedRoute>
              <CreatePostPage />
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

## 🔐 STEP 8: CREATE LOGIN PAGE

### Create file: `src/pages/LoginPage.jsx`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await auth.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login to TechEcosystem</h1>
      
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

      <p>
        Don't have account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}
```

---

## 📝 STEP 9: CREATE REGISTER PAGE

### Create file: `src/pages/RegisterPage.jsx`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await auth.register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Register to TechEcosystem</h1>
      
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}
```

---

## 📺 STEP 10: CREATE POST PAGE

### Create file: `src/pages/CreatePostPage.jsx`

```jsx
import { useState } from 'react';
import api from '../services/api';

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createPost(content);
      setSuccess('Post created successfully!');
      setContent('');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create Post</h1>
      
      <form onSubmit={handleCreatePost}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="5"
          required
        />
        
        {success && <div className="success">{success}</div>}
        
        <button disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}
```

---

## 📋 STEP 11: INSTALL DEPENDENCIES

```bash
# In frontend root directory

# For React with Router
npm install react-router-dom

# For state management (optional)
npm install zustand
# OR
npm install redux react-redux

# For HTTP requests (optional - we use fetch)
npm install axios
```

---

## ✅ COMPLETE SETUP CHECKLIST

- [ ] Create frontend folder: `Chhaya-Notes-frontend/`
- [ ] Run `npm install` to install dependencies
- [ ] Create `src/services/` folder
- [ ] Copy `api.js` to `src/services/`
- [ ] Create `auth.js` in `src/services/`
- [ ] Create `.env` file with API URL
- [ ] Create `src/components/ProtectedRoute.jsx`
- [ ] Create pages: LoginPage, RegisterPage, DashboardPage
- [ ] Update `App.jsx` with routes
- [ ] Install `react-router-dom`: `npm install react-router-dom`
- [ ] Test login: `npm start`
- [ ] Try creating a post
- [ ] Check data in AWS Console

---

## 🚀 RUN YOUR FRONTEND

```bash
# Navigate to frontend folder
cd Chhaya-Notes-frontend

# Start development server
npm start

# Open browser
# http://localhost:3000
```

---

## 🔗 CONNECTION TEST

1. **Open browser:** http://localhost:3000
2. **Go to login/register page**
3. **Register new account** (email should go to database)
4. **Login** (should succeed and show token)
5. **Create a post**
6. **Check AWS Console:** DynamoDB → PostsTable
7. **See your post data!** ✓

---

## 📊 FOLDER STRUCTURE AT END

```
Chhaya-Notes-frontend/
├─ src/
│  ├─ services/
│  │  ├─ api.js
│  │  ├─ auth.js
│  │  └─ storage.js
│  ├─ components/
│  │  ├─ ProtectedRoute.jsx
│  │  ├─ Header.jsx
│  │  └─ ...
│  ├─ pages/
│  │  ├─ LoginPage.jsx
│  │  ├─ RegisterPage.jsx
│  │  ├─ DashboardPage.jsx
│  │  ├─ CreatePostPage.jsx
│  │  └─ ...
│  ├─ App.jsx
│  ├─ App.css
│  └─ index.jsx
├─ public/
│  └─ index.html
├─ .env
├─ package.json
└─ README.md
```

---

## 🎊 YOU'RE READY!

Your frontend is set up and connected to your backend!

**Next:** Deploy your frontend to a hosting service (Vercel, Netlify, AWS, etc.)

---

## 🆘 QUICK HELP

### "npm install fails"
```bash
npm install --legacy-peer-deps
```

### "Cannot find module './services/api'"
Check that `api.js` is in `src/services/api.js`

### "Port 3000 already in use"
```bash
npm start -- --port 3001
```

### "API returns 401"
Make sure to login first to get token

### "Blank page"
Open browser console (F12) and check for errors

---

**Your frontend is ready to connect with your backend!** 🚀
