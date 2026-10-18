# FindGo Travel 🚖

> **Your Journey, Our Responsibility.**  
> Premium Outstation Cab Service from Delhi NCR to Pan-India Destinations.

Maruti Suzuki Dzire AC Cab Service:
- **One-Way Cab**: ₹18/KM (Tolls & State Taxes Included)
- **Round-Trip Cab**: ₹15/KM
- **Helpline / WhatsApp**: [+91 72890 34489](https://wa.me/917289034489)

---

## 🚀 Features

- **Live Fare Calculator**: Instant fare estimates for one-way and round trips based on exact KM.
- **Direct WhatsApp Booking**: Auto-populates pickup, drop, date, time, and vehicle preference into WhatsApp message.
- **Call-to-Action Bars**: Mobile-friendly sticky action bar for immediate phone or WhatsApp connection.
- **Optimized SEO**: Open Graph tags, Twitter Card meta tags, Schema.org `TaxiService` structured data, and XML sitemap.
- **Fast Static Hosting**: Zero dependencies, sub-second load times, ready for Vercel edge deployment.

---

## 📁 Project Structure

```
├── .gitignore          # Git ignore rules for OS and build files
├── favicon.svg         # SVG favicon
├── images/             # Optimized PNG vehicle and banner assets
│   ├── dzire.png
│   ├── findgo-driver.png
│   ├── hero.png
│   └── innova.png
├── index.html          # Main HTML structure with Schema markup
├── README.md           # Documentation and deployment guide
├── robots.txt          # Search engine crawler instructions
├── script.js           # Dynamic fare engine and form interactions
├── sitemap.xml         # XML Sitemap
├── style.css           # Premium responsive styling and dark mode accents
└── vercel.json         # Vercel deployment configuration and cache headers
```

---

## 🌐 Deploy to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** → **Project**.
3. Import the `findgo-travel` repository (`https://github.com/ajitkushwaha2806/findgo-travel`).
4. Select **Other** as the Framework Preset (Vercel automatically detects static HTML/CSS/JS).
5. Click **Deploy**.

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy directly
vercel --prod
```
