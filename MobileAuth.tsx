import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { mobileSupabase } from './supabase'

export default function MobileAuth({ onSignedIn }: { onSignedIn: (email: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleUrl(url: string) {
    try {
      const parsed = new URL(url)
      if (parsed.protocol !== 'com.asalah.furnishings:') return
      if (parsed.host !== 'auth' || parsed.pathname !== '/callback') return
      const code = parsed.searchParams.get('code')
      if (!code) return
      setBusy(true)
      const { error: exchangeError } = await mobileSupabase.auth.exchangeCodeForSession(code)
      if (exchangeError) throw exchangeError
      await Browser.close().catch(() => undefined)
      const { data } = await mobileSupabase.auth.getUser()
      if (data.user) onSignedIn(data.user.email || '')
    } catch (e) {
      console.error(e)
      setError('تعذر إكمال تسجيل الدخول. حاول مرة أخرى.')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    let sub: { remove: () => Promise<void> } | undefined
    App.addListener('appUrlOpen', ({ url }) => handleUrl(url)).then((listener) => { sub = listener })
    App.getLaunchUrl().then((result) => { if (result?.url) void handleUrl(result.url) })
    return () => { sub?.remove() }
  }, [])

  async function google() {
    setError('')
    setBusy(true)
    try {
      const { data, error: authError } = await mobileSupabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'com.asalah.furnishings://auth/callback',
          skipBrowserRedirect: true,
        },
      })
      if (authError) throw authError
      if (!data.url) throw new Error('OAuth URL missing')
      await Browser.open({ url: data.url, presentationStyle: 'popover' })
    } catch (e) {
      console.error(e)
      setError('تعذر فتح تسجيل Google.')
      setBusy(false)
    }
  }

  return (
    <main className="mobile-login">
      <div className="login-brand">أ</div>
      <h1>مفروشات الأصالة</h1>
      <p className="mobile-subtitle">لوحة إدارة العملاء والطلبيات والمتابعات</p>
      <button className="google mobile-google" onClick={google} disabled={busy}>
        {busy ? 'جارٍ فتح تسجيل الدخول…' : 'تسجيل الدخول بحساب Google'}
      </button>
      {error && <div className="mobile-error">{error}</div>}
      <div className="mobile-note">واجهة التطبيق تعمل داخل الهاتف مباشرة، والبيانات تبقى مرتبطة بحسابك في Supabase.</div>
    </main>
  )
}
