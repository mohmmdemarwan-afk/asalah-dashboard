import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { PushNotifications, PermissionStatus } from '@capacitor/push-notifications'

export default function Notifications() {
  const [status, setStatus] = useState<'checking' | 'granted' | 'denied' | 'prompt' | 'unsupported'>('checking')

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      setStatus('unsupported')
      return
    }
    let mounted = true
    ;(async () => {
      try {
        const permission: PermissionStatus = await PushNotifications.checkPermissions()
        if (!mounted) return
        setStatus(permission.receive === 'granted' ? 'granted' : permission.receive === 'denied' ? 'denied' : 'prompt')
      } catch {
        setStatus('unsupported')
      }
    })()
    return () => { mounted = false }
  }, [])

  async function enable() {
    try {
      let permission = await PushNotifications.checkPermissions()
      if (permission.receive === 'prompt') permission = await PushNotifications.requestPermissions()
      setStatus(permission.receive === 'granted' ? 'granted' : 'denied')
      if (permission.receive === 'granted') {
        await PushNotifications.register()
      }
    } catch (e) {
      console.error(e)
      setStatus('denied')
    }
  }

  if (status === 'unsupported') return null
  return (
    <div className="notice-card">
      <div>
        <strong>إشعارات التطبيق</strong>
        <span>{status === 'granted' ? 'الإذن مفعّل' : status === 'denied' ? 'تم رفض الإذن' : 'الإذن غير مفعّل'}</span>
      </div>
      {status !== 'granted' && status !== 'checking' && <button className="btn" onClick={enable}>تفعيل الإشعارات</button>}
    </div>
  )
}
