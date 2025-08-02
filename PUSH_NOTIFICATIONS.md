# Push Notifications System - BayiCare

## Overview

The BayiCare app includes a comprehensive push notification system that allows users to receive important reminders and alerts directly on their devices. The system supports:

- **Immunization Reminders**: Notifications 3 days before scheduled vaccinations
- **Growth Alerts**: Warnings when child's growth indicators are outside normal ranges
- **MPASI Suggestions**: Recipe recommendations based on child's age
- **System Notifications**: General app updates and information

## Architecture

### Components

1. **Client-Side Service** (`src/lib/push-notification-service.ts`)
   - Handles permission requests
   - Manages push subscriptions
   - Converts VAPID keys
   - Provides browser compatibility checks

2. **Server-Side Service** (`src/lib/server-push-service.ts`)
   - Sends push notifications using web-push library
   - Handles different notification types
   - Manages subscription validation
   - Provides error handling and retry logic

3. **Notification Store** (`src/stores/notificationStore.ts`)
   - Zustand store for push notification state
   - Manages permission status and subscriptions
   - Provides actions for subscribe/unsubscribe

4. **Service Worker** (`public/sw.js`)
   - Handles incoming push events
   - Shows notifications to users
   - Manages notification clicks and actions

5. **UI Components**
   - `PushNotificationSettings.tsx`: User settings interface
   - `PushNotificationTest.tsx`: Development testing component

6. **API Routes** (`src/app/api/notifications/`)
   - `/subscribe`: Save push subscription
   - `/unsubscribe`: Remove push subscription
   - `/test`: Send test notification
   - `/immunization-reminder`: Send immunization reminders
   - `/growth-alert`: Send growth alerts
   - `/mpasi-suggestion`: Send MPASI suggestions

## Setup and Configuration

### 1. VAPID Keys

VAPID keys are already configured in `.env`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY="BGBIKFhDKo7QDatxEHIBzOcdVuzGCoowxoCBiOSuni8ywKKVjpWO8HPtOy28uPFnkMJe1UIQyohHwI5pgolnClE"
VAPID_PRIVATE_KEY="vxVzVXA9nXHNyI7Q9UNRzjXFzH0lkhwmnTS9NzZNSKw"
```

### 2. Database Schema

The User model includes push notification fields:

```prisma
model User {
  // ... other fields
  pushSubscription Json?     // Stores push subscription data
  pushEnabled      Boolean   @default(false)  // User preference
}
```

### 3. Dependencies

Required packages are installed:

```json
{
  "dependencies": {
    "web-push": "^3.6.7"
  },
  "devDependencies": {
    "@types/web-push": "^3.6.4"
  }
}
```

## Usage

### For Users

1. **Enable Push Notifications**
   - Go to Profile page
   - Toggle "Aktifkan Notifikasi Push"
   - Grant permission when prompted

2. **Test Notifications**
   - Use the test button in profile settings
   - Check that notifications appear on device

### For Developers

#### Sending Notifications

```typescript
import { sendPushNotification } from '@/lib/server-push-service'

// Send custom notification
await sendPushNotification(userId, {
  title: 'Custom Title',
  body: 'Custom message',
  data: { url: '/custom-page' }
})

// Send immunization reminder
await sendImmunizationReminder(
  userId,
  'Child Name',
  'DPT-HB-Hib 1',
  new Date('2024-02-15')
)

// Send growth alert
await sendGrowthAlert(
  userId,
  'Child Name',
  'Weight for Age',
  -2.5
)
```

#### Using the Notification Store

```typescript
import { useNotificationStore } from '@/stores/notificationStore'

function MyComponent() {
  const {
    pushNotificationPermission,
    pushSubscription,
    requestPushPermission,
    subscribeToPush,
    unsubscribeFromPush
  } = useNotificationStore()

  const handleEnableNotifications = async () => {
    const success = await requestPushPermission()
    if (success) {
      console.log('Push notifications enabled!')
    }
  }

  return (
    <button onClick={handleEnableNotifications}>
      Enable Notifications
    </button>
  )
}
```

## Testing

### Manual Testing

1. **Run the integration test**:
   ```bash
   node test-push-notifications.js
   ```

2. **Test in browser**:
   - Open the app in a supported browser (Chrome, Firefox, Safari)
   - Go to `/profile`
   - Enable push notifications
   - Use the test button to send a test notification

### Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Edge (Desktop)
- ❌ Internet Explorer (Not supported)

## Notification Types

### 1. Immunization Reminders

**Trigger**: 3 days before scheduled vaccination
**Content**: Child name, vaccine name, due date
**Action**: Opens immunization page

```typescript
{
  title: 'Pengingat Imunisasi',
  body: 'Anak Test perlu imunisasi DPT-HB-Hib 1 dalam 3 hari',
  data: {
    type: 'immunization_reminder',
    childName: 'Anak Test',
    vaccineName: 'DPT-HB-Hib 1',
    url: '/immunization'
  }
}
```

### 2. Growth Alerts

**Trigger**: When Z-score is outside normal range (-2 to +2)
**Content**: Child name, indicator, Z-score value
**Action**: Opens growth tracking page

```typescript
{
  title: 'Peringatan Pertumbuhan',
  body: 'Berat Badan/Umur Anak Test di bawah normal (Z-score: -2.5)',
  data: {
    type: 'growth_alert',
    childName: 'Anak Test',
    indicator: 'Berat Badan/Umur',
    zScore: -2.5,
    url: '/growth'
  }
}
```

### 3. MPASI Suggestions

**Trigger**: Periodic recipe recommendations
**Content**: Child name, recipe name
**Action**: Opens MPASI page with recipe

```typescript
{
  title: 'Saran Menu MPASI',
  body: 'Coba resep "Bubur Ayam Wortel" untuk Anak Test hari ini!',
  data: {
    type: 'mpasi_suggestion',
    childName: 'Anak Test',
    recipeName: 'Bubur Ayam Wortel',
    url: '/mpasi?recipe=Bubur%20Ayam%20Wortel'
  }
}
```

## Security Considerations

1. **Authentication**: All API endpoints require valid session
2. **Authorization**: Users can only manage their own subscriptions
3. **Data Validation**: All inputs are validated before processing
4. **Error Handling**: Graceful handling of invalid subscriptions
5. **Privacy**: Push subscriptions are stored securely in database

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Check browser settings
   - Clear site data and try again
   - Ensure HTTPS is used (required for push notifications)

2. **Notifications Not Received**
   - Verify subscription is active
   - Check browser notification settings
   - Ensure device is not in Do Not Disturb mode

3. **Service Worker Issues**
   - Check browser console for errors
   - Verify service worker is registered
   - Clear browser cache and reload

### Debug Information

Enable debug logging by adding to browser console:

```javascript
// Check service worker status
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations)
})

// Check push subscription
navigator.serviceWorker.ready.then(registration => {
  return registration.pushManager.getSubscription()
}).then(subscription => {
  console.log('Push Subscription:', subscription)
})
```

## Performance Considerations

1. **Subscription Management**: Subscriptions are cached in Zustand store
2. **Error Handling**: Invalid subscriptions are automatically cleaned up
3. **Rate Limiting**: API endpoints should implement rate limiting in production
4. **Batch Processing**: Multiple notifications can be sent efficiently

## Future Enhancements

1. **Notification Scheduling**: Schedule notifications for specific times
2. **Rich Notifications**: Add images and action buttons
3. **Notification History**: Track sent notifications
4. **User Preferences**: Granular control over notification types
5. **Analytics**: Track notification engagement rates

## Conclusion

The push notification system is fully implemented and ready for production use. It provides a comprehensive solution for keeping users engaged with timely, relevant notifications about their children's health and development.

For any issues or questions, refer to the test file (`test-push-notifications.js`) or check the browser console for detailed error messages.