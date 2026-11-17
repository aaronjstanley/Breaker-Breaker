import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const AMP_OPTIONS = [0, 15, 20, 25, 30, 40, 50, 60] as const
export type AmpValue = (typeof AMP_OPTIONS)[number]

export type DbBreakerPanel = {
  id: string
  name: string
  row_count: number
  created_at: string
  updated_at: string
}

export type DbBreaker = {
  id: string
  panel_id: string
  slot_number: number
  title: string
  description: string
  amps: number | null
  created_at: string
  updated_at: string
}
