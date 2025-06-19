-- Sample data for testing Form Builder
-- Run this after the main schema to populate with test data

-- Sample dropdown sources and options
INSERT INTO public.dropdown_sources (id, name, description) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'countries', 'List of countries'),
  ('550e8400-e29b-41d4-a716-446655440002', 'departments', 'Company departments'),
  ('550e8400-e29b-41d4-a716-446655440003', 'priority_levels', 'Task priority levels');

-- Sample dropdown options for countries
INSERT INTO public.dropdown_options (source_id, value, label, position) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'us', 'United States', 1),
  ('550e8400-e29b-41d4-a716-446655440001', 'ca', 'Canada', 2),
  ('550e8400-e29b-41d4-a716-446655440001', 'uk', 'United Kingdom', 3),
  ('550e8400-e29b-41d4-a716-446655440001', 'au', 'Australia', 4),
  ('550e8400-e29b-41d4-a716-446655440001', 'de', 'Germany', 5),
  ('550e8400-e29b-41d4-a716-446655440001', 'fr', 'France', 6),
  ('550e8400-e29b-41d4-a716-446655440001', 'jp', 'Japan', 7),
  ('550e8400-e29b-41d4-a716-446655440001', 'sg', 'Singapore', 8);

-- Sample dropdown options for departments
INSERT INTO public.dropdown_options (source_id, value, label, position) VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', 'engineering', 'Engineering', 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'marketing', 'Marketing', 2),
  ('550e8400-e29b-41d4-a716-446655440002', 'sales', 'Sales', 3),
  ('550e8400-e29b-41d4-a716-446655440002', 'hr', 'Human Resources', 4),
  ('550e8400-e29b-41d4-a716-446655440002', 'finance', 'Finance', 5),
  ('550e8400-e29b-41d4-a716-446655440002', 'operations', 'Operations', 6);

-- Sample dropdown options for priority levels
INSERT INTO public.dropdown_options (source_id, value, label, position) VALUES 
  ('550e8400-e29b-41d4-a716-446655440003', 'low', 'Low Priority', 1),
  ('550e8400-e29b-41d4-a716-446655440003', 'medium', 'Medium Priority', 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'high', 'High Priority', 3),
  ('550e8400-e29b-41d4-a716-446655440003', 'urgent', 'Urgent', 4);

-- Note: Sample forms and submissions would be created through the application UI
-- The above provides the foundational data for dynamic dropdowns to work properly
