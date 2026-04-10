import { createClient } from '@supabase/supabase-js'

// Ambil URL dan Anon Key dari Dashboard Supabase kamu
// (Settings > API)
const supabaseUrl = 'https://wnmhozrixrpahzhokzlw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubWhvenJpeHJwYWh6aG9remx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTA1MjcsImV4cCI6MjA5MTM4NjUyN30.7-rj98DL7qEWxpIvuYK_QsQtzenDk67fuC8bDF6sZTw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)