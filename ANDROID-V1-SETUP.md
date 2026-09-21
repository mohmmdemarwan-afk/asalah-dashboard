# مفروشات الأصالة — Android V1

## ما الذي تغيّر؟
- واجهة React/Vite تُبنى محليًا إلى `www` داخل حزمة Android.
- لم يعد Capacitor يستخدم `server.url` لعرض Vercel.
- Google OAuth يعود إلى التطبيق عبر `com.asalah.furnishings://auth/callback`.
- Supabase هو مصدر البيانات والمصادقة.
- التطبيق يطلب صلاحية الإشعارات من Android بعد تسجيل الدخول.

## GitHub Secrets المطلوبة
في المستودع `asalah-dashboard` أضف:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

القيمة الثانية هي Publishable/Anon key الخاصة بـ Supabase، وليست Service Role Key.

## Supabase Redirect URL
أضف إلى Authentication → URL Configuration:
`com.asalah.furnishings://auth/callback`

لا تغيّر Authorized redirect URI في Google Cloud؛ يبقى عنوان callback الخاص بـ Supabase كما هو.

## الإشعارات
V1 تطلب إذن الإشعارات وتسجل الجهاز عبر Capacitor Push Notifications. استقبال Push فعلي من خادم يتطلب Firebase Cloud Messaging وملف `google-services.json` وربط توكن الجهاز بقاعدة البيانات/خدمة الإرسال في مرحلة الإشعارات التالية.
