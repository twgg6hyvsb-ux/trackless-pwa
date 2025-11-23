```markdown
# Trackless — Mock Tracking Generator (TEST ONLY)

A small progressive web app that generates clearly labeled mock/test tracking numbers and playful mock tracking timelines for UI demos and testing. These IDs are explicitly prefixed with `TEST-` and must never be used for real shipments or to attempt to deceive systems or people.

Why: This is for design, development, and demo workflows — e.g., show how a "tracking" UI looks in an app without connecting to real carriers.

Features
- Gen Z-friendly UI with playful copy
- Generate multiple mock/test tracking IDs (always prefixed with `TEST-`)
- Mock shipment timeline preview for each ID
- Copy, share, and export (CSV) mock IDs
- Installable PWA with offline caching

Ethics & legal
- These are test/mock IDs. Do NOT use them in real orders, for returns, refunds, or to deceive customers or platforms such as the Shop app.
- If you need real carrier testing, use official carrier sandbox APIs (some carriers provide test endpoints) or a private staging environment.

How to run locally
1. Serve the folder over a static host (or use a simple static server).
   - Example (Python 3): `python -m http.server 8000` then open `http://localhost:8000`
2. Open the site, generate mock IDs, and install the PWA via your browser's install prompt.

Hosting
- Works on GitHub Pages, Netlify, Vercel, etc. Just upload the files to a static site.

Publish to GitHub Pages (quick)
1. Create a new public repository on GitHub named `trackless-pwa` (or whatever you prefer).
2. In your local folder (where the files are):
   ```bash
   git init
   git add .
   git commit -m "Initial Trackless PWA"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/trackless-pwa.git
   git push -u origin main
   ```
3. On GitHub: Settings → Pages → Select "main" branch (root) and Save. After a minute your site will be live at:
   `https://YOUR_USERNAME.github.io/trackless-pwa/`
4. Open the URL on mobile and use the browser's "Add to Home screen" / "Install" prompt.

Alternative: Deploy to Netlify (drag & drop)
- Zip the folder or point Netlify to your GitHub repo. Netlify will detect a static site and publish it.

Alternative: Vercel
- Connect your GitHub repo and import the project. Use default static settings.

How to add to homescreen (installable PWA)
- Android Chrome / Edge / Samsung: Open the site → tap menu → "Add to Home screen" or use the install prompt that appears.
- iOS Safari: Open the site → tap Share → "Add to Home Screen" (Note: iOS has limitations—service worker is supported in recent versions but install UX differs).
- Desktop (Chrome): You may see an install icon in the address bar or via the menu → Install app.

Customizations you might want later
- Add QR generation for each ID (client-side)
- Add themed skins (dark, neon)
- Backend option to centralize generation (still ensure TEST- watermark)
- Improve timelines with adjustable date ranges for more realistic demos

Made for testing, not for deception. Use responsibly.
```