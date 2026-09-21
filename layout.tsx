import NativeAuthHandler from '@/components/NativeAuthHandler'
import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata={title:'مفروشات الأصالة',description:'إدارة العملاء والطلبيات والمتابعات',manifest:'/manifest.webmanifest'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body><NativeAuthHandler />{children}</body></html>}
