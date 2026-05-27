import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sezfmkufihztqidwmkss.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlemZta3VmaWh6dHFpZHdta3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTc5MTAsImV4cCI6MjA5NTM5MzkxMH0.ka6QSOcAj4HoZZQz0iT3YmXZm0DmCJRW9Bhrp5KledI'

export const supabase = createClient(supabaseUrl, supabaseKey)