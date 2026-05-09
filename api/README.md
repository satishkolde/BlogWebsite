# Blog API - Backend

RESTful API for the Blog Platform built with Express.js and PostgreSQL.

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Start development server
npm run dev
```

Server runs on `http://localhost:4000`

---

## 📦 Dependencies

- **express** - Web framework
- **sequelize** - ORM for PostgreSQL
- **postgresql** - Database driver
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **cookie-parser** - Cookie middleware
- **nodemon** - Auto-reload during development

---

## 🗂️ Project Structure

```
src/
├── app.js                    # Express app setup
├── index.js                  # Server entry point
├── constant.js              # Application constants
├── controllers/             # Request handlers
│   ├── blog.controller.js
│   ├── comment.controller.js
│   └── user.controller.js
├── models/                  # Sequelize models
│   ├── blog.model.js
│   ├── comment.model.js
│   └── user.model.js
├── routes/                  # API routes
│   ├── blog.route.js
│   ├── comment.route.js
│   └── user.route.js
├── services/                # Business logic
│   ├── blog.service.js
│   ├── comment.service.js
│   └── user.service.js
├── middlewares/             # Express middlewares
│   ├── auth.middleware.js
│   └── errorHandler.middleware.js
├── utils/                   # Helper utilities
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── AsyncHandler.js
└── db/
    └── index.js            # Database connection
```

---

## 🔐 Environment Variables

Create `.env` file in root:

```env
# Database
POSTGRES_CONNECTION_URI=postgresql://user:password@localhost:5432
DB_NAME=blog_db

# JWT
ACCESS_TOKEN_SECRET_KEY=your_secret_key
REFRESH_TOKEN_SECRET_KEY=your_refresh_token

# Server
PORT=4000
NODE_ENV=development
```

---

## 🔌 API Endpoints

### Authentication

#### Register User
```
POST /api/v1/user/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}

Response: 201 Created
{
  "statusCode": 201,
  "message": "Created User successfully",
  "data": {
    "id": "uuid",
    "username": "john_doe"
  }
}
```

#### Login User
```
POST /api/v1/user/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}

Response: 200 OK
{
  "statusCode": 200,
  "message": "User login Successfully",
  "data": {
    "id": "uuid",
    "username": "john_doe"
  }
}
```

#### Logout User
```
POST /api/v1/user/logout
Authorization: Bearer <token>

Response: 200 OK
```

---

### Blogs (All require authentication)

#### Get User's Private Blogs
```
GET /api/v1/blog/me?page=1&title=search_term
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "message": "Got All the blogs",
  "data": {
    "blogs": [...],
    "count": 3
  }
}
```

#### Get All Published Blogs (Paginated)
```
GET /api/v1/blog/pagination?page=1&title=search_term
Authorization: Bearer <token>

Response: 200 OK
```

#### Get User's Public Blogs
```
GET /api/v1/blog/:username?page=1&title=search_term
Authorization: Bearer <token>

Response: 200 OK
```

#### Get Specific Blog
```
GET /api/v1/blog/specific/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "statusCode": 200,
  "message": "Got the Specific blog",
  "data": {
    "id": "uuid",
    "title": "Blog Title",
    "body": "Blog content...",
    "author": "john_doe",
    "is_published": true,
    "createdAt": "2024-05-09T10:30:00Z",
    "updatedAt": "2024-05-09T10:30:00Z"
  }
}
```

#### Create Blog
```
POST /api/v1/blog
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog",
  "body": "This is the blog content...",
  "is_published": true
}

Response: 201 Created
```

#### Update Blog
```
PATCH /api/v1/blog/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "body": "Updated content...",
  "is_published": true
}

Response: 200 OK
```

#### Delete Blog
```
DELETE /api/v1/blog/:id
Authorization: Bearer <token>

Response: 204 No Content
```

---

## 🏗️ Architecture

### Service Layer Pattern
Business logic is separated from controllers:

```
Route → Controller → Service → Model → Database
```

**Example:**
```javascript
// Controller
export const createBlogController = asyncHandler(async (req, res) => {
    const blog = await BlogService.createBlog(...);
    res.status(201).send(new ApiResponse(201, "Created", {blog}));
});

// Service
static async createBlog(author, title, body, is_published) {
    // Validation & business logic
    // Database operations
}
```

### Error Handling
All errors are caught by AsyncHandler and passed to ErrorHandler middleware:

```javascript
throw new ApiError(400, "Validation failed", []);
```

### Authentication Flow
1. User logs in → JWT token generated
2. Token stored in httpOnly cookie
3. Each request includes token in Authorization header or cookies
4. Middleware verifies token and adds user to request

---

## 📝 Code Examples

### Creating a Blog
```javascript
const blogData = {
  title: "My Blog",
  body: "Content here",
  is_published: true
};

try {
  const response = await axios.post('/api/v1/blog', blogData);
  console.log('Blog created:', response.data.data.blog);
} catch (error) {
  console.error('Error:', error.response.data);
}
```

### Searching Blogs
```javascript
const searchBlogs = async (title, page = 1) => {
  try {
    const response = await axios.get(
      `/api/v1/blog/pagination?page=${page}&title=${title}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

---

## 🧪 Testing the API

Using Postman or cURL:

```bash
# Register
curl -X POST http://localhost:4000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pass123"}'

# Login
curl -X POST http://localhost:4000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pass123"}'

# Get blogs (use token from login)
curl -X GET http://localhost:4000/api/v1/blog/pagination?page=1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔍 Database

### Connection
- **Type:** PostgreSQL
- **ORM:** Sequelize
- **Tables:** Users, Blogs, Comments

### Migrations
Tables are auto-created via Sequelize sync on app start:
```javascript
await sequelizeInstance.sync();
```

---

## 🚀 Deployment

### Environment Setup
```bash
# Production
NODE_ENV=production

# Secure secret keys
ACCESS_TOKEN_SECRET_KEY=<generate_long_random_key>

# Database
POSTGRES_CONNECTION_URI=postgresql://prod_user:prod_pass@prod_host:5432
```

### Running in Production
```bash
npm run dev  # Or use PM2, systemd, etc.
```

---

## 📊 Code Quality

- ✅ Service layer abstraction
- ✅ Consistent error handling
- ✅ RESTful API design
- ⏳ Add: Unit tests, JSDoc comments, input validation

---

## 🐛 Common Issues

### Database Connection Failed
- Check PostgreSQL is running
- Verify credentials in .env
- Ensure database exists

### Token Errors
- Verify JWT secrets are set
- Check token expiration
- Ensure Authorization header format: `Bearer <token>`

### CORS Errors
- Check origin is allowed in cors()
- Verify credentials setting

---

## 📚 Resources

- [Express Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [REST API Design](https://restfulapi.net/)

---

**Ready to deploy!** 🚀
