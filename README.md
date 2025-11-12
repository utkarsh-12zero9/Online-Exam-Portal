# Online Exam Portal — Admin Dashboard & User Portal

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [How to Use (Admin)](#how-to-use-admin)
- [How to Use (User)](#how-to-use-user)
- [Project Structure](#project-structure)
- [API and Data Layer](#api-and-data-layer-local-mock-data)
- [Environment Variables](#environment-variables)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Quality and Accessibility](#quality-and-accessibility)
- [Extending the Project](#extending-the-project)
- [Known Issues](#known-issues)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The **Online Exam Portal** is a React-based single-page application featuring an Admin Dashboard and a User Portal. It includes authentication, role-based access control, course management (CRUD), bulk operations, proctoring features (fullscreen enforcement, tab switch detection, copy/paste restrictions), real-time exam attempt tracking, and CSV export for analytics.

## Features

- ✅ Protected routes and role-based access control
- ✅ Admin: create/edit/delete courses, modules, and questions
- ✅ Admin: bulk operations (select all, bulk delete, confirmation modals)
- ✅ Admin: CSV export for analytics and detailed reports
- ✅ User: dashboard with enrollment, progress, and recent scores
- ✅ Exam interface with timer, questions, and answer submission
- ✅ Proctoring: tab switch detection, fullscreen enforcement, copy/paste blocking
- ✅ Real-time attempt counts and per-attempt history visible to users and admins
- ✅ LocalStorage-based persistence for auth state (re-login-friendly)
- ✅ Responsive UI with a consistent, modern look
- ✅ Clean, readable README and documentation

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **JavaScript (ES6+)** | Language |
| **React** | Frontend framework |
| **Redux Toolkit** | State management |
| **Tailwind CSS** | Styling & utility classes |
| **React Router** | Routing |
| **Custom Hooks** | Proctoring (fullscreen, tab switches, etc.) |
| **Mock Data** | Redux-based local data storage |
| **CSV Export** | Analytics utilities |

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>= 14.x recommended)
- **npm** or **Yarn**
- **Git**
- Modern JavaScript-enabled browser

## Installation

### Clone the repository

```bash
git clone https://github.com/utkarsh-12zero9/Online-Exam-Portal.git
cd Online-Exam-Portal
```

### Install dependencies

Using npm:
```bash
npm install
```

Or using Yarn:
```bash
yarn install
```

## Running the App

### Development Server

Start the development server with:

```bash
npm run start
```

Or with Yarn:
```bash
yarn start
```

The application will be available at `http://localhost:5173` (or your configured port).

### Build for Production

Create an optimized production build:

```bash
npm run build
```

Or with Yarn:
```bash
yarn build
```

## How to Use (Admin)

1. **Login as Admin**
   - Access the login page and enter admin credentials
   - You'll be redirected to the Admin Dashboard

2. **Manage Courses**
   - Navigate to the Courses section
   - Create new courses, edit existing ones, or delete courses
   - Use bulk select and bulk delete for multiple operations

3. **Manage Modules & Questions**
   - Within each course, manage modules
   - Add, edit, or delete questions for each module

4. **View Reports & Analytics**
   - Access the Reports section for detailed analytics
   - Export data to CSV for further analysis
   - View violation reports and auto-submission indicators

5. **Manage Users**
   - View all registered users
   - Edit user information
   - Delete users or perform bulk operations

## How to Use (User)

1. **Login & Dashboard**
   - Login with user credentials
   - View your dashboard with enrolled courses, progress, and recent scores

2. **Enroll in Courses**
   - Browse available courses
   - Enroll in courses of your choice

3. **Start Exams**
   - View enrolled courses and select an exam to start
   - Proctoring features activate (fullscreen, tab switch detection, etc.)

4. **Complete Exam**
   - Answer questions within the time limit
   - Submit your answers
   - View your score and detailed results

5. **View History**
   - Access your exam history page
   - See all attempts, scores, and violations
   - Review detailed attempt information

## Project Structure

```
src/
├── main.jsx                 # Entry point
├── app/
│   ├── App.jsx             # Root component
│   └── store.js            # Redux store configuration
├── features/
│   ├── auth/
│   │   └── slices/
│   │       └── authSlice.js
│   ├── courses/
│   │   └── slices/
│   │       └── courseSlice.js
│   ├── enrollments/
│   │   └── slices/
│   │       └── enrollmentSlice.js
│   ├── modules/
│   │   └── slices/
│   │       └── moduleSlice.js
│   └── questions/
│       └── slices/
│           └── questionSlice.js
├── components/
│   ├── exam/
│   │   └── ProctoringModal.jsx
│   └── shared/
│       ├── ProtectedRoute.jsx
│       ├── PublicRoute.jsx
│       └── layout/
├── hooks/
│   └── useProctoring.js    # Custom proctoring logic
├── pages/
│   ├── admin/              # Admin pages
│   │   ├── AdminDashboardPage.jsx
│   │   ├── AdminCoursesPage.jsx
│   │   ├── AdminUsersPage.jsx
│   │   └── ...
│   └── user/               # User pages
│       ├── UserDashboard.jsx
│       ├── ExamPage.jsx
│       ├── UserHistoryPage.jsx
│       └── ...
├── mocks/
│   └── fixtures/           # Mock data
│       ├── courses.js
│       ├── users.js
│       ├── questions.js
│       └── ...
├── shared/
│   ├── config/
│   │   └── env.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── exportToCSV.js
│   └── components/
│       └── ui/
├── styles/
│   └── index.css
└── assets/
```

## API and Data Layer (Local Mock Data)

The project uses **in-app Redux state** with mock data for quick iteration and testing. For production, replace mock data with actual API calls (REST/GraphQL).

### Typical Data Shapes

**User:**
```javascript
{
  id: number,
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'user',
  phone: string,
  bio: string,
  createdAt: ISO8601 date
}
```

**Course:**
```javascript
{
  id: number,
  title: string,
  description: string,
  domain: string,
  difficulty: 'easy' | 'medium' | 'hard',
  duration: number,
  price: number,
  totalQuestions: number,
  isActive: boolean
}
```

**Enrollment:**
```javascript
{
  id: number,
  userId: number,
  courseId: number,
  totalQuestions: number,
  attempts: Attempt[]
}
```

**Attempt:**
```javascript
{
  id: number,
  courseId: number,
  userId: number,
  submittedAt: ISO8601 date,
  score: number,
  totalMarks: number,
  percentage: number,
  totalQuestions: number,
  answeredQuestions: number,
  violations: string[],
  violationCount: number,
  autoSubmitted: boolean,
  submissionReason: string,
  status: 'completed' | 'pending'
}
```

**Question:**
```javascript
{
  id: number,
  courseModuleId: number,
  type: 'multiple-choice' | 'short-answer',
  question: string,
  options: string[],
  correctAnswer: string
}
```

## Environment Variables

If you add a real backend later, create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_FRONTEND_URL=http://localhost:5173
VITE_APP_NAME=Online Exam Portal
```

For Vite projects, prefix environment variables with `VITE_`.

## Building for Production

1. **Ensure environment-specific config is loaded**
   - Update `.env.production` with production values

2. **Review network requests**
   - Ensure CSV exports use proper data formatting
   - Test all API integrations

3. **Test role-based access control**
   - Verify different user roles have appropriate access
   - Ensure admin features are restricted

4. **Optimize assets**
   ```bash
   npm run build
   ```

5. **Deploy to your hosting platform**
   - Follow your hosting provider's deployment guide

## Testing

### Unit Tests
- Test Redux slices (auth, enrollments, courses)
- Test utility functions (CSV export, formatters)

### Component-level Tests
- Test Admin CRUD flows
- Test User dashboard and exam interface
- Test proctoring features

### End-to-End Tests
- Test login flows
- Test admin course management
- Test exam submission and scoring
- Test CSV exports

### Manual QA Checklist
- [ ] Test bulk operations
- [ ] Test CSV exports with various data
- [ ] Test proctoring toggles and violations
- [ ] Test responsive design on mobile/tablet
- [ ] Test tab switch detection
- [ ] Test fullscreen enforcement
- [ ] Test copy/paste blocking

## Quality and Accessibility

### Current Implementation
- Role-based access control
- Protected routes for sensitive pages
- Error handling and user feedback

### Improvements to Implement
- ✅ Improve contrast for accessibility compliance
- ✅ Ensure keyboard navigation for all interactive controls
- ✅ Add ARIA labels for screen readers
- ✅ Optimize re-renders using React.memo() for heavy components
- ✅ Implement error boundaries for better error handling
- ✅ Use friendly, user-facing error messages

## Extending the Project

### Backend Integration
- Replace mock data with REST/GraphQL API calls
- Implement proper authentication with JWT tokens
- Add server-side validation and security

### Advanced Proctoring
- Integrate webcam-based proctoring
- Add server-side review and violation tracking
- Implement AI-based cheating detection

### Enhanced Analytics
- Build advanced analytics dashboards
- Add performance metrics and insights
- Export detailed reports in multiple formats

### Mobile Extension
- Develop React Native mobile app
- Sync data between web and mobile

### Additional Features
- Real-time notifications
- Discussion forums per course
- Peer review system
- Adaptive testing

## Quick-Start Commands
________________________________________________
|     Command      |        Description        |
|------------------|---------------------------|
|                  |                           |
| `npm run start`  | Start development server  |
| `npm run build`  | Build for production      |
| `npm run lint`   | Run linter                |
| `npm run format` | Format code               |
| `npm test`       | Run tests                 |
|                  |                           |
________________________________________________

## Known Issues

- List any known bugs or limitations here
- Provide workarounds if available

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the Online Exam Portal team**
