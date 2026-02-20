
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pdsusycbqwmjlgyzrxcu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc3VzeWNicXdtamxneXpyeGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjUyMjcsImV4cCI6MjA4NTcwMTIyN30.EnsrxO7iai8CTsQNup_wQZcOMp4EI5pJJE0YEUX43QY';

export const supabase = createClient(supabaseUrl, supabaseKey);
