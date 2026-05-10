# Blog Platform - Full Stack Application

A modern full-stack blog application built with Node.js/Express backend and React frontend.

## 🎯 Features

### Backend
- ✅ User Authentication (JWT + httpOnly cookies)
- ✅ Blog CRUD operations with authorization
- ✅ Comment system
- ✅ Fuzzy search for blog titles
- ✅ Pagination support
- ✅ Password hashing with bcrypt
- ✅ Error handling middleware
- ✅ RESTful API design

### Frontend
- ✅ User registration & login
- ✅ Create, read, update, delete blogs
- ✅ View user profiles with their blogs
- ✅ Search blogs by title
- ✅ Responsive UI with Tailwind CSS
- ✅ Protected routes
- ✅ Comment functionality

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Validation:** Custom error classes

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Icons:** React Icons

---

## 📋 Prerequisites

Before running the project, ensure you have:
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

---

## 🚀 Installation & Setup

### 1. Clone or Extract Project

```bash
cd Blog
```

### 2. Backend Setup

```bash
cd api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your PostgreSQL credentials
# Edit .env file with your database connection details
nano .env

# Start the backend server
npm run dev
```

The API will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd ../web

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file in the `api/` directory:

```env
# Database Configuration
POSTGRES_CONNECTION_URI=postgresql://username:password@localhost:5432
DB_NAME=blog_db

# JWT Configuration
ACCESS_TOKEN_SECRET_KEY=your_secret_key_here

# Server
PORT=4000
```

**Generate secure secret keys:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📁 Project Structure

```
Blog/
├── api/                          # Backend
│   ├── src/
│   │   ├── app.js               # Express app setup
│   │   ├── index.js             # Server entry point
│   │   ├── constant.js          # Constants
│   │   ├── controllers/         # Route handlers
│   │   ├── models/              # Sequelize models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── middlewares/         # Express middlewares
│   │   ├── utils/               # Helper utilities
│   │   └── db/                  # Database config
│   ├── package.json
│   └── .env                     # Environment variables
│
└── web/                          # Frontend
    ├── src/
    │   ├── main.jsx             # React entry point
    │   ├── App.jsx              # Main component
    │   ├── Layout.jsx           # App layout
    │   ├── components/          # React components
    │   │   ├── BlogList.jsx     # Blog listing
    │   │   ├── BlogCreate.jsx   # Create/edit blog
    │   │   ├── Header.jsx       # Navigation header
    │   │   ├── Login.jsx        # Login page
    │   │   ├── Register.jsx     # Registration page
    │   │   └── ...
    │   ├── index.css            # Global styles
    │   └── vite.config.js       # Vite configuration
    ├── package.json
    └── index.html
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - Login user
- `POST /api/v1/user/logout` - Logout user (requires auth)

### Blogs (All require authentication)
- `GET /api/v1/blog/me?page=1` - Get user's private blogs
- `GET /api/v1/blog/pagination?page=1` - Get all published blogs
- `GET /api/v1/blog/:username?page=1` - Get user's public blogs
- `GET /api/v1/blog/specific/:id` - Get specific blog
- `POST /api/v1/blog` - Create new blog
- `PATCH /api/v1/blog/:id` - Update blog
- `DELETE /api/v1/blog/:id` - Delete blog

### Comments
- Endpoints documented in API routes

---

## 📝 Common Tasks

### Create a Blog
1. Login to the application
2. Click "Create Blog" in navigation
3. Enter title and content
4. Choose publish status
5. Submit

### Search Blogs
1. On any blog list page, use the search box
2. Enter blog title (supports partial matches)
3. Click "Search"
4. Results will be paginated

### View User Profile
1. Click on any username or profile link
2. See all published blogs from that user
3. Each blog shows creation date and preview

### Edit Your Blog
1. Go to "My Posts"
2. Click edit icon on any blog
3. Make changes
4. Update to save

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 4000 is in use
netstat -ano | findstr :4000

# Make sure PostgreSQL is running
# Verify .env file has correct database credentials
```

### Frontend build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database connection errors
```bash
# Ensure PostgreSQL is running
# Update POSTGRES_CONNECTION_URI in .env
# Check username and password are correct
# Verify database exists or let Sequelize create tables
```

### Axios/API errors
```bash
# Check if backend is running on port 4000
# Verify vite proxy configuration in vite.config.js
# Check browser DevTools Network tab for failed requests
```

---

## 📄 License

ISC

---

## 👤 Author

Satish Kolde

---

## 💡 Tips

- Always keep `.env` file secure and never commit to version control
- Use `npm run dev` for development with hot reload
- Check browser console for frontend errors
- Use API tools like Postman for testing endpoints
- Enable ESLint to catch code issues early

---

**Happy Blogging! 🎉**
