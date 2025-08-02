# 🚀 PWA Splash Screen Guide - AlmaCare

## Overview

AlmaCare sekarang memiliki splash screen yang muncul saat aplikasi dibuka dalam mode PWA (Progressive Web App) yang sudah diinstall. Splash screen ini memberikan pengalaman yang lebih native dan professional.

## ✨ Fitur Splash Screen

### **Kapan Splash Screen Muncul:**
- Hanya saat aplikasi dibuka sebagai PWA yang sudah diinstall
- Tidak muncul saat dibuka di browser biasa
- Hanya muncul sekali per session (menggunakan sessionStorage)

### **Desain Splash Screen:**
- **Background:** Gradient orange-pink-purple yang menarik
- **Logo:** Menggunakan `/icon.png` dengan loading animation
- **Branding:** Nama "AlmaCare" dengan tagline
- **Loading Indicator:** Animated dots
- **Duration:** Minimum 2 detik dengan smooth fade out

## 🎨 Perbaikan Landing Page

### **Kontras Warna yang Diperbaiki:**
- **Background:** Gradient dari orange-50 ke purple-50
- **Header:** Semi-transparent dengan backdrop blur
- **Text:** Gray-800 untuk kontras yang baik
- **Cards:** White background dengan shadow yang lebih prominent
- **Button:** Gradient orange-pink dengan hover effects

### **Logo Implementation:**
- **Web:** Menggunakan `/icon.png` di header dan landing page
- **PWA:** Menggunakan `/icon.png` di splash screen
- **Responsive:** Logo berukuran berbeda untuk mobile dan desktop

## 🔧 Technical Implementation

### **PWA Detection Hook (`usePWA.ts`):**
```typescript
export function usePWA() {
    const [isInstalled, setIsInstalled] = useState(false)
    const [showSplash, setShowSplash] = useState(false)
    
    // Deteksi berbagai mode PWA:
    // - display-mode: standalone
    // - display-mode: fullscreen
    // - display-mode: minimal-ui
    // - iOS standalone mode
}
```

### **Splash Screen Component:**
```typescript
export function SplashScreen({ onComplete }: SplashScreenProps) {
    // Logo preloading
    // Animation timing
    // Fade out transition
}
```

### **PWA Provider:**
```typescript
export function PWAProvider({ children }: PWAProviderProps) {
    // Wrapper yang menangani splash screen logic
    // Hanya render splash untuk PWA yang diinstall
}
```

## 📱 Installation & Usage

### **Cara Install PWA:**

1. **Chrome (Desktop):**
   - Klik ikon install di address bar
   - Atau menu → "Install AlmaCare"

2. **Chrome (Mobile):**
   - Menu → "Add to Home Screen"
   - Atau banner install otomatis

3. **Safari (iOS):**
   - Share button → "Add to Home Screen"

4. **Edge:**
   - Menu → "Apps" → "Install this site as an app"

### **Cara Test Splash Screen:**

1. **Install aplikasi sebagai PWA**
2. **Tutup browser/app**
3. **Buka AlmaCare dari home screen/desktop**
4. **Splash screen akan muncul selama 2 detik**

## 🎯 User Experience Flow

### **Browser Mode:**
```
Landing Page → Login → Dashboard
```

### **PWA Mode (First Launch):**
```
Splash Screen → Landing Page → Login → Dashboard
```

### **PWA Mode (Subsequent Launches):**
```
Landing Page → Login → Dashboard
(No splash screen - cached in sessionStorage)
```

## 🎨 Design Specifications

### **Splash Screen Colors:**
- **Background:** `linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)`
- **Logo Container:** `bg-white/20 backdrop-blur-sm`
- **Text:** `text-white` with `drop-shadow-lg`
- **Loading Dots:** `bg-white/60`

### **Landing Page Colors:**
- **Background:** `bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50`
- **Header:** `bg-white/80 backdrop-blur-sm`
- **Cards:** `bg-white shadow-xl border-orange-100`
- **Button:** `bg-gradient-to-r from-orange-500 to-pink-500`

### **Logo Specifications:**
- **Header:** 40x40px (desktop), 32x32px (mobile)
- **Landing Page:** 96x96px
- **Splash Screen:** 96x96px
- **Format:** PNG with transparent background
- **Border Radius:** 16px (rounded-2xl)

## 🔄 Animation Details

### **Splash Screen Animations:**
```css
.animate-fade-in { animation: fade-in 0.8s ease-out; }
.animate-slide-up { animation: slide-up 0.8s ease-out; }
.animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
.animate-fade-out { animation: fade-out 0.5s ease-in; }
```

### **Landing Page Animations:**
- **Cards:** `hover:shadow-2xl transition-all duration-300`
- **Button:** `hover:scale-105 transform transition-all duration-300`
- **Logo:** Smooth loading with fade-in

## 📋 Manifest.json Updates

```json
{
    "name": "AlmaCare - Pantau Tumbuh Kembang Anak",
    "short_name": "AlmaCare",
    "background_color": "#f97316",
    "theme_color": "#f97316",
    "display": "standalone"
}
```

## 🧪 Testing Checklist

### **Landing Page:**
- [ ] ✅ Logo terlihat jelas di header
- [ ] ✅ Text kontras baik dan mudah dibaca
- [ ] ✅ Cards memiliki shadow yang jelas
- [ ] ✅ Button gradient berfungsi
- [ ] ✅ Responsive di mobile dan desktop

### **PWA Splash Screen:**
- [ ] ✅ Muncul hanya saat dibuka sebagai PWA
- [ ] ✅ Logo loading dengan smooth animation
- [ ] ✅ Text dan branding terlihat jelas
- [ ] ✅ Fade out smooth setelah 2 detik
- [ ] ✅ Tidak muncul di browser mode
- [ ] ✅ Hanya muncul sekali per session

### **Cross-Platform:**
- [ ] ✅ Chrome Desktop
- [ ] ✅ Chrome Mobile
- [ ] ✅ Safari iOS
- [ ] ✅ Edge Desktop
- [ ] ✅ Firefox (PWA support terbatas)

## 🚀 Performance Optimizations

### **Image Loading:**
- Logo di-preload sebelum splash screen muncul
- Menggunakan `sessionStorage` untuk mencegah splash berulang
- Lazy loading untuk assets yang tidak critical

### **Animation Performance:**
- Menggunakan CSS transforms untuk smooth animation
- Hardware acceleration dengan `transform` dan `opacity`
- Minimal reflow/repaint dengan absolute positioning

## 🎯 Future Enhancements

### **Planned Features:**
- [ ] Custom splash screen berdasarkan tema
- [ ] Progress indicator untuk loading data
- [ ] Personalized welcome message
- [ ] Seasonal splash screen variations
- [ ] Offline indicator integration

### **Accessibility:**
- [ ] Reduced motion support
- [ ] Screen reader announcements
- [ ] High contrast mode support
- [ ] Keyboard navigation

## 📞 Troubleshooting

### **Splash Screen Tidak Muncul:**
1. Pastikan aplikasi diinstall sebagai PWA
2. Clear browser cache dan sessionStorage
3. Cek console untuk error JavaScript
4. Pastikan `/icon.png` dapat diakses

### **Logo Tidak Muncul:**
1. Cek path `/icon.png` di public folder
2. Pastikan file tidak corrupt
3. Cek network tab untuk 404 errors
4. Verify image format (PNG recommended)

### **Animation Tidak Smooth:**
1. Cek browser support untuk CSS animations
2. Disable hardware acceleration jika bermasalah
3. Reduce animation complexity untuk device lama

Dengan implementasi ini, AlmaCare sekarang memiliki pengalaman PWA yang lebih professional dengan splash screen yang menarik dan landing page dengan kontras warna yang lebih baik! 🎉