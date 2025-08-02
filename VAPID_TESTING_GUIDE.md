# 🔑 VAPID Testing Guide - BayiCare

## Overview

This guide explains how to test if your VAPID (Voluntary Application Server Identification) keys are working correctly for push notifications in the BayiCare app.

## What are VAPID Keys?

VAPID keys are cryptographic keys used to identify your application server when sending push notifications. They consist of:
- **Public Key**: Shared with the browser and push service
- **Private Key**: Kept secret on your server for signing requests

## Current VAPID Configuration

Your current VAPID keys are configured in `.env`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY="BBIlDN3apCGGqZpKioxMA_xX_LU3PHi8w1KZp-JO0i8ObsUtWXsPtFHhujIiVvJQcng-QsVd2aXp9zW-l-3lUVE"
VAPID_PRIVATE_KEY="bztEzuldH5PtOV7rMvEXnFu9C5ZOqx-hdPnRXKhB2mY"
```

## Testing Methods

### 1. 🖥️ CLI Testing (Server-Side)

Test VAPID configuration from the command line:

```bash
# Run the VAPID test script
npm run test:vapid
```

**What it tests:**
- ✅ Environment variables are set
- ✅ Key formats are valid (65 bytes public, 32 bytes private)
- ✅ Web-push library can use the keys
- ✅ Keys are compatible with the push service

**Expected Output:**
```
🔑 Testing VAPID Configuration...

1. Checking Environment Variables:
   ✓ Public Key: Set
   ✓ Private Key: Set
   ✓ Public Key Length: 87 characters
   ✓ Private Key Preview: BBIlDN3apCGGqZpKioxMA_xX_LU3PH...

2. Testing Key Format:
   ✓ Public Key Format: ✅ Valid (65 bytes)
   ✓ Private Key Format: ✅ Valid (32 bytes)

3. Testing Web-Push Configuration:
   ✅ Web-push configuration successful
   ✅ VAPID keys are compatible with web-push library

🎉 VAPID Configuration Test Complete!
```

### 2. 🌐 Browser Testing (Client-Side)

Test VAPID keys through the web interface:

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Navigate to Profile:**
   - Go to `http://localhost:3000/profile`
   - Scroll to the "Push Notification Test" section

3. **Use VAPID Tester:**
   - Click "Test Config" to verify VAPID configuration
   - Click "Test Notification" to send a real push notification

**What the browser test shows:**
- 🔧 VAPID keys configuration status
- 📏 Key lengths and format validation
- 🔗 Web-push library compatibility
- 🌐 Browser support for push notifications
- 📱 Actual notification sending capability

### 3. 🔌 API Testing (Direct)

Test VAPID keys via API endpoints:

#### Configuration Test:
```bash
curl http://localhost:3000/api/notifications/vapid-test
```

#### Notification Test:
```bash
curl -X POST http://localhost:3000/api/notifications/vapid-test \
  -H "Content-Type: application/json" \
  -d '{"subscription": YOUR_PUSH_SUBSCRIPTION}'
```

## Step-by-Step Testing Process

### Step 1: Verify Environment Setup

1. **Check .env file exists:**
   ```bash
   ls -la .env
   ```

2. **Verify keys are set:**
   ```bash
   grep VAPID .env
   ```

3. **Run CLI test:**
   ```bash
   npm run test:vapid
   ```

### Step 2: Test in Browser

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Open browser and go to:**
   ```
   http://localhost:3000/profile
   ```

3. **Enable push notifications:**
   - Toggle "Aktifkan Notifikasi Push" switch
   - Grant permission when browser asks

4. **Run VAPID tests:**
   - Click "Test Config" in VAPID Tester section
   - Click "Test Notification" to send real notification

### Step 3: Verify Notification Delivery

1. **Check browser console** for any errors
2. **Look for notification** on your device/desktop
3. **Check server logs** for any push service responses

## Troubleshooting Common Issues

### ❌ "VAPID keys not configured"

**Problem:** Environment variables not set or not loaded

**Solutions:**
1. Check `.env` file exists in project root
2. Verify keys are properly formatted (no extra quotes/spaces)
3. Restart development server after changing `.env`

### ❌ "Invalid key format"

**Problem:** Keys are not in correct base64url format

**Solutions:**
1. Generate new keys: `npx web-push generate-vapid-keys`
2. Copy keys exactly as generated (no modifications)
3. Ensure no line breaks or extra characters

### ❌ "Web-push configuration failed"

**Problem:** Keys are incompatible with web-push library

**Solutions:**
1. Generate fresh key pair: `npx web-push generate-vapid-keys`
2. Update both public and private keys together
3. Restart application after updating keys

### ❌ "Push notification failed"

**Problem:** Notification sending fails despite valid keys

**Solutions:**
1. Check browser supports push notifications
2. Verify user granted notification permission
3. Ensure HTTPS is used (required for push notifications)
4. Check service worker is registered correctly

## Generating New VAPID Keys

If you need to generate new VAPID keys:

```bash
# Generate new key pair
npx web-push generate-vapid-keys

# Output will be:
# =======================================
# Public Key:
# BBIlDN3apCGGqZpKioxMA_xX_LU3PHi8w1KZp-JO0i8ObsUtWXsPtFHhujIiVvJQcng-QsVd2aXp9zW-l-3lUVE
# 
# Private Key:
# bztEzuldH5PtOV7rMvEXnFu9C5ZOqx-hdPnRXKhB2mY
# =======================================
```

**Update .env file:**
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY="YOUR_NEW_PUBLIC_KEY"
VAPID_PRIVATE_KEY="YOUR_NEW_PRIVATE_KEY"
```

**⚠️ Important:** When you change VAPID keys, all existing push subscriptions become invalid and users need to re-subscribe.

## Testing Checklist

- [ ] ✅ CLI test passes (`npm run test:vapid`)
- [ ] ✅ Browser VAPID tester shows all green
- [ ] ✅ Push notification permission granted
- [ ] ✅ Service worker registered successfully
- [ ] ✅ Test notification received on device
- [ ] ✅ No errors in browser console
- [ ] ✅ No errors in server logs

## Advanced Testing

### Test with Different Browsers

Test push notifications across different browsers:
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)  
- ✅ Safari (Desktop & Mobile)
- ✅ Edge (Desktop)

### Test Push Service Endpoints

Different browsers use different push services:
- **Chrome/Edge:** Firebase Cloud Messaging (FCM)
- **Firefox:** Mozilla's Push Service
- **Safari:** Apple Push Notification Service (APNs)

Your VAPID keys should work with all of them.

### Load Testing

For production, consider testing:
- Multiple simultaneous notifications
- Large notification payloads
- High-frequency sending
- Error handling and retry logic

## Production Considerations

1. **Security:**
   - Keep private key secure and never expose it
   - Use environment variables, not hardcoded values
   - Consider key rotation strategy

2. **Monitoring:**
   - Log push notification success/failure rates
   - Monitor for invalid subscriptions
   - Track notification engagement

3. **Backup:**
   - Store VAPID keys securely
   - Have a key rotation plan
   - Document recovery procedures

## Conclusion

Your VAPID keys are now properly configured and tested. The testing tools provided will help you:

- ✅ Verify configuration is correct
- ✅ Test notification delivery
- ✅ Troubleshoot any issues
- ✅ Monitor system health

For any issues, use the diagnostic tools in the `/profile` page or run `npm run test:vapid` for detailed analysis.