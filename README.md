# EcoTravel - Sustainable Tourism Chiang Mai

A sustainable tourism web app featuring AR experiences, Green Miles rewards, and eco-friendly travel suggestions for Chiang Mai, Thailand.

## Features

- 🗺️ **Smart Route Planning** - AI-powered sustainable travel routes
- 🎯 **AR Hero Experiences** - Meet local eco-heroes through WebAR
- 🏆 **Green Miles System** - Earn rewards for sustainable choices
- 🛍️ **Reward Redemption** - Exchange points for local rewards
- 📊 **Leaderboards** - Compete with other sustainable travelers
- 🌍 **Bilingual Support** - Thai and English languages

## AR Features (HTTPS Required)

The AR experiences require HTTPS to access device cameras. This app includes:

- AR marker recognition using AR.js
- Local hero storytelling with voice narration
- Bilingual content (Thai/English)
- Real-time sustainability information overlay

## Deployment

### Netlify (Recommended for HTTPS)

1. **Connect to Netlify:**

   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Deploy from project root
   netlify deploy --build

   # Deploy to production
   netlify deploy --prod --build
   ```

2. **Manual Deployment:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist/spa` folder after running `npm run build:client`
   - Site will be available at `https://your-site-name.netlify.app`

### Other HTTPS Hosting Options

- **Vercel:** `npx vercel --prod`
- **GitHub Pages:** Push to GitHub and enable Pages in repository settings
- **Firebase Hosting:** `npm install -g firebase-tools && firebase deploy`

## Development

```bash
# Install dependencies
npm install

# Start development server (HTTP - AR won't work)
npm run dev

# Build for production
npm run build:client

# Start production server
npm start
```

## Important Notes

- **HTTPS Required:** AR camera features only work over HTTPS
- **Mobile Optimized:** Designed primarily for mobile devices
- **Camera Permissions:** Users must grant camera access for AR features
- **Modern Browsers:** Requires WebRTC and WebAR support

## Project Structure

```
├── client/           # React frontend
├── server/          # Express API backend
├── shared/          # TypeScript interfaces
├── public/          # Static assets & AR markers
├── netlify/         # Serverless functions
└── dist/            # Built files
```

## API Endpoints

- `/api/travel-data` - Route planning and comparisons
- `/api/green-miles` - Reward system
- `/api/rewards` - Redemption shop
- `/api/leaderboard` - User rankings
- `/api/ar/*` - AR location and marker verification

## Technologies

- **Frontend:** React 18, TypeScript, TailwindCSS 4, Vite
- **AR:** AR.js, A-Frame WebAR
- **Backend:** Express, Node.js
- **Deployment:** Netlify, Serverless Functions
- **Mobile:** PWA-ready, responsive design

---

Built for sustainable tourism in Chiang Mai 🇹🇭🌿
