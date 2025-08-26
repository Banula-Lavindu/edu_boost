# EduBoost - Educational Management Platform

EduBoost is a comprehensive educational management platform built with Next.js and Firebase, designed to facilitate learning and administration across multiple user roles.

## Features

- **Multi-Role System**: Support for Students, Educators, and Administrators
- **Authentication**: Secure login with email or student ID
- **Student Management**: Registration, approval workflow, and progress tracking
- **Dashboard**: Role-based dashboards with relevant features
- **Real-time Data**: Firebase Firestore for real-time data synchronization
- **Modern UI**: Glass-morphism design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Database**: Firebase Firestore
- **Authentication**: Custom authentication with Firebase
- **Email**: Nodemailer for notifications
- **UI Components**: Lucide React, Heroicons
- **Charts**: Chart.js, Recharts

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (see setup guide below)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd eduboost
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase (see [Firebase Setup Guide](./FIREBASE_SETUP.md))

4. Configure environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Firebase configuration
   ```

5. Create an admin user:
   ```bash
   npm run seed-admin
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Setup

**Important**: This project uses Firebase instead of MongoDB. Please follow the detailed [Firebase Setup Guide](./FIREBASE_SETUP.md) to configure your Firebase project.

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   ├── dashboard/           # Role-based dashboards
│   │   ├── admin/          # Admin dashboard
│   │   ├── educator/       # Educator dashboard
│   │   └── student/        # Student dashboard
│   ├── globals.css         # Global styles
│   ├── layout.jsx          # Root layout
│   └── page.jsx            # Landing page
├── lib/
│   ├── firebase.js         # Firebase client config
│   ├── firebaseAdmin.js    # Firebase admin config
│   ├── userService.js      # User operations
│   └── sendEmail.js        # Email service
scripts/
└── seed-admin-firebase.mjs # Admin user seeding
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed-admin` - Create admin user

## User Roles

### Student
- Register and wait for admin approval
- Access learning modules and assessments
- Track progress and grades
- Set goals and use planner
- Health monitoring and alerts

### Educator
- Manage assessments and modules
- Monitor student progress
- Track participation
- Handle notifications
- View student details

### Administrator
- Complete system oversight
- User management and approval
- Analytics and reporting
- System configuration
- Audit logs and monitoring

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key"

# Other Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="EduBoost <your_email@gmail.com>"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the [Firebase Setup Guide](./FIREBASE_SETUP.md)
- Review the [Next.js Documentation](https://nextjs.org/docs)
- Open an issue for bugs or feature requests