# AI Vision Board 3D 🚀

An immersive 3D vision board app powered by AI. Built with Create React App, Firebase, Three.js, GSAP, and OpenRouter.

---

## ✨ Features

- **3D Room** — React Three Fiber scene with floating goal orbs, particle rings, and a distorted vision sphere
- **AI Boost** — Generate affirmations or action steps for any goal using free OpenRouter models
- **Dynamic Model Selector** — Switch between Llama 3.1, Gemma 2, and Mistral 7B at runtime
- **Firebase Auth** — Google Sign-In with Firestore goal storage
- **Mobile First** — Reduced polygon counts, disabled particles on mobile, `dpr={[1,2]}` on all Canvases
- **GSAP Animations** — Entrance animations + ScrollTrigger reveals + `normalizeScroll(true)` for mobile

---

## 🛠 Tech Stack

| Layer       | Technology                                  |
|-------------|---------------------------------------------|
| Framework   | Create React App (`.jsx` files)             |
| Styling     | Tailwind CSS v3                             |
| 3D          | Three.js + @react-three/fiber + drei        |
| Animations  | GSAP + ScrollTrigger                        |
| Particles   | react-particles + tsparticles-slim          |
| Auth + DB   | Firebase v10 (Google Auth + Firestore)      |
| AI          | OpenRouter via Vercel `/api/generate.js`    |
| Deployment  | Vercel                                      |

---

## 📁 File Structure

```
ai-vision-board/
├── api/
│   └── generate.js              ← Vercel serverless — calls OpenRouter
├── public/
│   └── index.html               ← Space Grotesk font loaded here
├── src/
│   ├── components/
│   │   ├── 3D/
│   │   │   ├── Room.jsx         ← Full 3D scene (stars, orbs, sphere)
│   │   │   └── GoalCard.jsx     ← Per-goal 3D card preview
│   │   └── ui/
│   │       ├── Button.jsx       ← Reusable button with variants
│   │       └── Modal.jsx        ← Accessible modal with ESC + scroll lock
│   ├── config/
│   │   └── models.js            ← AI model list (edit here to add models)
│   ├── hooks/
│   │   ├── useAuth.js           ← Firebase Google Auth hook
│   │   └── useIsMobile.js       ← Breakpoint hook (< 768px)
│   ├── lib/
│   │   └── firebase.js          ← Firebase init (replace placeholder here)
│   ├── pages/
│   │   ├── Home.jsx             ← Landing page with 3D hero + particles
│   │   ├── Dashboard.jsx        ← Goal management + AI boost + model selector
│   │   └── Gallery.jsx          ← Visual gallery of all goals
│   ├── services/
│   │   └── ai.service.js        ← generateAffirmation / generateActionSteps
│   ├── App.jsx                  ← Router + protected routes
│   ├── App.css                  ← Tailwind base + global styles
│   └── index.js                 ← React root
├── .env.example
├── vercel.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Replace Firebase config

Open `src/lib/firebase.js` and replace `FIREBASE_CONFIG_PLACEHOLDER` with your real config:

```js
// BEFORE:
const firebaseConfig = FIREBASE_CONFIG_PLACEHOLDER; // Replace with your config

// AFTER:
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

**Where to find it:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Your project → Project Settings → Your apps → SDK setup and configuration

### 3. Enable Firebase services

In Firebase Console:
- **Authentication** → Sign-in method → Google → Enable
- **Firestore Database** → Create database (start in production mode)

Add Firestore security rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /goals/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

### 4. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
OPENROUTER_API_KEY=sk-or-your-key-here
```

Get your key from [openrouter.ai/keys](https://openrouter.ai/keys) — free tier available.

### 5. Run locally

```bash
npm start
```

---

## ☁️ Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/ai-vision-board.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. Framework preset: **Create React App** (auto-detected)

### 3. Add environment variable in Vercel

In Vercel dashboard → Project → Settings → Environment Variables:

| Name                | Value                    | Environment  |
|---------------------|--------------------------|--------------|
| `OPENROUTER_API_KEY`| `sk-or-your-key-here`   | Production   |

> ⚠️ Do NOT prefix with `REACT_APP_` — this key is used only server-side in `/api/generate.js`

### 4. Deploy

Click **Deploy** — Vercel auto-builds and hosts everything.

---

## 🤖 Adding More AI Models

Edit `src/config/models.js`:

```js
export const AI_MODELS = [
  // Add any OpenRouter model with ":free" suffix for free tier
  { id: "your-new-model:free", name: "My New Model — Label", description: "...", badge: "🆕 New" },
  // ... existing models
];
```

The model dropdown in Dashboard and AI Boost modal updates automatically.

---

## 📱 Mobile Notes

- `react-particles` is disabled on screens < 768px
- Three.js scenes use `dpr={[1, 1.5]}` on mobile vs `dpr={[1, 2]}` on desktop
- Geometry polygon counts are halved on mobile (icosahedron, sphere segments)
- `ScrollTrigger.normalizeScroll(true)` handles iOS bounce-scroll edge cases

---

## 🔑 Free OpenRouter Models

All three default models are free (no credits needed with a free account):

| Model | Best For |
|-------|----------|
| `meta-llama/llama-3.1-8b-instruct:free` | Quality — rich, detailed content |
| `google/gemma-2-9b-it:free` | Speed — fastest response time |
| `mistralai/mistral-7b-instruct:free` | Backup — reliable fallback |

---

## 📄 License

MIT
