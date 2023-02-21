import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://whvsmdqekcjezkawdwps.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndodnNtZHFla2NqZXprYXdkd3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MjcwMDUsImV4cCI6MTk5MTIwMzAwNX0.eGKLPXGNxa7w_lMle2rgprtUorsy9p68DeRurqOFmFo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})