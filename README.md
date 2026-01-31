
<div align="center">
   <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
   <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
   <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
   <img src="https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
   <img src="https://img.shields.io/badge/AI_Powered-Groq-FF6B6B?style=for-the-badge" alt="AI Powered" />
</div>

<br/>

<div align="center">
   <h1>📚 WordPocket</h1>
   <p><strong>Transform Your Vocabulary Into Fluency</strong></p>
   <p>An AI-powered language learning platform that turns your saved vocabulary into personalized stories, dialogs, and practice texts.</p>
</div>

---

## 🎬 Demo Video

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: auto;">
    <iframe src="https://www.youtube.com/embed/6bPse29HmXE" 
            title="Demo Video" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    </iframe>
</div>



---

---

## 🎯 What is WordPocket?

**WordPocket** is an innovative language learning tool designed to help learners bridge the gap between **passive vocabulary** (words you recognize) and **active fluency** (words you actually use).

### The Problem It Solves

Traditional vocabulary learning methods often fail because:
- Words are memorized in isolation, without real-world context
- Learners forget 80% of vocabulary within a week
- There's no connection between memorization and practical usage

### Our Solution

WordPocket uses AI to automatically generate **personalized reading material** using EXACTLY the words you want to practice. This creates meaningful context and reinforces vocabulary through natural exposure.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎒 **Smart Word Bag** | Save vocabulary with auto-fetched definitions and example sentences |
| 🤖 **AI Story Generator** | Generate paragraphs, dialogs, or short stories using your selected words |
| 📖 **Interactive Reading** | Click any word in generated texts to see its definition instantly |
| 📊 **Progress Dashboard** | Track your vocabulary growth and reading history |
| 💾 **Local Storage** | Your data is stored locally in your browser |
| 📱 **Responsive Design** | Works seamlessly on desktop, tablet, and mobile |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React + Vite)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Word Bag   │  │  Generator  │  │  Interactive Text   │  │
│  │  Component  │  │   Views     │  │     Reader          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                           │                                  │
│              ┌────────────┴────────────┐                    │
│              │    Services Layer       │                    │
│              │  • storageService       │                    │
│              │  • dictionaryService    │                    │
│              │  • textGenerationService│                    │
│              └────────────┬────────────┘                    │
└───────────────────────────│─────────────────────────────────┘
                            │ /api/generate
┌───────────────────────────▼─────────────────────────────────┐
│                   Backend (Express.js)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Groq API Integration                    │   │
│  │           (llama-3.3-70b-versatile)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---


## 🚀 How to Run the Demo

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Groq API Key** (get yours at https://console.groq.com/keys)

### Quick Start

1. **Clone this repository:**
   ```bash
   git clone https://github.com/your-username/wordpocket-demo.git
   cd wordpocket-demo
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env and add your Groq API key
   ```

4. **Start the servers (in two terminals):**

   **Terminal 1 (Frontend):**
   ```bash
   npm run dev
   ```

   **Terminal 2 (Backend):**
   ```bash
   npm run server
   ```

5. **Open the app in your browser:**

   Go to [http://localhost:3000](http://localhost:3000)

---

---

## 📁 Project Structure

```
wordpocket-demo/
├── App.tsx                  # Main React application component
├── index.tsx                # React entry point
├── types.ts                 # TypeScript type definitions
├── vite.config.ts           # Vite configuration with proxy
├── components/
│   ├── Button.tsx           # Reusable button component
│   ├── Input.tsx            # Form input components
│   ├── InteractiveText.tsx  # Clickable word highlighting
│   ├── WordBagOrb.tsx       # Visual word bag indicator
│   └── WordPocketLogo.tsx   # Logo component
├── services/
│   ├── dictionaryService.ts # Free Dictionary API integration
│   ├── storageService.ts    # LocalStorage management
│   └── textGenerationService.ts # API client for text generation
├── server/
│   ├── index.js             # Express server setup
│   ├── .env.example         # Environment template
│   └── api/
│       └── generate.ts      # AI text generation endpoint
└── public/
    └── logos/               # Partner/inspiration logos
```

---

## 🔧 How It Works

### 1. Add Words to Your Pocket
Save any vocabulary you encounter. WordPocket automatically fetches definitions from the [Free Dictionary API](https://dictionaryapi.dev/).

### 2. Select Words for Practice
Choose which words you want to reinforce from your Word Bag.

### 3. Generate Contextual Content
The AI creates customized content using your exact words:
- **Paragraphs** - Descriptive text for reading practice
- **Dialogs** - Conversational exchanges
- **Short Stories** - Narrative content with plot

### 4. Interactive Reading
Read your generated content with interactive word highlighting. Click any bolded vocabulary word to see its definition without leaving the page.

---

## 🔐 Security Notes

> ⚠️ **Important**: Never commit your `.env` file with real API keys!

- API keys are stored only on the server side
- The `.env` file is included in `.gitignore`
- User data is stored locally in the browser (not sent to any server)
- Authentication is mock/demo only - not production-ready

---

## 🛣️ Roadmap & Future Perspectives

### Short-term Improvements
- [ ] **Multi-language Support** - Add support for Spanish, French, German, etc.
- [ ] **User Authentication** - Implement real authentication (OAuth, JWT)
- [ ] **Cloud Sync** - Store user data in a database (MongoDB, PostgreSQL)
- [ ] **PDF Export** - Download generated texts as formatted PDFs
- [ ] **Spaced Repetition** - Implement SRS algorithm for word review

### Medium-term Features
- [ ] **Voice Features** - Text-to-speech for pronunciation practice
- [ ] **Gamification** - Points, streaks, achievements system
- [ ] **Word Categories** - Organize vocabulary by topics/themes
- [ ] **Progress Analytics** - Detailed statistics and learning insights
- [ ] **Mobile Apps** - Native iOS and Android applications

### Long-term Vision
- [ ] **Community Features** - Share word lists and stories
- [ ] **AI Conversation Partner** - Practice speaking with AI
- [ ] **Integration with Reading Apps** - Import highlights from Kindle, etc.
- [ ] **Adaptive Difficulty** - AI adjusts content complexity based on proficiency
- [ ] **Teacher Dashboard** - Tools for educators to manage student progress

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **Build Tool** | Vite 6 |
| **Backend** | Express.js, Node.js |
| **AI** | Groq API (llama-3.3-70b-versatile) |
| **Dictionary** | Free Dictionary API |
| **Icons** | Lucide React |
| **Storage** | Browser LocalStorage |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👩‍💻 Author

**Ayat Nour Hachmi**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ayat-nour/)

---

<div align="center">
  <p>⭐ If you found this project helpful, please give it a star!</p>
  <p>Made with ❤️ for language learners everywhere</p>
</div>
