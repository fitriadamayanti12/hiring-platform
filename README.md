# 🚀 Hiring Management Platform

A modern, full-stack hiring management application built with **Next.js, TypeScript, and Supabase** that enables recruiters to manage job vacancies and allows candidates to apply for positions with dynamic form configurations and gesture-based photo capture.

## 🌐 Live Demo

**Live Application**: https://hiring-platform-xcpy-ra7ge99w3-fitriadamayanti12s-projects.vercel.app  

---

## ✨ Features

### 👨‍💼 Admin Panel
- **Job Management** - Create, edit, and manage job vacancies
- **Dynamic Form Configuration** - Configure required/optional/hidden fields per job
- **Candidate Dashboard** - Advanced table with resizable columns and drag-and-drop reordering
- **Real-time Analytics** - Track applications and candidate pipeline
- **Responsive Design** - Fully functional on desktop and mobile

### 👤 Applicant Portal
- **Job Discovery** - Browse active job postings with search and filters
- **Smart Application Forms** - Dynamic forms that adapt to job requirements
- **Gesture Photo Capture** - Webcam integration with hand pose detection
- **Application Tracking** - View application status and history

### 🛠 Technical Highlights
- **Type Safety** - Full TypeScript implementation
- **Real-time Updates** - Live data synchronization
- **Advanced UI/UX** - Pixel-perfect design implementation
- **Performance Optimized** - Code splitting and efficient rendering
- **Accessibility** - WCAG 2.1 compliant components

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js 14, TypeScript, React 18 |
| **State Management** | Redux Toolkit, RTK Query |
| **Styling** | Tailwind CSS, Headless UI |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Forms** | React Hook Form, Zod Validation |
| **Tables** | TanStack Table |
| **Webcam** | MediaPipe for gesture recognition |
| **Testing** | Jest, React Testing Library |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm, yarn, or pnpm
- Supabase account

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/fitriadamayanti12/hiring-platform.git
cd hiring-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a .env.local file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://vqkvqhjnxgzxhyhzwnfs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxa3ZxaGpueGd6eGh5aHp3bmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MjU0MjIsImV4cCI6MjA3NzIwMTQyMn0.RWaByxgHZcQ9OHnGQ7sbKpx_BITTKI3UHG73yqIMdes
```

4. **Start development server**
```bash
npm run dev
```
Application will be available at http://localhost:3000


## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Authentication
### 👨‍💼 Default Admin Account
- Email: admin@example.com
- Password: admin123

### 👤 Applicant Users
- Registration: Self-service signup through the applicant portal
- Authentication: Email/password-based authentication with Supabase Auth
- Permissions: Job browsing, application submission, profile management
- Access Routes: Public job listings and authenticated application forms

### User Roles
- Admin - Full access to job management, candidate dashboard, and analytics
- Applicant - Job browsing, application submission, and profile management

## Authentication Flow
### Applicant Signup Process
1. Navigate to Signup - Click "Sign Up" from the main navigation
2. Create Account - Provide email, password, and basic profile information
3. Email Verification - Optional email confirmation (configurable in Supabase)
4. Complete Profile - Fill in additional applicant details
5. Access Portal - Start browsing and applying for jobs

### Session Management
- JWT Tokens - Secure session management with Supabase JWT
- Auto-refresh - Automatic token refresh for extended sessions
- Protected Routes - Role-based route protection
- Persistent Sessions - Login state preserved across browser sessions

### Security Features
- Row Level Security (RLS) - Database-level permission controls
- Password Hashing - Secure bcrypt password storage
- Email Validation - Configurable email confirmation
- Session Timeout - Automatic session expiration
- CORS Protection - Configured domain restrictions

## Project Structure
hiring-platform/
```bash
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── apply/             # Job application pages
│   ├── jobs/              # Job listing pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/                # Button, Input, Modal, Table
│   ├── forms/             # Form components & validation
│   ├── layout/            # Header, Sidebar, MainLayout
│   └── shared/            # Common components
├── lib/                   # Utilities & configuration
│   ├── supabase.ts        # Supabase client
│   ├── utils.ts           # Helper functions
│   └── validations.ts     # Validation schemas
├── store/                 # State management
│   ├── slices/            # Redux slices
│   └── api/               # RTK Query endpoints
├── types/                 # TypeScript definitions
└── public/                # Static assets
```

## 🎯 Core Features

### Dynamic Form System
Forms dynamically adapt based on backend configuration. Each job can have different required fields:
- Mandatory - Must be filled (red asterisk)
- Optional - Can be skipped
- Hidden - Not shown in the form

### Gesture-Triggered Webcam
Three-stage hand pose detection for photo capture:
- 🚠 Pose 1 - Hand detection initialized
- 🚡 Pose 2 - Ready state (countdown)
- 🚢 Pose 3 - Automatic capture triggered

### Advanced Candidate Table
- Resizable columns - Drag to adjust width
- Reorderable columns - Drag and drop to rearrange
- Multi-column sorting - Click headers to sort
- Advanced filtering - Filter by any column
- Pagination - Customizable page sizes

## Database Schema
Supabase Tables

### Jobs Table
- id (uuid, primary key)
- title (text)
- status (active/inactive/draft)
- department (text)
- salary_range (jsonb)
- application_form (jsonb)
- created_at (timestamp)

### Applications Table
- id (uuid, primary key)
- job_id (uuid, foreign key)
- applicant_data (jsonb)
- status (pending/reviewed/accepted/rejected)
- created_at (timestamp)

### Profiles Table
- id (uuid, primary key)
- email (text)
- full_name (text)
- role (admin/applicant)
- created_at (timestamp)

## 🔧 API Integration
Supabase Client Configuration

```bash
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## Key Operations
- Jobs: CRUD operations for job management
- Applications: Submit and manage job applications
- Profiles: User authentication and profile management
- Storage: File uploads for resumes and profile pictures

## 🚀 Deployment
### Vercel Deployment
This project is automatically deployed on Vercel. Every push to the main branch triggers a new deployment.