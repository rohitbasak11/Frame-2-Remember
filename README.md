# Frame 2 Remember - Photography Portfolio

A high-performance, cinematic photography portfolio for Rohit Basak, structured for the web using Vite, GSAP, and HTML/CSS.

## 🚀 Key Features

*   **Cinematic Scroll Animations**: Synchronized Z-axis zooming and split-navigation powered by `GSAP ScrollTrigger`.
*   **Liquid Glass Aesthetics**: Premium UI frosted glass overlays, reactive cursor states, and dynamic gradient lighting.
*   **Smooth Scrolling**: Hardware-accelerated fluid scroll experience via `Lenis` for premium navigation.
*   **Client Declaration Form**: Embedded paperless contract via an automated form. Uses EmailJS for zero-backend email delivery direct to the photographer, complete with PDF preservation capabilities.

## 💻 Tech Stack

*   **Frameworks**: Vanilla JS bundled with Vite
*   **Animation**: GSAP (GreenSock Animation Platform)
*   **Smooth Scroll**: Lenis
*   **Emails**: EmailJS (Client-side)

## 🛠 Setup & Development

First, ensure you have [Node.js](https://nodejs.org/) installed on your machine.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to view the site in your browser.

3. **Build for Production:**
   ```bash
   npm run build
   ```
   This compresses everything and generates a `dist` folder ready to be dropped into Vercel or Netlify.

## ✉️ EmailJS Configuration (For Declaration Page)

To ensure the client declaration form successfully sends emails:
1. Make sure your Domain Restrictions in the EmailJS dashboard allow your staging/production domain.
2. Form fields are configured to target `rohitbasaknote@gmail.com` using the customized template.
