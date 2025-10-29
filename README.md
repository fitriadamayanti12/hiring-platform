# Hiring Management Platform

A modern, full-stack hiring management application built with React, TypeScript, and Supabase. This platform enables recruiters to manage job vacancies and allows candidates to apply for positions with dynamic form configurations and gesture-based photo capture.

## 🚀 Live Demo

**Live Application**: [Deploy URL Here]  
**Admin Dashboard**: [Deploy URL Here]/admin

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### 👨‍💼 Admin Panel
- **Job Management**: Create, edit, and manage job vacancies
- **Dynamic Form Configuration**: Configure required/optional/hidden fields per job
- **Candidate Dashboard**: Advanced table with resizable columns, drag-and-drop reordering
- **Real-time Analytics**: Track applications and candidate pipeline
- **Responsive Design**: Fully functional on desktop and mobile

### 👤 Applicant Portal
- **Job Discovery**: Browse active job postings with search and filters
- **Smart Application Forms**: Dynamic forms that adapt to job requirements
- **Gesture Photo Capture**: Webcam integration with hand pose detection
- **Application Tracking**: View application status and history

### 🛠 Technical Highlights
- **Type Safety**: Full TypeScript implementation
- **Real-time Updates**: Live data synchronization
- **Advanced UI/UX**: Pixel-perfect design implementation
- **Performance Optimized**: Code splitting and efficient rendering
- **Accessibility**: WCAG 2.1 compliant components

## 🛠 Tech Stack

**Frontend Framework**
- React 18 + TypeScript
- React Router v6 for navigation
- Redux Toolkit + RTK Query for state management

**Styling & UI**
- Tailwind CSS for utility-first styling
- Headless UI for accessible components
- Custom design system

**Backend & Database**
- Supabase (PostgreSQL + Auth + Storage)
- Row Level Security (RLS) enabled

**Development Tools**
- Vite for build tooling
- ESLint + Prettier for code quality
- Jest + React Testing Library for testing

**Additional Libraries**
- TanStack Table for advanced table features
- React Hook Form + Zod for form handling
- MediaPipe for gesture recognition

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm, yarn, or pnpm
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/fitriadamayanti12/hiring-platform.git
cd hiring-platform

2. **Install dependencies**

bash
npm install

3. **Environment Setup**
Create a .env.local file in the root directory:

env
NEXT_PUBLIC_SUPABASE_URL=https://vqkvqhjnxgzxhyhzwnfs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxa3ZxaGpueGd6eGh5aHp3bmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MjU0MjIsImV4cCI6MjA3NzIwMTQyMn0.RWaByxgHZcQ9OHnGQ7sbKpx_BITTKI3UHG73yqIMdes

4. **Start development server**

bash
npm run dev
The application will be available at http://localhost:5173

Production Build
bash
# Build for production
npm run build

# Preview production build
npm run preview
🔐 Authentication
Default Admin Account
Email: admin@example.com

Password: admin123

User Roles
Admin: Full access to job management, candidate dashboard, and analytics

Applicant: Job browsing, application submission, and profile management

📁 Project Structure
text
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Button, Input, etc.)
│   ├── forms/          # Form components and validation
│   ├── layout/         # Layout components
│   └── shared/         # Shared components
├── features/           # Feature-based organization
│   ├── admin/          # Admin panel features
│   │   ├── jobs/       # Job management
│   │   ├── candidates/ # Candidate dashboard
│   │   └── analytics/  # Analytics and reports
│   ├── applicant/      # Applicant features
│   │   ├── jobs/       # Job browsing
│   │   └── applications/# Application process
│   └── auth/           # Authentication flows
├── hooks/              # Custom React hooks
│   ├── useWebcam.ts    # Webcam and gesture detection
│   ├── useLocalStorage.ts
│   └── useTableConfig.ts
├── lib/                # Utility libraries
│   ├── supabase.ts     # Supabase client configuration
│   ├── utils.ts        # Helper functions
│   └── validations.ts  # Validation schemas
├── store/              # State management
│   ├── slices/         # Redux slices
│   └── api/            # RTK Query endpoints
├── types/              # TypeScript definitions
├── pages/              # Page components
└── assets/             # Static assets
🎯 Core Features Deep Dive
Dynamic Form System
The application features a sophisticated dynamic form system that adapts based on backend configuration. Fields are dynamically shown/hidden based on job configuration, with validation rules adapting in real-time.

Gesture-Triggered Webcam Capture
Advanced webcam integration with hand pose detection using three-stage gesture recognition:

Pose 1 🚠 - Hand detection initialized

Pose 2 🚡 - Ready state, counting down to capture

Pose 3 🚢 - Automatic photo capture triggered

Advanced Candidate Table
Enterprise-grade table with powerful features:

Resizable columns (drag to adjust width)

Reorderable columns (drag and drop)

Multi-column sorting

Advanced filtering

Pagination with customizable page sizes

🗄 API Integration
Supabase Schema
Jobs Table

sql
- id (uuid, primary key)
- title (text)
- status (active/inactive/draft)
- salary_range (jsonb)
- application_form (jsonb)
- created_at (timestamp)
Applications Table

sql
- id (uuid, primary key)
- job_id (uuid, foreign key)
- applicant_data (jsonb)
- status (pending/reviewed/accepted/rejected)
- created_at (timestamp)
🧪 Testing
bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (if configured)
npm run test:e2e

# Run in watch mode
npm run test:watch
🚀 Deployment
Vercel Deployment (Recommended)
Connect Repository to Vercel

Configure Environment Variables in Vercel dashboard:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

Deploy - Automatic deployments on git push

Environment Variables
Required:

env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
🎨 Design System
Color Palette
Primary: Blue-600 (#2563eb)

Secondary: Gray-700 (#374151)

Success: Green-600 (#16a34a)

Warning: Amber-500 (#f59e0b)

Error: Red-600 (#dc2626)

Typography Scale
Display: Inter, 32px, 600

Title: Inter, 24px, 600

Subtitle: Inter, 18px, 500

Body: Inter, 16px, 400

🌐 Browser Support
Chrome: 88+

Firefox: 85+

Safari: 14+

Edge: 88+

🔮 Future Enhancements
Real-time chat between recruiters and candidates

Advanced analytics dashboard with charts

Bulk candidate operations

Interview scheduling integration

Multi-language support (i18n)

👥 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is developed as part of a technical assessment. All rights reserved.

Built with ❤️ using Modern Web Technologies