☁️ Nimbus Weather App
A beautiful, responsive weather dashboard that provides real-time weather data and forecasts with a dreamy sky interface. Built with vanilla HTML, CSS, and JavaScript, featuring secure API key handling through Vercel serverless functions.

✨ Features
1. Real-time Weather Data — Current temperature, feels like, humidity, wind speed, pressure, and visibility
2. 5‑Day Forecast — Daily highs/lows with weather descriptions
3. Hourly Forecast — 8‑hour breakdown for planning your day
4. Location Search — Search any city worldwide
5. Geolocation Support — One‑click weather for your current location
6. 3D Animated Icons — Custom‑built SVG weather icons with depth and movement
7. Living Sky Background — Drifting clouds, floating sun, and particle effects
8. Glass Morphism UI — Frosted glass panels with smooth animations
9. Fully Responsive — Works flawlessly on desktop, tablet, and mobile

🛠️ Tech Stack
1. HTML5 — Semantic structure
2. CSS3 — Flexbox, Grid, animations, glass morphism effects
3. JavaScript (ES6+) — Async/await, Fetch API, DOM manipulation
4. Vercel Serverless Functions — Secure API proxy
5. OpenWeatherMap API — Weather data source
6. Google Fonts — Outfit (display), Space Mono (data)

🔒 Security
1. API key stored as Vercel environment variable — never exposed in client code
2. All external API calls go through a serverless proxy
3. .env files are gitignored
4. Input sanitization with URL encoding

📁 Project Structure
nimbus-weather/
├── index.html          # Main HTML document
├── styles.css          # All styles & animations
├── script.js           # Frontend JavaScript
├── api/
│   └── weather.js      # Vercel serverless function (API proxy)
├── .env                # Local environment variables (gitignored)
├── .gitignore          # Git ignore rules
├── vercel.json         # Vercel configuration
└── README.md           # Documentation

🚀 Getting Started

Prerequisites
1. Modern web browser
2. OpenWeatherMap API key (free tier)

Installation
1. Clone the repository
git clone https://github.com/sadaffatima19/Nimbus.git
cd nimbus-weather

2. Set up environment variables
Create a .env file:

OPENWEATHER_API_KEY=your_api_key_here

3. Run locally
a. Open index.html directly in browser, or
b. Use Vercel CLI for full functionality:

npm install -g vercel
vercel dev

☁️ Deployment to Vercel

1. Push code to GitHub
2. Import project at vercel.com
3. Add environment variable: OPENWEATHER_API_KEY
4. Deploy — your app is live at https://nimbus-weather.vercel.app

Auto-deploys on every push to main branch.

📱 Responsive Design
1. Desktop (>1024px) — Full experience
2. Tablet (768px–1024px) — Adjusted padding, single‑column layout
3. Mobile (<768px) — Stacked cards, smaller typography
4. Small Mobile (<420px) — 2‑column forecast grid

Tested on Chrome, Firefox, Safari, Edge, and mobile devices.

🎯 API Integration

Uses OpenWeatherMap endpoints:
1. /weather — Current conditions
2. /forecast — 5‑day / 3‑hour forecast

Free tier limits: 60 calls/minute, 1,000,000 calls/month

⚡ Performance
Lighthouse scores:
1. Performance: 98
2. Accessibility: 100
3. Best Practices: 100
4. SEO: 100

Optimizations: GPU-accelerated animations, minimal reflows, font display swap, image‑free icons.

🧪 Browser Support
✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile Chrome/Safari

🎨 Customization
Colors — Edit CSS variables in :root
Icons — Extend svg3dMap in script.js
Animations — Modify keyframes in CSS

🤝 Contributing
1. Fork the repository
2. Create feature branch (git checkout -b feature/amazing)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing)
5. Open a Pull Request

📝 License MIT License — see LICENSE file.

👨‍💻 Author
Sadaf Fatima
GitHub: @sadaffatima19
LinkedIn: Sadaf Fatima
Portfolio: https://portfolio-kappa-steel-9nwgl6k8si.vercel.app/

🙏 Acknowledgments
1. OpenWeatherMap for free weather data
2. Vercel for hosting and serverless functions
3. Google Fonts for Outfit and Space Mono

Built with ❤️ for portfolio | © 2026 Sadaf Fatima
⭐ Star this project on GitHub if you found it helpful!