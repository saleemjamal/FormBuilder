# Form Builder

A comprehensive form building application that allows users to create sophisticated data collection forms with advanced features like repeating sections, dynamic dropdowns, and custom validation.

## Features

### Core Functionality
- **Drag-and-drop form builder** with intuitive interface
- **15+ field types** including text, number, email, date, file uploads, and more
- **Repeating sections** for collecting multiple instances of data
- **Dynamic dropdowns** with database-driven options
- **Advanced validation** with custom rules and error messages
- **Form branding** with custom colors, logos, and styling
- **Real-time preview** during form creation

### Form Management
- **Dashboard** to view, edit, and manage all forms
- **Form status management** (Draft, Published, Archived)
- **Submission management** with filtering, sorting, and export
- **User authentication** with OAuth providers
- **Role-based access control** (Creator, Viewer, Admin)

### Technical Features
- **Responsive design** optimized for all devices
- **Performance optimized** with sub-2 second load times
- **Security focused** with HTTPS, encryption, and XSS protection
- **File upload support** with Supabase Storage integration
- **Real-time updates** and notifications

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with Headless UI components
- **Form Management**: React Hook Form with Zod validation
- **Drag & Drop**: React DND
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deployment**: Vercel with edge runtime
- **Authentication**: Supabase Auth with OAuth providers

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FormBuilder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your Supabase credentials in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

5. Set up your Supabase database with the required tables (see Database Schema below)

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

The application requires the following tables in Supabase:

### Core Tables
- `users` - User profiles and authentication data
- `roles` - Available user roles (creator, viewer, admin)
- `user_roles` - Many-to-many relationship between users and roles
- `forms` - Form definitions with metadata and branding
- `form_elements` - Individual form fields and their configurations
- `form_submissions` - Submitted form responses
- `submission_responses` - Individual field responses within submissions
- `uploaded_files` - File upload metadata and storage paths
- `dropdown_sources` - Dynamic dropdown data sources
- `dropdown_options` - Options for dynamic dropdowns

### Key Features
- All primary keys use UUIDs for security
- JSONB columns for flexible configuration storage
- Row Level Security (RLS) for data access control
- Optimized indexes for performance

## File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── builder/           # Form builder interface
│   ├── dashboard/         # User dashboard
│   └── forms/            # Public form viewing
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── builder/          # Form builder components
│   ├── dashboard/        # Dashboard components
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
└── types/               # TypeScript type definitions
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Key Components

#### Form Builder (`/src/components/builder/`)
- **FormBuilder**: Main form building interface
- **ElementPalette**: Draggable form elements sidebar
- **FormCanvas**: Main form editing area
- **PropertiesPanel**: Element and form configuration sidebar

#### Authentication (`/src/components/auth/`)
- **AuthProvider**: React context for user authentication
- **AuthModal**: Sign in/sign up modal interface

#### Dashboard (`/src/components/dashboard/`)
- **DashboardContent**: Main dashboard with form list and management

## Configuration

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `MAX_FILE_SIZE` - Maximum file upload size (default: 10MB)
- `ALLOWED_FILE_TYPES` - Comma-separated list of allowed MIME types

### Supabase Configuration
1. Create a new Supabase project
2. Set up authentication providers (Google, etc.)
3. Create the required database tables
4. Configure Row Level Security policies
5. Set up Storage buckets for file uploads

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on git push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For questions or issues, please contact the development team.
