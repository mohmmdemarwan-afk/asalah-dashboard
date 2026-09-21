# مفروشات الأصالة — النسخة النهائية v3

## البنية
Next.js App Router + Supabase Auth/Postgres + PWA.

## ما تم تنفيذه
- تسجيل الدخول عبر Google OAuth.
- قاعدة بيانات سحابية للعملاء والطلبيات والمتابعات.
- حماية البيانات عبر Row Level Security وربط السجلات بحساب المستخدم.
- إضافة العملاء من داخل التطبيق.
- إضافة الطلبيات من داخل التطبيق.
- تسجيل متابعة مع موعد متابعة قادم وملاحظة.
- لوحة الإحصائيات الأربع المعتمدة.
- زر «تم تسليم الطلبية» وتحديث العميل تلقائيًا إلى «اشترى».
- حملة واتساب متسلسلة مع تأكيد يدوي «تم الإرسال — التالي».
- PWA manifest وتجهيز التطبيق للتثبيت على الهاتف.

## الإعداد
1. `npm install`
2. انسخ `.env.example` إلى `.env.local`.
3. ضع `NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. نفّذ `supabase/schema.sql` في Supabase SQL Editor.
5. فعّل Google Provider في Supabase Authentication.
6. أضف Redirect URL: `https://YOUR-DOMAIN/auth/callback`، وللتطوير `http://localhost:3000/auth/callback`.
7. شغّل `npm run dev`.

## ملاحظة
الإشعارات التي تعمل عندما يكون التطبيق مغلقًا تحتاج في مرحلة لاحقة إلى Web Push + Service Worker + خدمة خلفية. لا نعتمد على localStorage لهذا الغرض.

## تشغيل الإنتاج
قبل النشر يجب تعريف متغيري البيئة في Vercel: `NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. لا تضع Service Role Key في المتصفح.

### Google OAuth
في Supabase: Authentication → Providers → Google. استخدم Client ID وClient Secret من Google Cloud، ثم أضف رابط callback الخاص بـ Supabase ضمن Authorized redirect URIs كما يظهر في لوحة Supabase. وفي Redirect URLs أضف نطاق التطبيق `/auth/callback`.

### قاعدة البيانات
نفّذ `supabase/schema.sql` مرة واحدة في SQL Editor. سيحمي RLS سجلات العملاء والطلبيات والمتابعات بحيث لا يرى المستخدم إلا سجلات حسابه.

### قبل الإطلاق
- اختبار تسجيل Google على هاتف حقيقي.
- اختبار إضافة عميل وطلبية ومتـابعة.
- اختبار زر تسليم الطلبية.
- اختبار حملة واتساب يدويًا.
- التأكد من Redirect URLs لنطاق الإنتاج.


## إعداد Supabase الحالي
تم تجهيز `.env.local` محليًا بقيم مشروع Supabase الخاصة بالتطبيق. لا ترفع هذا الملف إلى مستودع عام. مفتاح Publishable مخصص للواجهة ويمكن استخدامه مع RLS، بينما المفاتيح السرية لا توضع في المتصفح.

## Android V1 — واجهة محلية داخل التطبيق
هذه النسخة تستخدم Capacitor مع واجهة React/Vite مبنية إلى `www` داخل APK. لم تعد تعتمد على `server.url` لعرض واجهة Vercel.

### GitHub Actions
أضف Secrets باسم:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
ثم شغّل Workflow: `Build Asalah Android APK`.

### Google OAuth للتطبيق
اترك Google Cloud callback الحالي كما هو. في Supabase Authentication → URL Configuration أضف:
`com.asalah.furnishings://auth/callback`

### Android Notifications
تمت إضافة Capacitor Push Notifications وطلب إذن الإشعارات داخل التطبيق. الاستقبال الفعلي لإشعارات FCM يحتاج إعداد Firebase/`google-services.json` في مرحلة ربط خادم الإشعارات.
