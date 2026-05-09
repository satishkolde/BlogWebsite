# Blog Platform - Complete Setup Guide

Complete step-by-step guide to get the Blog Platform running on your local machine.

---

## ⚙️ System Requirements

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v12 or higher ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for version control)

### Verify Installation

```bash
# Check Node.js
node --version
npm --version

# Check PostgreSQL
psql --version
```

---

## 🗄️ Step 1: Set Up PostgreSQL Database

### Windows

1. **Install PostgreSQL**
   - Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Run installer and follow wizard
   - Remember the password you set for `postgres` user
   - Default port: `5432`

2. **Create Database**
   ```bash
   # Open PostgreSQL prompt
   psql -U postgres
   
   # Create database
   CREATE DATABASE blog_db;
   
   # List databases
   \l
   
   # Exit
   \q
   ```

### macOS

```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb blog_db

# Verify
psql blog_db
\q
```

### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb blog_db

# Verify
sudo -u postgres psql blog_db
\q
```

---

## 📁 Step 2: Extract/Clone Project

```bash
# Navigate to your projects folder
cd ~/Projects

# Extract or clone the Blog project
# If you have it as a ZIP file:
unzip Blog.zip

# Or if cloning from Git:
git clone <repository-url>

# Enter project directory
cd Blog
```

---

## 🔧 Step 3: Configure Backend (.env)

1. **Create .env file in api folder**
   ```bash
   cd api
   cp .env.example .env
   ```

2. **Edit .env file**
   
   **Windows (using Notepad):**
   ```bash
   notepad .env
   ```
   
   **macOS/Linux (using nano):**
   ```bash
   nano .env
   ```

3. **Update the following values:**
   ```env
   # Database Configuration
   # Format: postgresql://username:password@host:port
   POSTGRES_CONNECTION_URI=postgresql://postgres:your_password@localhost:5432
   DB_NAME=blog_db
   
   # JWT Secret Keys (generate random strings)
   ACCESS_TOKEN_SECRET_KEY=your_random_secret_key_here_min_32_chars
   REFRESH_TOKEN_SECRET_KEY=your_random_refresh_key_here_min_32_chars
   
   # Server Configuration
   PORT=4000
   NODE_ENV=development
   ```

4. **Generate Secure Keys** (optional but recommended)
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   
   Run this command twice and paste the outputs as your SECRET_KEYs.

---

## 📦 Step 4: Install Backend Dependencies

```bash
# Make sure you're in the api folder
cd api

# Install all dependencies
npm install

# Verify installation
npm list
```

This installs:
- Express.js
- PostgreSQL driver
- Sequelize ORM
- JWT & bcrypt
- And other dependencies

---

## 🚀 Step 5: Start Backend Server

```bash
# Make sure you're in the api folder
cd api

# Start development server with auto-reload
npm run dev
```

**Expected output:**
```
Server is running at port 4000
Database connected successfully
```

✅ **Backend is now running at:** `http://localhost:4000`

---

## 💻 Step 6: Install Frontend Dependencies

```bash
# Navigate to web folder
cd ../web

# Install dependencies
npm install

# Verify installation
npm list
```

---

## 🎨 Step 7: Start Frontend Server

```bash
# Make sure you're in the web folder
cd web

# Start Vite development server
npm run dev
```

**Expected output:**
```
VITE v8.0.10  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ **Frontend is now running at:** `http://localhost:5173`

---

## ✅ Step 8: Test the Application

1. **Open Browser**
   - Navigate to `http://localhost:5173`

2. **Register New Account**
   - Click "Register"
   - Enter username and password
   - Click "Register"
   - You should be logged in automatically

3. **Create a Blog**
   - Click "Create Blog" in navigation
   - Enter title and content
   - Select publish status
   - Click "Create Blog"

4. **View Blogs**
   - Go to home page to see all published blogs
   - Click "My Posts" to see your private blogs
   - Use search to find blogs by title

---

## 🖥️ Development Workflow

### Terminal Setup (Recommended)

Keep **two terminals** open:

**Terminal 1 - Backend:**
```bash
cd Blog/api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Blog/web
npm run dev
```

### Making Changes

- **Backend changes** → Auto-reload via nodemon
- **Frontend changes** → Auto-reload via Vite
- No need to restart servers

### Viewing Changes

- **Backend API:** Check Network tab in DevTools
- **Frontend UI:** Automatic refresh in browser

---

## 🔍 Verification Checklist

- [ ] PostgreSQL database created (`blog_db`)
- [ ] Backend `.env` file created with credentials
- [ ] `npm install` completed in both `api` and `web`
- [ ] Backend server running on port 4000
- [ ] Frontend server running on port 5173
- [ ] Can register new user
- [ ] Can create blog post
- [ ] Can view blogs on home page

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`
- Solution: PostgreSQL not running
  ```bash
  # Windows: Start PostgreSQL
  # macOS: brew services start postgresql@15
  # Linux: sudo systemctl start postgresql
  ```

**Error:** `error: password authentication failed for user "postgres"`
- Solution: Wrong password in .env
  - Reset PostgreSQL password or update .env

**Error:** `Port 4000 already in use`
- Solution: Another app using port 4000
  ```bash
  # Find process using port
  lsof -i :4000  # macOS/Linux
  netstat -ano | findstr :4000  # Windows
  
  # Kill process or use different port
  ```

### Frontend won't start

**Error:** `Port 5173 already in use`
- Solution: Kill process or use different port
  ```bash
  # Update vite.config.js
  server: {
    port: 5174  // Use different port
  }
  ```

**Error:** `Cannot find module 'react'`
- Solution: npm install not completed
  ```bash
  cd web
  rm -rf node_modules package-lock.json
  npm install
  ```

### API connection errors

**Error:** `Failed to fetch from /api/...`
- Solution: Backend not running or proxy misconfigured
  - Verify backend running on port 4000
  - Check vite.config.js proxy settings

**Error:** `401 Unauthorized`
- Solution: Not logged in or token expired
  - Try logging in again
  - Check browser cookies

### Database errors

**Error:** `relation "blogs" does not exist`
- Solution: Tables not created
  - Restart backend server (triggers Sequelize sync)
  - Or manually create tables via psql

---

## 📚 Additional Resources

### Documentation
- [README.md](./README.md) - Project overview
- [api/README.md](./api/README.md) - Backend documentation
- [web/README.md](./web/README.md) - Frontend documentation

### Online Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Sequelize Documentation](https://sequelize.org/)

---

## 🚀 Next Steps

After setup is complete:

1. **Explore the Code**
   - Read through controllers and services
   - Understand the architecture

2. **Try Features**
   - Create multiple blogs
   - Search for blogs
   - Edit and delete blogs
   - View other users' profiles

3. **Make Modifications**
   - Add new features
   - Change styling
   - Modify validation rules

4. **Deploy** (Later)
   - Follow deployment guide
   - Set up production database
   - Configure environment variables

---

## 💡 Tips

- Keep browser DevTools open (F12) to see errors
- Check server console for backend errors
- Use Postman to test API endpoints directly
- Read error messages carefully - they're usually helpful
- Restart servers if changes don't appear immediately

---

## ✨ You're All Set!

Congratulations! The Blog Platform is now running on your local machine. 🎉

Start creating blogs and enjoy the application!

**Need Help?**
- Check the troubleshooting section above
- Review README files in each folder
- Check browser console for errors
- Check server logs in terminal

**Happy Blogging!** 📝
