'use client'
import {createClient} from '@/lib/supabase/client'
import Dashboard from './Dashboard'
export default function DashboardWeb({user}:{user:string}){return <Dashboard user={user} supabase={createClient()} />}
