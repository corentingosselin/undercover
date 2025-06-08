# 🕵️ Undercover

**Undercover** is a social party game built with React, Capacitor, and Nx. Inspired by classic hidden-role games, players must blend in, deceive, and guess who among them is the Undercover agent!

Tired of classic undercover game on appstore, always getting same words with free edition.
Here is a minimalist approch of the game

> This project is proudly made by French developers 🇫🇷 and exclusively uses French words for gameplay to preserve the original humor and challenge.

## 🎮 Features

- 🎲 **Player Setup** with customizable names
- 🤫 Hidden words with subtle semantic differences
- 🧠 Local state management using a GameProvider
- 📱 Mobile-ready via Capacitor for iOS
- ⚡️ Powered by Vite, Nx, and React 19

## 📸 GamePlay Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/c18c4feb-d19c-4e1f-bf1d-f0c1cab6616d" width="250" />
  <img src="https://github.com/user-attachments/assets/c54ea49c-bdd1-4b5b-849e-0f311c2fd3a3" width="250" />
  <img src="https://github.com/user-attachments/assets/7366ff4b-7fd2-4f10-8cbc-249c1d6216a6" width="250" />
  <br />
  <img src="https://github.com/user-attachments/assets/ea70e154-ad8d-4ed8-83f3-245aadf9f5c0" width="250" />
  <img src="https://github.com/user-attachments/assets/47b2c6e6-d8e5-4edd-ae7b-c3dce6cb00a8" width="250" />
  <img src="https://github.com/user-attachments/assets/73162815-94d5-42ce-9efd-e7b8d93e8a69" width="250" />
  <br />
  <img src="https://github.com/user-attachments/assets/f60df7a4-9765-4319-aca3-1346c304bd26" width="250" />
  <img src="https://github.com/user-attachments/assets/e86c76ae-9939-4558-9027-b089380411fa" width="250" />
  <img src="https://github.com/user-attachments/assets/1035d850-6b1c-4d4c-ae3f-134ad173db55" width="250" />
</p>

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
- [ ] Localstorage to save players pseudo
- [ ] Profile picture for each player
- [ ] translations

## 📄 License

MIT © corentingosselin

---

> Inspired by the classic "Undercover" word game — built with love for friends and fun nights in.
