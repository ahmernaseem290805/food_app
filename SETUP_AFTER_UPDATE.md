# Food App - Setup After the UI/Functionality Update

## 1. Mobile app
From `food_app`:
```bash
npm install
npx expo start
```

`expo-linear-gradient` is already listed in `package.json`.

## 2. Admin panel
From `food_app/admin-panel`:
```bash
npm install
npm run dev
```

Keep the existing `admin-panel/.env.local` values. Do not commit that file publicly.

## 3. Firestore collections

Create these collections:

### Admin
Document ID = the Firebase Auth UID of the admin.
```text
role: "admin"
name: "Restaurant Admin"
email: "admin@example.com"
```

### UserProfiles
Document ID = the customer's Firebase Auth UID.
```text
UserName: "Customer Name"
Phone: "03001234567"
Address: "Lahore"
email: "customer@example.com"
```

### Categories
Each document:
```text
name: "Burgers"
```

Recommended:
Burgers, Pizza, Drinks, Fries, Shawarmas, Wraps.

### Products
Each document:
```text
name: "Anda Shami"
price: 400
description: "..."
category: "Burgers"
imageUrl: "https://..."
available: true
createdAt: timestamp
```

Existing products that use `Name` or `categoryId` are also supported by the mobile app.

### Orders
The mobile app creates these automatically when a customer places an order:
```text
userId
customerName
customerEmail
items
total
status
paymentStatus
paymentMethod
address
createdAt
```

Initial status:
`pending`

Admin status flow:
`pending -> confirmed -> preparing -> out_for_delivery -> delivered`
or `cancelled`.

### RestaurantSettings
Document ID:
`main`

Fields:
```text
restaurantName
logo
address
phone
openingTime
closingTime
deliveryFee
isOpen
```

### Riders
Created from the admin panel:
```text
name
phone
available
createdAt
```

### Notifications
Created from the admin panel:
```text
title
message
createdAt
readBy
```

## 4. Firebase Storage

Product images are uploaded by the admin panel to:
```text
products/
```

Use the included `storage.rules`.

## 5. Security rules

The project includes:
- `firestore.rules`
- `storage.rules`

Deploy them with Firebase CLI after reviewing them:
```bash
firebase deploy --only firestore:rules,storage
```

If Firebase CLI is not installed:
```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_FIREBASE_PROJECT_ID
```

## 6. Important

The browser/mobile Firebase config values are not passwords by themselves, but Firestore and Storage security rules are essential. Never put service-account private keys in the mobile app or Next.js client.
