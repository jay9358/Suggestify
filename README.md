# Suggestify - Employee Suggestion Platform

A full-stack MERN application for managing employee suggestions with role-based access control, upvoting, status management, and comprehensive filtering.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with HTTP-only cookies
  - Role-based access control (Employee, Manager, Admin)
  - Secure password hashing with bcrypt

- **Suggestion Management**
  - Create, read, update, and delete suggestions
  - Rich text descriptions with tags and attachments
  - Status workflow: New → Under Review → Approved → Implemented

- **Upvoting System**
  - One upvote per user per suggestion
  - Toggle upvote functionality
  - Optimistic UI updates
  - Atomic database operations

- **Filtering & Sorting**
  - Filter by status and tags
  - Search by title and description
  - Sort by newest or top upvoted
  - Server-side pagination

- **Dashboard & Analytics**
  - Status count statistics
  - Top suggestions by upvotes
  - Manager dashboard for status management
  - Admin panel for user management

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TQM
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb://localhost:27017/suggestify
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services panel
```

### Start Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### Start Frontend Development Server

In a new terminal:

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🌱 Seed Database

To populate the database with sample data:

```bash
cd server
npm run seed
```

This creates:
- **Admin**: admin@suggestify.com / password123
- **Manager**: manager@suggestify.com / password123
- **Employee**: alice@suggestify.com / password123
- 12 sample suggestions with various statuses and upvotes

## 🧪 Running Tests

### Backend Tests

```bash
cd server
npm test
```

Tests cover:
- Authentication (register, login)
- Suggestion CRUD operations
- Upvote toggle functionality
- Status update authorization

### Frontend Tests

```bash
cd client
npm test
```

Tests cover:
- Component rendering
- Upvote button interactions

## 📁 Project Structure

```
TQM/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── suggestionController.js
│   │   │   ├── upvoteController.js
│   │   │   └── statsController.js
│   │   ├── middlewares/
│   │   │   ├── auth.js
│   │   │   ├── roles.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Suggestion.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── suggestionRoutes.js
│   │   │   └── statsRoutes.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   └── server.js
│   ├── __tests__/
│   ├── seed.js
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── suggestions.js
│   │   ├── components/
│   │   │   ├── TopBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SuggestionCard.jsx
│   │   │   ├── SuggestionList.jsx
│   │   │   ├── SuggestionForm.jsx
│   │   │   ├── UpvoteButton.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SuggestionNew.jsx
│   │   │   ├── SuggestionDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── ManagerDashboard.jsx
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   └── suggestionStore.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Suggestions

- `GET /api/suggestions` - Get all suggestions (with query params: page, limit, status, tag, search, sort)
- `GET /api/suggestions/:id` - Get single suggestion
- `POST /api/suggestions` - Create suggestion (auth required)
- `PATCH /api/suggestions/:id` - Update suggestion (owner or admin)
- `DELETE /api/suggestions/:id` - Delete suggestion (owner or admin)
- `POST /api/suggestions/:id/upvote` - Toggle upvote (auth required)
- `PATCH /api/suggestions/:id/status` - Update status (manager+ only)

### Users (Admin Only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user role

### Statistics

- `GET /api/stats/top` - Get top suggestions by upvotes
- `GET /api/stats/status-counts` - Get status count statistics

## 📝 Example API Usage

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Suggestion

```bash
curl -X POST http://localhost:5000/api/suggestions \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "New Feature Idea",
    "description": "This is a detailed description",
    "tags": ["feature", "improvement"]
  }'
```

### Upvote Suggestion

```bash
curl -X POST http://localhost:5000/api/suggestions/SUGGESTION_ID/upvote \
  -b cookies.txt
```

### Update Status (Manager)

```bash
curl -X PATCH http://localhost:5000/api/suggestions/SUGGESTION_ID/status \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "Under Review"
  }'
```

## 🔒 Security Features

- HTTP-only cookies for JWT storage
- Password hashing with bcrypt (12 salt rounds)
- Rate limiting on write endpoints
- Input validation and sanitization
- Role-based access control
- CORS configuration
- Error handling middleware

## 🎨 Frontend Features

- Responsive design with Tailwind CSS
- Optimistic UI updates for upvotes
- Real-time search and filtering
- Protected routes with role-based access
- Toast notifications for user feedback
- Loading states and skeleton screens
- Accessible components with ARIA labels

## 🧩 Technologies Used

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Bcryptjs
- Express Validator
- Express Rate Limit
- Jest & Supertest

### Frontend
- React 18
- Vite
- React Router v6
- Zustand (state management)
- Axios
- Tailwind CSS
- Vitest

## 📦 Available Scripts

### Server

- `npm run dev` - Start development server with watch mode
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

### Client

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP whitelist includes your IP

### Port Already in Use

- Change `PORT` in server `.env`
- Update `VITE_API_URL` in client `.env` accordingly

### CORS Errors

- Verify `CORS_ORIGIN` in server `.env` matches frontend URL
- Check browser console for specific CORS error messages

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using the MERN stack**

