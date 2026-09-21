'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { createClient } from '@/lib/supabase/client'

export default function NativeAuthHandler() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const supabase = createClient()

    const handle = async ({ url }: { url: string }) => {
      try {
        const parsed = new URL(url)
        if (!parsed.protocol.startsWith('com.asalah.furnishings')) return

        const code = parsed.searchParams.get('code')
        if (code) {
          await supabase.auth.exchangeCodeForSession(code)
          window.location.href = '/dashboard'
        }
      } catch (error) {
        console.error('Native auth callback failed:', error)
      }
    }

    let listener: { remove: () => Promise<void> } | undefined
    App.addListener('appUrlOpen', handle).then((l) => { listener = l })

    return () => { listener?.remove() }
  }, [])

  return null
}
