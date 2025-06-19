# Form Builder Setup Guide

## Quick Start

Your Form Builder application has been successfully created! Here's how to get it running:

## 1. Set Up Supabase

### Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization and set project details
5. Wait for the project to be created

### Configure Database
1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL to create all tables and policies
4. Optionally, run `supabase/sample-data.sql` for test data

### Set Up Authentication
1. In Supabase dashboard, go to Authentication > Providers
2. Enable Email provider (enabled by default)
3. For Google OAuth:
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL to: `http://localhost:3000/auth/callback`

### Configure Storage (Optional)
1. Go to Storage in Supabase dashboard
2. Create a bucket named "form-uploads"
3. Set up RLS policies for file access

## 2. Environment Variables

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials in `.env.local`:
```env
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# For Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-string
```

### Where to Find Supabase Keys:
1. Go to your Supabase project dashboard
2. Click on Settings (gear icon) → API
3. Copy the Project URL and anon/public key
4. For service role key, copy the service_role key (keep this secret!)

## 3. Install Dependencies & Run

The dependencies are already installed. To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 4. First Time Setup

1. Open the application in your browser
2. Click "Create Form" to open the authentication modal
3. Sign up with email or Google OAuth
4. You'll be redirected to the dashboard
5. Create your first form using the drag-and-drop builder!

## Key Features Available

### ✅ Implemented Features
- **Hero page** with call-to-action
- **User authentication** (email/password + OAuth ready)
- **Form builder interface** with drag-and-drop
- **15+ field types** (text, email, date, file uploads, etc.)
- **Element properties panel** for customization
- **Form settings** (title, description, status, branding)
- **Dashboard** to manage forms
- **Responsive design** for all devices
- **Database schema** with RLS policies
- **File upload support** structure

### 🚧 Ready for Implementation
- **Form submission handling**
- **Data visualization dashboard**
- **Export functionality**
- **Advanced validation rules**
- **Conditional logic/branching**
- **Email notifications**
- **Public form sharing**

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET` (generate a new one for production)

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure `.env.local` exists and has correct values
   - Check that variable names match exactly

2. **Authentication not working**
   - Verify Supabase Auth is enabled
   - Check redirect URLs in Auth settings
   - Ensure RLS policies are set up correctly

3. **Database errors**
   - Run the schema.sql file in Supabase SQL editor
   - Check that all tables were created successfully
   - Verify RLS is enabled on all tables

4. **Build errors**
   - Run `npm run type-check` to find TypeScript issues
   - Check for missing dependencies

### Support
If you encounter issues:
1. Check the browser console for errors
2. Review the terminal output for server errors
3. Verify your environment variables
4. Check the Supabase dashboard for database/auth issues

## Next Steps

1. **Set up your Supabase project** using the provided schema
2. **Configure your environment variables**
3. **Start the development server**
4. **Create your first form**
5. **Customize and extend** based on your needs

The application is now ready to use! The foundation is solid and you can extend it with additional features as needed.
