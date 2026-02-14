# Deploy to Firebase Hosting (yotubeadwords)

Your site **yotubeadwords** in project **socio-websites** is set up. Use these steps to go live.

## Prerequisites

1. **Firebase CLI** (install once):
   ```bash
   npm install -g firebase-tools
   ```
2. **Login** (if not already):
   ```bash
   firebase login
   ```

## Deploy

From the **project root** (`youtubeadwords`):

```bash
npm run deploy
```

This will:
1. Build the frontend (`frontend/dist`)
2. Deploy to Firebase Hosting for site **yotubeadwords**

## URLs after deploy

- **Default:** https://yotubeadwords.web.app  
- **Alt:** https://yotubeadwords.firebaseapp.com  

## Manual steps (if you prefer)

```bash
cd frontend && npm run build
cd .. && firebase deploy --only hosting
```

## Firebase config

- **Project:** socio-websites  
- **Hosting site:** yotubeadwords  
- **Build output:** `frontend/dist`  
- **SPA:** All routes rewrite to `/index.html`

Firebase Analytics is initialized in the app via `frontend/src/firebase.js` using your SDK config.
