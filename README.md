# ⌨️ TypeForge

A modern, competitive typing speed test application built with TypeScript. Practice your typing skills, track your progress, and compete with others in real-time races.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Express](https://img.shields.io/badge/Express-4.x-green?logo=express)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black?logo=socket.io)
![pnpm](https://img.shields.io/badge/pnpm-9.x-orange?logo=pnpm)

## ✨ Features

### Current Features
- **Real-time Typing Test** - Practice with a clean, distraction-free interface
- **Live WPM Calculation** - See your words-per-minute as you type
- **Accuracy Tracking** - Monitor your typing accuracy in real-time
- **Smooth Auto-scroll** - Text scrolls smoothly as you type, keeping focus on upcoming words
- **Adaptive Scroll Speed** - Scroll speed adjusts based on your typing speed
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Instant Restart** - Press `Tab` to quickly restart the test

### Planned Features
- [ ] User authentication (register/login)
- [ ] Save and track typing history
- [ ] Multiple paragraph/text options
- [ ] Custom text input
- [ ] Competitive multiplayer races (5-10 players)
- [ ] Skill-based matchmaking
- [ ] Friends system and custom races
- [ ] Global leaderboards
- [ ] ELO ranking system
- [ ] Achievements and badges

## 🏗️ Project Structure

This is a **TypeScript monorepo** using pnpm workspaces and Turborepo:

```
typeforge/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── components/      # React components
│   │   ├── pages/           # Next.js pages
│   │   ├── styles/          # Global styles
│   │   └── utils/           # Frontend utilities
│   └── server/              # Express + Socket.IO backend
│       └── src/             # Server source code
├── packages/
│   ├── types/               # Shared TypeScript types (@typeforge/types)
│   └── utils/               # Shared utilities (@typeforge/utils)
├── docker-compose.yml       # PostgreSQL + Redis containers
├── pnpm-workspace.yaml      # pnpm workspace config
├── turbo.json               # Turborepo config
└── package.json             # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9.x (`npm install -g pnpm`)
- **Docker** (for PostgreSQL and Redis)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashsuthar00/typeforge.git
   cd typeforge
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start Docker containers** (PostgreSQL + Redis)
   ```bash
   docker-compose up -d
   ```

4. **Start development servers**
   ```bash
   # Run both frontend and backend
   pnpm dev

   # Or run them separately in different terminals:
   pnpm dev:web     # Frontend on http://localhost:3000
   pnpm dev:server  # Backend on http://localhost:8000
   ```

5. **Open the app**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:web` | Start only the frontend |
| `pnpm dev:server` | Start only the backend |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run linting across all packages |
| `pnpm clean` | Clean all build outputs and node_modules |

## 🛠️ Tech Stack

### Frontend (`apps/web`)
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **CSS Modules** - Scoped styling
- **Socket.IO Client** - Real-time communication

### Backend (`apps/server`)
- **Express.js** - HTTP server
- **Socket.IO** - WebSocket server for real-time features
- **TypeScript** - Type safety
- **tsx** - TypeScript execution

### Shared Packages
- **@typeforge/types** - Shared TypeScript interfaces
  - `Race`, `Player`, `RaceResult`, `RaceProgressUpdate`, `LeaderboardEntry`
- **@typeforge/utils** - Shared utility functions
  - `calculateWPM()`, `calculateAccuracy()`, `validateEmail()`

### Infrastructure
- **PostgreSQL 15** - Primary database
- **Redis 7** - Caching and real-time data
- **Docker Compose** - Container orchestration
- **Turborepo** - Monorepo build system
- **pnpm** - Fast, disk-efficient package manager

## 📊 WPM Calculation

TypeForge uses the standard WPM calculation:

```
WPM = (Correct Characters / 5) / Minutes
Raw WPM = (Total Characters / 5) / Minutes
Accuracy = (Correct Characters / Total Characters) × 100
```

> **Note:** A "word" is standardized as 5 characters (including spaces).

## 🎮 How to Use

1. **Start Typing** - Click on the typing area or just start typing
2. **Watch Your Stats** - WPM, accuracy, and time update in real-time
3. **Focus Zone** - The cursor stays at ~30% from the left; text scrolls to you
4. **Restart** - Press `Tab` at any time to restart the test
5. **Results** - View detailed stats when you complete the text

## 🔧 Environment Variables

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (`apps/server/.env.local`)
```env
NODE_ENV=development
PORT=8000
FRONTEND_URL=http://localhost:3000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Inspired by:
- [Monkeytype](https://monkeytype.com)
- [TypeRacer](https://typeracer.com)
- [Keymash](https://keymash.io)
- [10FastFingers](https://10fastfingers.com)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/yashsuthar00">Yash Suthar</a>
</p>
