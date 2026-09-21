'use client'
import {createClient} from '@/lib/supabase/client'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
export default function Login(){async function google(){const supabase=createClient();const redirectTo=Capacitor.isNativePlatform()?'com.asalah.furnishings://auth/callback':`${location.origin}/auth/callback`;const {data,error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo}});if(error){console.error(error);return}if(Capacitor.isNativePlatform()&&data.url){await Browser.open({url:data.url})}}return <main className="login"><div className="card loginbox"><div className="logo">أ</div><h1>مفروشات الأصالة</h1><p className="muted">إدارة العملاء والطلبيات والمتابعات</p><button className="google" onClick={google}>تسجيل الدخول بحساب Google</button><p className="muted" style={{fontSize:12,marginTop:14}}>بياناتك مرتبطة بحسابك وتبقى محفوظة عند تسجيل الدخول من أي جهاز.</p></div></main>}
