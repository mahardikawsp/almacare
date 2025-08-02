# 🚀 Deployment Troubleshooting Guide - BayiCare

## Masalah "Akses Terbatas" di Cloud

Jika Anda mengalami pesan "Akses Terbatas - Anda perlu masuk untuk mengakses halaman ini" saat deploy di cloud, ikuti panduan troubleshooting ini.

## 🔍 Langkah Diagnosis

### 1. Cek Health Check Endpoint

Akses endpoint health check untuk melihat status aplikasi:

```
https://your-domain.com/api/health
```

Response yang sehat akan terlihat seperti:

```json
{
  "status": "healthy",
  "timestamp": "2024-02-08T10:30:00.000Z",
  "database": "connected",
  "version": "1.0.0",
  "environment": {
    "nodeEnv": "production",
    "hasNextAuthUrl": true,
    "hasNextAuthSecret": true,
    "hasGoogleClientId": true,
    "hasDatabaseUrl": true,
    "hasVapidKeys": true
  },
  "deployment": {
    "vercelUrl": "your-app.vercel.app",
    "railwayUrl": null,
    "renderUrl": null
  }
}
```

### 2. Periksa Environment Variables

Pastikan semua environment variables berikut sudah diset di platform cloud Anda:

#### **Wajib untuk Authentication:**
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### **Wajib untuk Database:**
```env
DATABASE_URL=your-postgresql-connection-string
```

#### **Opsional untuk Push Notifications:**
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### 3. Cek Logs Aplikasi

Periksa logs aplikasi untuk melihat error middleware:

```bash
# Vercel
vercel logs

# Railway
railway logs

# Render
# Check logs di dashboard Render
```

Cari log yang dimulai dengan `Middleware:` untuk melihat routing issues.

## 🛠️ Solusi Berdasarkan Platform

### **Vercel Deployment**

1. **Set Environment Variables:**
   ```bash
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add DATABASE_URL
   ```

2. **Update Google OAuth Settings:**
   - Authorized JavaScript origins: `https://your-app.vercel.app`
   - Authorized redirect URIs: `https://your-app.vercel.app/api/auth/callback/google`

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

### **Railway Deployment**

1. **Set Environment Variables di Railway Dashboard**

2. **Update Google OAuth Settings:**
   - Authorized JavaScript origins: `https://your-app.up.railway.app`
   - Authorized redirect URIs: `https://your-app.up.railway.app/api/auth/callback/google`

### **Render Deployment**

1. **Set Environment Variables di Render Dashboard**

2. **Update Google OAuth Settings:**
   - Authorized JavaScript origins: `https://your-app.onrender.com`
   - Authorized redirect URIs: `https://your-app.onrender.com/api/auth/callback/google`

## 🔧 Perbaikan yang Telah Dilakukan

### **Middleware Improvements:**

1. **Flexible Root Path Handling:**
   ```typescript
   // Sebelum: Redirect paksa ke /auth/signin
   if (pathname === '/' && !token) {
       return NextResponse.redirect(new URL('/auth/signin', req.url))
   }

   // Sesudah: Tampilkan landing page
   if (pathname === '/') {
       return NextResponse.next()
   }
   ```

2. **Better Route Protection:**
   ```typescript
   const protectedRoutes = ['/dashboard', '/children', '/growth', '/immunization', '/mpasi', '/profile', '/reports', '/admin']
   const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

   if (isProtectedRoute && !token) {
       return NextResponse.redirect(new URL('/auth/signin', req.url))
   }
   ```

3. **Enhanced Matcher:**
   ```typescript
   matcher: [
       '/((?!api/auth|api/health|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|workbox-.*\\.js|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
   ]
   ```

### **NextAuth Configuration:**

1. **Dynamic Base URL Detection:**
   ```typescript
   function getBaseUrl(): string {
       if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
       if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
       if (process.env.RAILWAY_STATIC_URL) return `https://${process.env.RAILWAY_STATIC_URL}`
       if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL
       return process.env.NODE_ENV === 'production' 
           ? 'https://your-production-domain.com' 
           : 'http://localhost:3000'
   }
   ```

2. **Better Redirect Handling:**
   ```typescript
   async redirect({ url, baseUrl }) {
       const correctBaseUrl = getBaseUrl()
       
       if (url.startsWith('/')) {
           return `${correctBaseUrl}${url}`
       }
       
       if (url.startsWith(correctBaseUrl)) {
           return url
       }
       
       return `${correctBaseUrl}/dashboard`
   }
   ```

## 🚨 Common Issues & Solutions

### **Issue 1: "Configuration Error"**

**Penyebab:** Environment variables tidak diset dengan benar

**Solusi:**
1. Cek `/api/health` untuk melihat environment variables mana yang missing
2. Set semua required environment variables
3. Redeploy aplikasi

### **Issue 2: "OAuth Error"**

**Penyebab:** Google OAuth settings tidak sesuai dengan domain deployment

**Solusi:**
1. Update Google Cloud Console OAuth settings
2. Tambahkan domain deployment ke authorized origins dan redirect URIs
3. Pastikan `NEXTAUTH_URL` sesuai dengan domain deployment

### **Issue 3: "Database Connection Error"**

**Penyebab:** Database URL tidak valid atau database tidak accessible

**Solusi:**
1. Cek `/api/health` untuk status database
2. Verifikasi `DATABASE_URL` format dan credentials
3. Pastikan database server dapat diakses dari platform cloud

### **Issue 4: "Middleware Loop"**

**Penyebab:** Middleware redirect loop

**Solusi:**
1. Cek logs untuk pattern redirect loop
2. Pastikan `NEXTAUTH_URL` sesuai dengan actual domain
3. Clear browser cache dan cookies

## 📋 Deployment Checklist

Sebelum deploy, pastikan:

- [ ] ✅ Semua environment variables sudah diset
- [ ] ✅ Google OAuth settings sudah diupdate
- [ ] ✅ Database accessible dari cloud platform
- [ ] ✅ `NEXTAUTH_URL` sesuai dengan deployment domain
- [ ] ✅ Health check endpoint mengembalikan status "healthy"
- [ ] ✅ Build berhasil tanpa error
- [ ] ✅ Middleware logs tidak menunjukkan error

## 🔍 Debug Commands

### **Test Health Check:**
```bash
curl https://your-domain.com/api/health
```

### **Test Authentication:**
```bash
curl https://your-domain.com/api/auth/session
```

### **Test Root Access:**
```bash
curl -I https://your-domain.com/
```

## 📞 Support

Jika masalah masih berlanjut setelah mengikuti panduan ini:

1. Cek logs aplikasi untuk error spesifik
2. Pastikan semua environment variables sudah benar
3. Verifikasi Google OAuth configuration
4. Test health check endpoint
5. Hubungi tim development dengan informasi logs dan error message

## 🎯 Expected Behavior

Setelah perbaikan, aplikasi harus:

1. **Root Path (`/`):** Menampilkan landing page
2. **Protected Routes:** Redirect ke `/auth/signin` jika belum login
3. **Auth Pages:** Accessible tanpa login
4. **API Routes:** Berfungsi normal
5. **Static Files:** Served dengan benar

Deployment yang sukses akan menunjukkan landing page AlmaCare di root URL dan memungkinkan user untuk login melalui Google OAuth.