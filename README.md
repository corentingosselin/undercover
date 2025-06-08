# 🕵️ Undercover

**Undercover** is a social party game built with React, Capacitor, and Nx. Inspired by classic hidden-role games, players must blend in, deceive, and guess who among them is the Undercover agent!

> This project is proudly made by French developers 🇫🇷 and exclusively uses French words for gameplay to preserve the original humor and challenge.

## 🎮 Features

- 🎲 **Player Setup** with customizable names and roles
- 🤫 Hidden words with subtle semantic differences
- 🧠 Local state management using a GameProvider
- 📱 Mobile-ready via Capacitor for iOS
- ⚡️ Powered by Vite, Nx, and React 19

## 📁 Project Structure

```
apps/
└── undercover/
    ├── src/
    │   ├── app/                  # Core game components
    │   │   ├── Game.tsx
    │   │   ├── GameProvider.tsx
    │   │   ├── SetupPage.tsx
    │   │   ├── SetupPlayers.tsx
    │   │   ├── PlayerForm.tsx
    │   ├── assets/               # Images, icons, etc.
    │   ├── utils/                # Utility functions
    │   ├── main.tsx             # Entry point
    │   └── styles.css
    ├── public/                  # Static files
    ├── index.html
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the App

```bash
nx serve undercover
```

Or to build and run in an iOS simulator:

```bash
npm run start:ios
```

### 3. Build for Production

```bash
nx build undercover
```

## 📦 Tech Stack

- [React 19](https://react.dev)
- [Nx](https://nx.dev)
- [Capacitor](https://capacitorjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- TypeScript

## 🧪 Testing

Tests are powered by [Vitest](https://vitest.dev/). To run:

```bash
npx vitest
```

## 📌 TODO

- [ ] Multiplayer over local Wi-Fi or Bluetooth
- [ ] Custom word list creation
- [ ] Web deployment
- [ ] Audio/visual effects during rounds

## 📄 License

MIT © [Your Name]

---

> Inspired by the classic "Undercover" word game — built with love for friends and fun nights in.