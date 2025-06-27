# 🚀 HTTPS Deployment Guide for WebAR Features

The EcoTravel app requires HTTPS to access device cameras for AR experiences. Here are the deployment options:

## 🌐 Option 1: Netlify (Recommended - Free HTTPS)

### Quick Deploy

1. **Build the project:**

   ```bash
   npm run build:client
   ```

2. **Manual Drag & Drop:**
   - Go to [netlify.com](https://netlify.com)
   - Create a new site
   - Drag the `dist/spa` folder to deploy
   - Get your HTTPS URL: `https://your-site-name.netlify.app`

### CLI Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --build

# Deploy to production
netlify deploy --prod --build
```

## 🌐 Option 2: Vercel (Free HTTPS)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts)
vercel --prod

# Your app will be at: https://your-app.vercel.app
```

## 🌐 Option 3: GitHub Pages (Free HTTPS)

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set source to GitHub Actions
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build:client
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/spa
```

## 🔧 Testing AR Features

Once deployed to HTTPS:

1. **Open on mobile browser:** `https://your-domain.com`
2. **Navigate to AR Experience:** Click "AR Experience" button on homepage
3. **Grant camera permission** when prompted
4. **Scan AR marker** or use demo buttons
5. **Enjoy the AR hero stories!**

## 📱 Mobile Testing Checklist

- ✅ HTTPS connection (green lock icon)
- ✅ Camera permission granted
- ✅ Modern browser (Chrome, Safari, Firefox)
- ✅ Good lighting for marker detection
- ✅ Stable internet connection

## 🐛 Troubleshooting

### Camera Not Working?

- Ensure you're using HTTPS (not HTTP)
- Check camera permissions in browser settings
- Try different browser (Chrome recommended)
- Clear browser cache and cookies

### AR Markers Not Detecting?

- Ensure good lighting
- Hold phone steady
- Try different angles
- Use demo buttons if marker detection fails

### Audio Not Playing?

- Tap the screen first (autoplay restrictions)
- Check device volume
- Ensure microphone permissions if needed

## 🌟 Production Deployment

For production, consider:

1. **Custom domain:** Point your domain to Netlify/Vercel
2. **SSL certificate:** Automatically provided by hosting services
3. **CDN:** For faster global loading
4. **Analytics:** Add Google Analytics or similar
5. **Error monitoring:** Add Sentry or similar service

---

**Need help?** Check the README.md or contact support!

🇹🇭 Ready to explore sustainable Chiang Mai with AR! 🌿
