import { useCallback, useEffect, useState } from 'react'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { mobileSupabase } from './supabase'
import MobileAuth from './MobileAuth'
import Notifications from './Notifications'
import Dashboard from '../../components/Dashboard'

export default function MobileApp() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)

  const refreshUser = useCallback(async () => {
    const { data } = await mobileSupabase.auth.getUser()
    setSessionEmail(data.user?.email || null)
  }, [])

  useEffect(() => {
    refreshUser()
    const { data: listener } = mobileSupabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user?.email || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [refreshUser])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    PushNotifications.addListener('registration', token => {
      console.info('FCM token received', token.value)
    })
    PushNotifications.addListener('registrationError', error => console.error('Push registration error', error))
    PushNotifications.addListener('pushNotificationReceived', notification => console.info('Notification received', notification))
    return () => {
      PushNotifications.removeAllListeners().catch(() => undefined)
    }
  }, [])

  useEffect(() => {
    if (!sessionEmail || !Capacitor.isNativePlatform()) return
    ;(async () => {
      try {
        let permission = await PushNotifications.checkPermissions()
        if (permission.receive === 'prompt') permission = await PushNotifications.requestPermissions()
        if (permission.receive === 'granted') await PushNotifications.register()
      } catch (e) {
        console.error('Notification permission setup failed', e)
      }
    })()
  }, [sessionEmail])

  async function signout() {
    await mobileSupabase.auth.signOut()
    setSessionEmail(null)
  }

  if (!sessionEmail) {
    return <MobileAuth onSignedIn={email => setSessionEmail(email)} />
  }

  return (
    <>
      <Notifications />
      <Dashboard
        user={sessionEmail}
        supabase={mobileSupabase}
        onSignOut={signout}
        onOpenExternal={(url) => void Browser.open({ url })}
      />
    </>
  )
}
