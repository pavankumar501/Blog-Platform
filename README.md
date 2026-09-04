# 📝 Blog Platform (BlogHub)

A Medium-style blogging platform with rich content management.

## ✨ Features

- **User Auth** - Writers & admin roles
- **Rich Blog Posts** - Images, tags, categories
- **Search & Filter** - By category, tag, keyword
- **Comments** - Nested replies
- **Likes & Views** - Analytics tracking
- **Admin Panel** - Manage posts, users, categories
- **Trending Posts** - Sort by views

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

## 🚀 Quick Start

```bash
cd backend && npm install && node seed.js && npm start    # Port 5003
cd frontend && npm install && npm run dev                 # Port 5173
```

## 🔑 Demo Account

- Admin: `admin@bloghub.com` / `admin123`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/posts` | List posts |
| GET | `/api/posts/:slug` | Post detail |
| POST | `/api/posts` | Create post |
| GET | `/api/comments/:postId` | Post comments |
| POST | `/api/comments` | Add comment |

## 👨‍💻 Author

[Pavan Kumar](https://github.com/pavankumar501)