-- Form Builder Database Schema
-- Run this in your Supabase SQL editor to set up the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Roles table
CREATE TABLE public.roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User roles junction table
CREATE TABLE public.user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, role_id)
);

-- Forms table
CREATE TABLE public.forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  branding JSONB,
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE
);
-- Form elements table
CREATE TABLE public.form_elements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  placeholder TEXT,
  required BOOLEAN DEFAULT false,
  validation JSONB,
  options JSONB,
  repeatable BOOLEAN DEFAULT false,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Form submissions table
CREATE TABLE public.form_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  submitted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT CHECK (status IN ('submitted', 'reviewed', 'archived')) DEFAULT 'submitted'
);

-- Submission responses table
CREATE TABLE public.submission_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_id UUID REFERENCES public.form_submissions(id) ON DELETE CASCADE NOT NULL,
  element_id UUID REFERENCES public.form_elements(id) ON DELETE CASCADE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Repeated section instances table
CREATE TABLE public.repeated_section_instances (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_id UUID REFERENCES public.form_submissions(id) ON DELETE CASCADE NOT NULL,
  section_element_id UUID REFERENCES public.form_elements(id) ON DELETE CASCADE NOT NULL,
  instance_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.uploaded_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_id UUID REFERENCES public.form_submissions(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_uploaded_files_submission_id ON public.uploaded_files(submission_id);
CREATE INDEX idx_uploaded_files_uploaded_by ON public.uploaded_files(uploaded_by);
CREATE INDEX idx_dropdown_options_source_id ON public.dropdown_options(source_id);
CREATE INDEX idx_dropdown_options_active ON public.dropdown_options(source_id, active);

-- Insert default roles
INSERT INTO public.roles (name, description) VALUES 
  ('admin', 'Full access to all forms and system administration'),
  ('creator', 'Can create, edit, and manage their own forms'),
  ('viewer', 'Can view forms and submissions but cannot edit');

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repeated_section_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dropdown_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dropdown_options ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can read roles (needed for registration)
CREATE POLICY "Anyone can read roles" ON public.roles
  FOR SELECT TO authenticated USING (true);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Forms policies
CREATE POLICY "Users can view forms they created" ON public.forms
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create forms" ON public.forms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own forms" ON public.forms
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own forms" ON public.forms
  FOR DELETE USING (auth.uid() = created_by);

-- Form elements policies
CREATE POLICY "Users can view elements of their forms" ON public.form_elements
  FOR SELECT USING (
    auth.uid() IN (
      SELECT created_by FROM public.forms WHERE id = form_id
    )
  );

CREATE POLICY "Users can create elements for their forms" ON public.form_elements
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT created_by FROM public.forms WHERE id = form_id
    )
  );

CREATE POLICY "Users can update elements of their forms" ON public.form_elements
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT created_by FROM public.forms WHERE id = form_id
    )
  );

CREATE POLICY "Users can delete elements of their forms" ON public.form_elements
  FOR DELETE USING (
    auth.uid() IN (
      SELECT created_by FROM public.forms WHERE id = form_id
    )
  );

-- Form submissions policies
CREATE POLICY "Users can view submissions to their forms" ON public.form_submissions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT created_by FROM public.forms WHERE id = form_id
    )
  );

CREATE POLICY "Users can submit to published forms" ON public.form_submissions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE id = form_id AND status = 'published'
    )
  );

-- Submission responses policies  
CREATE POLICY "Users can view responses to their forms" ON public.submission_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.form_submissions fs
      JOIN public.forms f ON f.id = fs.form_id
      WHERE fs.id = submission_id AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create responses when submitting" ON public.submission_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.form_submissions fs
      JOIN public.forms f ON f.id = fs.form_id
      WHERE fs.id = submission_id AND f.status = 'published'
    )
  );

-- Uploaded files policies
CREATE POLICY "Users can view files from their forms" ON public.uploaded_files
  FOR SELECT USING (
    auth.uid() = uploaded_by OR
    EXISTS (
      SELECT 1 FROM public.form_submissions fs
      JOIN public.forms f ON f.id = fs.form_id
      WHERE fs.id = submission_id AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can upload files" ON public.uploaded_files
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Dropdown sources policies (public read for now)
CREATE POLICY "Anyone can read dropdown sources" ON public.dropdown_sources
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can read dropdown options" ON public.dropdown_options
  FOR SELECT TO authenticated USING (true);

-- Functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_forms_updated_at
  BEFORE UPDATE ON public.forms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_form_elements_updated_at
  BEFORE UPDATE ON public.form_elements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default creator role
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (
    NEW.id,
    (SELECT id FROM public.roles WHERE name = 'creator')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Dropdown sources table (for grouping dropdown options)
CREATE TABLE public.dropdown_sources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Dropdown options table
CREATE TABLE public.dropdown_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source_id UUID REFERENCES public.dropdown_sources(id) ON DELETE CASCADE NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);