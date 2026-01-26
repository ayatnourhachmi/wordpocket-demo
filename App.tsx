import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  PenTool, 
  Library, 
  LogOut, 
  Plus, 
  Trash2, 
  Languages, 
  Save, 
  RefreshCw, 
  ArrowLeft,
  FileText,
  Download,
  Search,
  X,
  Check,
  Menu,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Calendar,
  Zap,
  LayoutDashboard,
  Edit2,
  Linkedin
} from 'lucide-react';

import { AppView, User, Word, GeneratedText, TextType, GenerateOptions } from './types';
import * as storageService from './services/storageService';
import * as geminiService from './services/textGenerationService';
import * as dictionaryService from './services/dictionaryService';
import { Button } from './components/Button';
import { Input, Select } from './components/Input';
import { WordBagOrb } from './components/WordBagOrb';
import { InteractiveText } from './components/InteractiveText';
import { WordPocketLogo } from './components/WordPocketLogo';

const AVAILABLE_LANGUAGES = [
  { label: 'English', value: 'English' },
];

const NavItem = ({ icon: Icon, label, isActive, onClick, className }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 font-bold ${
      isActive 
        ? 'bg-brand-500 text-dark-900 shadow-glow' 
        : 'text-dark-500 hover:bg-gray-100 hover:text-dark-900'
    } ${className}`}
  >
    <Icon size={20} className={isActive ? 'text-dark-900' : 'text-gray-400'} />
    <span>{label}</span>
  </button>
);

export default function App() {
  console.log('App component rendering');
  
  // Global State
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<User | null>(null);
  
  // Data State
  const [words, setWords] = useState<Word[]>([]);
  const [texts, setTexts] = useState<GeneratedText[]>([]);
  
  // UI State
  const [activeText, setActiveText] = useState<GeneratedText | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Collapsed by default
  const [activeWord, setActiveWord] = useState<Word | null>(null);
  const [isAddingWord, setIsAddingWord] = useState(false); // Loading state for word add

  // Load user on mount
  useEffect(() => {
    console.log('App useEffect running');
    const storedUser = storageService.getUser();
    console.log('Stored user:', storedUser);
    if (storedUser) {
      setUser(storedUser);
      loadUserData(storedUser.id);
      setView(AppView.DASHBOARD);
    }
  }, []);

  const loadUserData = (userId: string) => {
    setWords(storageService.getWords(userId));
    setTexts(storageService.getTexts(userId));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    
    // Mock Login
    const newUser: User = {
      id: email,
      email,
      name: email.split('@')[0]
    };
    
    storageService.saveUser(newUser);
    setUser(newUser);
    loadUserData(newUser.id);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    storageService.clearUser();
    setUser(null);
    setWords([]);
    setTexts([]);
    setView(AppView.LANDING);
  };

  // --- Actions ---
  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsAddingWord(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const wordText = formData.get('word') as string;
    const language = 'English';
    let definition = formData.get('definition') as string;
    let exampleSentence = formData.get('exampleSentence') as string;
    
    if (!wordText) {
      setIsAddingWord(false);
      return;
    }

    // Auto-fetch definition if empty
    if (!definition) {
      try {
        const dictData = await dictionaryService.fetchDefinition(wordText, language);
        if (dictData.definition) {
          definition = dictData.definition;
        }
        // Only autofill example if user didn't provide one
        if (!exampleSentence && dictData.example) {
          exampleSentence = dictData.example;
        }
      } catch (err) {
        console.warn("Failed to autofill definition", err);
      }
    }

    const newWord: Word = {
      id: Date.now().toString(),
      userId: user.id,
      word: wordText,
      language,
      definition,
      exampleSentence,
      createdAt: Date.now()
    };

    storageService.addWord(newWord);
    setWords(prev => [newWord, ...prev]);
    form.reset();
    setIsAddingWord(false);
  };

  const handleDeleteWord = (id: string) => {
    storageService.deleteWord(id);
    setWords(prev => prev.filter(w => w.id !== id));
    setActiveWord(null);
  };

  const handleGenerate = async (options: GenerateOptions) => {
    if (!user) return;
    
    const selectedWords = words
      .filter(w => options.selectedWordIds.includes(w.id))
      .map(w => w.word);

    try {
      const result = await geminiService.callLLM({
        words: selectedWords,
        type: options.type,
        language: options.language,
        lengthPreference: options.length
      });

      const newText: GeneratedText = {
        id: Date.now().toString(),
        userId: user.id,
        title: result.title,
        content: result.content,
        type: options.type,
        language: options.language,
        wordsUsed: selectedWords,
        createdAt: Date.now()
      };

      storageService.saveText(newText);
      setTexts(prev => [newText, ...prev]);
      setActiveText(newText);
      setView(AppView.TEXT_DETAIL);
    } catch (error) {
      alert("Error generating text. Please try again.");
    }
  };

  const handleDeleteText = (id: string) => {
    storageService.deleteText(id);
    setTexts(prev => prev.filter(t => t.id !== id));
    if (activeText?.id === id) {
      setActiveText(null);
      setView(AppView.MY_TEXTS);
    }
  };

  // Public nav used on FEATURES/PRICING/BLOG screens (was missing)
  const PublicNav = () => (
    <nav className="relative flex items-center px-8 py-6 max-w-7xl mx-auto w-full">
      {/* Left */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setView(AppView.LANDING)}
      >
        <WordPocketLogo size={40} />
        <span className="text-xl font-bold tracking-tight">
          <span className="text-dark-900">Word</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-600">
            Pocket
          </span>
        </span>
      </div>

      {/* Center (TRUE CENTER) */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-sm font-medium text-dark-600">
        <a
          href="#"
          className="hover:text-dark-900"
          onClick={(e) => { e.preventDefault(); setView(AppView.FEATURES); }}
        >
          Features
        </a>
        <a
          href="#"
          className="hover:text-dark-900"
          onClick={(e) => { e.preventDefault(); setView(AppView.PRICING); }}
        >
          Pricing
        </a>
        <a
          href="#"
          className="hover:text-dark-900"
          onClick={(e) => { e.preventDefault(); setView(AppView.BLOG); }}
        >
          Blog
        </a>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-3">
        <Button variant="dark" onClick={() => setView(AppView.LANDING)}>
          Log In
        </Button>
      </div>
    </nav>
  );

  console.log('Current view:', view);
  
  if (view === AppView.LANDING) {
    console.log('Rendering landing page');
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
        <nav className="relative flex items-center px-8 py-6 max-w-7xl mx-auto w-full">
          {/* Left */}
          <div className="flex items-center gap-3">
            <WordPocketLogo size={40} />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-dark-900">Word</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-600">
                Pocket
              </span>
            </span>
          </div>

          {/* Center (TRUE CENTER) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-sm font-medium text-dark-600">
            <a href="#" className="hover:text-dark-900" onClick={(e) => { e.preventDefault(); setView(AppView.FEATURES); }}>Features</a>
            <a href="#" className="hover:text-dark-900" onClick={(e) => { e.preventDefault(); setView(AppView.PRICING); }}>Pricing</a>
            <a href="#" className="hover:text-dark-900" onClick={(e) => { e.preventDefault(); setView(AppView.BLOG); }}>Blog</a>
          </div>

          {/* Right */}
          <div className="ml-auto">
            <Button
              variant="dark"
              onClick={() => {
                const form = document.getElementById('login-form');
                form?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Log In
            </Button>
          </div>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
          <div className="absolute top-20 left-10 md:left-40 animate-bounce delay-700 duration-3000 hidden md:block">
            <div className="bg-white p-4 rounded-3xl shadow-soft flex items-center gap-3 border border-gray-100 transform -rotate-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">EN</div>
              <div>
                <p className="text-xs font-bold text-dark-900">English</p>
                <div className="h-1.5 w-16 bg-brand-500 rounded-full mt-1"></div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-40 right-10 md:right-40 animate-bounce delay-100 duration-3000 hidden md:block">
            <div className="bg-dark-900 p-4 rounded-3xl shadow-soft flex items-center gap-3 transform rotate-6">
              <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-dark-900 font-bold">
                <Check size={20}/>
              </div>
              <div className="text-white">
                <p className="text-xs font-bold">Story Generated</p>
                <p className="text-[10px] opacity-70">Just now</p>
              </div>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto z-10 mt-10">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-dark-900 leading-[1.1] mb-6">
              Transform Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-600">Vocabulary</span> Into Fluency.
            </h1>
            <p className="text-lg text-dark-400 mb-10 max-w-lg mx-auto leading-relaxed">
              Store words you learn in your pocket, and let our AI weave them into personalized stories, dialogs, and paragraphs instantly.
            </p>
            
            <div className="bg-white p-8 rounded-[2rem] shadow-soft max-w-md mx-auto border border-gray-100" id="login-form">
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-center mb-2">Get Started Free</h3>
                <Input name="email" type="email" placeholder="name@example.com" required className="rounded-full" />
                <Input name="password" type="password" placeholder="Password" required className="rounded-full" />
                <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                  Start Learning
                </Button>
              </form>
            </div>
          </div>
          
          <div className="mt-20 flex flex-col items-center gap-6 px-4 pb-10 mt-10">
            <p className="text-sm uppercase tracking-widest text-gray-400 font-semibold">
              Inspired by
            </p>

            <div className="flex flex-wrap items-center justify-center gap-24 mb-10">
              <img
                src="/logos/duolingo.svg"
                alt="Duolingo"
                className="h-8 object-contain scale-90 opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-95"
              />
              <img
                src="/logos/babbel.png"
                alt="Babbel"
                className="h-6 object-contain scale-90 opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-95"
              />
              <img
                src="/logos/rosetta.png"
                alt="Rosetta Stone"
                className="h-12 object-contain opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-105"
              />
              <img
                src="/logos/memrise.png"
                alt="Memrise"
                className="h-12 object-contain opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-105"
              />
            </div>

            <footer className="w-full py-6 mt-20 border-t border-gray-100">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-6">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} WordPocket
                </p>

                <p className="text-sm text-gray-500 flex items-center gap-2">
                  Developed by <span className="font-semibold text-dark-900">Ayat Nour Hachmi</span>
                  <a
                    href="https://www.linkedin.com/in/ayat-nour/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                    className="rounded-full bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#0A66C2] hover:bg-white transition-all"
                  >
                    <Linkedin size={18} />
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    );
  }

  if (view === AppView.FEATURES) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
        <PublicNav />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark-900 mb-6">
              Master Vocabulary <br/>
              <span className="text-brand-600">Effortlessly</span>
            </h1>
            <p className="text-lg text-dark-400">
              Everything you need to turn passive vocabulary into active fluency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Library,
                title: "Smart Word Bag",
                desc: "Store words instantly with auto-definitions and examples. Watch your vocabulary grow visually."
              },
              {
                icon: Sparkles,
                title: "AI Story Weaver",
                desc: "Generate personalized stories, dialogs, and articles using EXACTLY the words you want to practice."
              },
              {
                icon: Zap,
                title: "Instant Context",
                desc: "Click any word in your generated stories to see its meaning without losing your reading flow."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-soft border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-3">{feature.title}</h3>
                <p className="text-dark-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (view === AppView.PRICING) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
        <PublicNav />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark-900 mb-6">
              Simple, Transparent <br/>
              <span className="text-brand-600">Pricing</span>
            </h1>
            <p className="text-lg text-dark-400">
              Start for free, upgrade when you're ready to master more languages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-dark-900 mb-2">Starter</h3>
              <div className="text-4xl font-extrabold text-dark-900 mb-6">$0<span className="text-lg text-gray-400 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-dark-600"><Check size={18} className="text-brand-500"/> 50 Words Limit</li>
                <li className="flex items-center gap-3 text-dark-600"><Check size={18} className="text-brand-500"/> 5 Stories / Month</li>
                <li className="flex items-center gap-3 text-dark-600"><Check size={18} className="text-brand-500"/> 1 Language</li>
              </ul>
              <Button variant="outline" className="w-full rounded-xl" onClick={() => setView(AppView.LANDING)}>Get Started</Button>
            </div>

            <div className="bg-dark-900 p-8 rounded-[2rem] shadow-xl border border-dark-800 relative transform scale-105 z-10">
              <div className="absolute top-0 right-0 bg-brand-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-[2rem]">POPULAR</div>
              <h3 className="text-xl font-bold text-white mb-2">Polyglot</h3>
              <div className="text-4xl font-extrabold text-white mb-6">$9<span className="text-lg text-gray-500 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300"><Check size={18} className="text-brand-500"/> Unlimited Words</li>
                <li className="flex items-center gap-3 text-gray-300"><Check size={18} className="text-brand-500"/> Unlimited Stories</li>
                <li className="flex items-center gap-3 text-gray-300"><Check size={18} className="text-brand-500"/> All Languages</li>
                <li className="flex items-center gap-3 text-gray-300"><Check size={18} className="text-brand-500"/> Export to PDF</li>
              </ul>
              <Button variant="primary" className="w-full rounded-xl py-4">Start Free Trial</Button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-dark-900 mb-2">Lifetime</h3>
              <div className="text-4xl font-extrabold text-dark-900 mb-6">$149<span className="text-lg text-gray-400 font-medium">/once</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-dark-600"><Check size={18} className="text-brand-500"/> One-time payment</li>
                <li className="flex items-center gap-3 text-dark-600"><Check size={18} className="text-brand-500"/> All Pro Features</li>
                <li className="flex items-center gap-3 text-dark-600"><Check size={18} className="text-brand-500"/> Priority Support</li>
              </ul>
              <Button variant="outline" className="w-full rounded-xl">Buy Now</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === AppView.BLOG) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
        <PublicNav />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark-900 mb-6">
              Learning <br/>
              <span className="text-brand-600">Resources</span>
            </h1>
            <p className="text-lg text-dark-400">
              Tips, tricks, and science behind effective language acquisition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Why Context is King in Language Learning", excerpt: "Stop memorizing isolated lists. Learn how context hooks words into your long-term memory.", date: "Dec 12, 2024", read: "5 min read", img: "https://picsum.photos/seed/context/400/200" },
              { title: "The Power of Active Recall", excerpt: "How to trick your brain into remembering words forever using the spacing effect.", date: "Dec 10, 2024", read: "4 min read", img: "https://picsum.photos/seed/recall/400/200" },
              { title: "5 Ways to Use AI for Fluency", excerpt: "Beyond translation: How to use LLMs as your personal conversation partner.", date: "Dec 08, 2024", read: "7 min read", img: "https://picsum.photos/seed/ai-fluency/400/200" }
            ].map((post, i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-white opacity-20"></div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.read}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-3 group-hover:text-brand-600 transition-colors">{post.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed mb-6">{post.excerpt}</p>
                  <span className="text-brand-600 font-bold text-sm flex items-center gap-2">Read Article <ChevronRight size={16}/></span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // --- Authenticated Layout ---
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans">
      {/* Sidebar - NOW WHITE */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 p-6 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative flex flex-col
        `}
      >
        <div className="flex items-center gap-3 mb-12 px-2">
          <WordPocketLogo size={40} />
          <span className="text-2xl font-extrabold tracking-tight text-dark-900">WordPocket</span>
          <button className="md:hidden ml-auto" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} className="text-dark-500"/>
          </button>
        </div>

        <div className="space-y-2 flex-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" isActive={view === AppView.DASHBOARD} onClick={() => { setView(AppView.DASHBOARD); setIsSidebarOpen(false); }} />
          <NavItem icon={Library} label="Word Bag" isActive={view === AppView.WORD_BAG} onClick={() => { setView(AppView.WORD_BAG); setIsSidebarOpen(false); }} />
          <NavItem icon={Sparkles} label="Generate" isActive={view === AppView.GENERATE} onClick={() => { setView(AppView.GENERATE); setIsSidebarOpen(false); }} />
          <NavItem icon={BookOpen} label="My Texts" isActive={view === AppView.MY_TEXTS || view === AppView.TEXT_DETAIL} onClick={() => { setView(AppView.MY_TEXTS); setIsSidebarOpen(false); }} />
        </div>

        <div className="mt-auto">
          <div className="bg-gray-50 rounded-3xl p-5 mb-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-dark-900 font-bold shadow-sm">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold truncate text-sm text-dark-900">{user?.name}</p>
                <p className="text-xs text-dark-400 truncate">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-dark-500 hover:text-dark-900 hover:bg-white px-0">
              <LogOut size={16} className="mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2 text-dark-900">
            <WordPocketLogo size={32} />
            <span className="font-bold">WordPocket</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-100 rounded-full">
            <Menu size={24} />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative">
          {/* Dashboard View */}
          {view === AppView.DASHBOARD && (
            <div className="max-w-6xl mx-auto space-y-10">
              <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-dark-900 tracking-tight mb-2">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-dark-400 text-lg">Your daily progress overview.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-900 rounded-[2rem] p-8 text-white relative overflow-hidden group cursor-pointer transition-all hover:shadow-xl"
                  onClick={() => setView(AppView.WORD_BAG)}>
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Library size={120} />
                  </div>
                  <h3 className="text-dark-300 font-medium mb-1">Total Words</h3>
                  <p className="text-5xl font-bold mb-6">{words.length}</p>
                  <div className="inline-flex items-center text-brand-500 text-sm font-bold bg-dark-800 px-4 py-2 rounded-full">
                    Manage Bag <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-soft relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => setView(AppView.MY_TEXTS)}>
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-500">
                    <FileText size={120} />
                  </div>
                  <h3 className="text-dark-400 font-medium mb-1">Stories Created</h3>
                  <p className="text-5xl font-bold text-dark-900 mb-6">{texts.length}</p>
                  <div className="inline-flex items-center text-dark-900 text-sm font-bold bg-gray-100 px-4 py-2 rounded-full group-hover:bg-brand-500 transition-colors">
                    View History <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>

                <div className="bg-brand-500 rounded-[2rem] p-8 text-dark-900 flex flex-col justify-center items-center text-center cursor-pointer shadow-glow transition-transform hover:scale-[1.02]"
                  onClick={() => setView(AppView.GENERATE)}>
                  <div className="bg-white/30 p-4 rounded-full mb-4">
                    <Sparkles size={32} className="text-dark-900"/>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Practice Now</h3>
                  <p className="opacity-80 mb-0 font-medium">Generate a new story from your words.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-dark-900">Recent Words</h2>
                    <button onClick={() => setView(AppView.WORD_BAG)} className="text-brand-600 font-bold hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {words.slice(0, 3).map(word => (
                      <div key={word.id} className="bg-white p-5 rounded-3xl shadow-soft flex justify-between items-center border border-gray-50">
                        <div>
                          <p className="text-lg font-bold text-dark-900">{word.word}</p>
                          <p className="text-sm text-dark-400">{word.language}</p>
                        </div>
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                          {new Date(word.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {words.length === 0 && (
                      <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400">
                        No words yet. Add some to get started!
                      </div>
                    )}
                  </div>
                </section>
                
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-dark-900">Recent Stories</h2>
                  </div>
                  <div className="space-y-4">
                    {texts.slice(0, 3).map(text => (
                      <div key={text.id} className="bg-white p-5 rounded-3xl shadow-soft border border-gray-50 cursor-pointer hover:border-brand-300 transition-colors" onClick={() => { setActiveText(text); setView(AppView.TEXT_DETAIL); }}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-dark-900">{text.title}</h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700 px-2 py-1 rounded-full">{text.type}</span>
                        </div>
                        <p className="text-sm text-dark-400 line-clamp-2">{text.content.replace(/\*\*/g, '')}</p>
                      </div>
                    ))}
                    {texts.length === 0 && (
                      <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400">
                        No stories yet.
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Word Bag View */}
          {view === AppView.WORD_BAG && (
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-extrabold text-dark-900 tracking-tight">Word Bag</h1>
                  <p className="text-dark-400 mt-1">Your floating universe of vocabulary.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-200 shadow-sm">
                  <div className="px-4 py-2 flex items-center gap-2 text-gray-400">
                    <Search size={18} />
                    <input
                      placeholder="Search words..."
                      className="bg-transparent border-none outline-none text-sm w-40"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 flex flex-col items-center">
                  <div className="w-full relative">
                    <WordBagOrb words={words} onWordClick={setActiveWord} />
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="bg-white rounded-[2rem] p-6 shadow-soft border border-gray-100 w-full">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <div className="bg-brand-100 p-1.5 rounded-full text-brand-600">
                        <Plus size={16} />
                      </div>
                      Add New Word
                    </h3>

                    <form onSubmit={handleAddWord} className="space-y-3">
                      <Input name="word" placeholder="Word" required className="rounded-xl" />
                      <div className="grid grid-cols-2 gap-2">
                        <Select name="language" options={AVAILABLE_LANGUAGES} className="rounded-xl" />
                        <Input name="definition" placeholder="Meaning (Auto-fills)" className="rounded-xl" />
                      </div>
                      <Input name="exampleSentence" placeholder="Example Sentence" className="rounded-xl" />

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full rounded-xl"
                        isLoading={isAddingWord}
                        loadingText="Fetching definition..."
                      >
                        Add to Bag
                      </Button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-12">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-dark-900 text-lg">All Words ({words.length})</h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Most Recent</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {words.map(word => (
                      <div
                        key={word.id}
                        className="group bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {word.language}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setActiveWord(word)}
                              className="text-gray-300 hover:text-brand-600 p-1"
                            >
                              <PenTool size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteWord(word.id)}
                              className="text-gray-300 hover:text-red-500 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-dark-900 mb-1">{word.word}</h3>

                        {word.definition && (
                          <p className="text-brand-600 font-medium mb-2 text-sm">{word.definition}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generator View */}
          {view === AppView.GENERATE && (
            <GenerateView words={words} onGenerate={handleGenerate} />
          )}

          {/* My Texts View */}
          {view === AppView.MY_TEXTS && (
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl font-extrabold text-dark-900 tracking-tight mb-2">My Stories</h1>
              <p className="text-dark-400 mb-8">Review and export your generated practice materials.</p>
              
              <div className="space-y-4">
                {texts.map(text => (
                  <div 
                    key={text.id} 
                    onClick={() => { setActiveText(text); setView(AppView.TEXT_DETAIL); }}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold
                        ${text.type === TextType.STORY ? 'bg-purple-100 text-purple-600' : 
                          text.type === TextType.DIALOG ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                        {text.type === TextType.STORY ? '📖' : text.type === TextType.DIALOG ? '💬' : '¶'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-dark-900 mb-1 group-hover:text-brand-600 transition-colors">{text.title}</h3>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Languages size={14}/> {text.language}</span>
                          <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(text.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-brand-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Detail View */}
          {view === AppView.TEXT_DETAIL && activeText && (
            <div className="max-w-4xl mx-auto">
              <Button variant="ghost" onClick={() => setView(AppView.MY_TEXTS)} className="mb-6 pl-0 hover:bg-transparent text-dark-500 hover:text-dark-900">
                <ArrowLeft size={18} className="mr-2" /> Back to My Stories
              </Button>

              <div className="bg-white rounded-[2.5rem] shadow-soft overflow-hidden border border-gray-100">
                <div className="bg-dark-900 p-8 md:p-12 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-widest mb-4">
                          {activeText.type} • {activeText.language}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">{activeText.title}</h1>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="secondary" className="bg-white/10 border-none text-white hover:bg-white/20" title="Delete" onClick={() => handleDeleteText(activeText.id)}>
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                </div>

                <div className="p-8 md:p-12">
                  <div className="prose prose-lg prose-headings:font-bold prose-p:text-dark-600 max-w-none">
                    <InteractiveText content={activeText.content} words={words} />
                  </div>
                  
                  <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <p className="text-sm text-gray-400 font-medium">Export this practice text:</p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="rounded-full">.TXT</Button>
                      <Button variant="outline" className="rounded-full">.PDF</Button>
                      <Button variant="primary" className="rounded-full flex items-center gap-2">
                        <Download size={18} /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Word Detail Modal */}
          {activeWord && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-dark-900/50 backdrop-blur-sm" onClick={() => setActiveWord(null)}>
              <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {activeWord.language}
                  </div>
                  <button onClick={() => setActiveWord(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                
                <h2 className="text-4xl font-extrabold text-dark-900 mb-2">{activeWord.word}</h2>
                {activeWord.definition && (
                  <p className="text-2xl text-brand-600 font-medium mb-6">{activeWord.definition}</p>
                )}
                
                {activeWord.exampleSentence && (
                  <div className="bg-gray-50 p-6 rounded-3xl mb-8 border border-gray-100">
                    <p className="text-gray-600 italic leading-relaxed">"{activeWord.exampleSentence}"</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="w-full justify-center" disabled>
                    <Edit2 size={16} className="mr-2" /> Edit
                  </Button>
                  <Button variant="secondary" className="w-full justify-center text-red-500 border-red-100 hover:bg-red-50" onClick={() => handleDeleteWord(activeWord.id)}>
                    <Trash2 size={16} className="mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Reuse GenerateView from original file (no logic changes needed)
function GenerateView({ words, onGenerate }: { words: Word[], onGenerate: (opts: GenerateOptions) => void }) {
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [type, setType] = useState<TextType>(TextType.PARAGRAPH);
  const language = 'English';
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleWord = (id: string) => {
    setSelectedWordIds(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const handleRun = async () => {
    setIsGenerating(true);
    await onGenerate({ type, language, length, selectedWordIds });
    setIsGenerating(false);
  };

  const selectAll = () => setSelectedWordIds(words.map(w => w.id));
  const clearSelection = () => setSelectedWordIds([]);

  // keep same UI, but avoid TS prop mismatch without changing behavior
  const SelectAny = Select as any;

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      <div className="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
        <div>
          <h1 className="text-3xl font-extrabold text-dark-900 tracking-tight">Generate</h1>
          <p className="text-dark-400">Configure your practice session.</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100 space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-bold text-dark-800 ml-2 block">Format</label>
            <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1 rounded-2xl">
              {[TextType.PARAGRAPH, TextType.DIALOG, TextType.STORY].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    type === t ? 'bg-white shadow-sm text-dark-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <SelectAny label="Target Language" value={language} onChange={() => {}} options={AVAILABLE_LANGUAGES} />

            <label className="text-sm font-bold text-dark-800 ml-2 block">Length</label>
            <div className="flex gap-4">
              {['short', 'medium', 'long'].map((l) => (
                <label key={l} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${length === l ? 'border-brand-500' : 'border-gray-300'}`}>
                    {length === l && <div className="w-3 h-3 bg-brand-500 rounded-full" />}
                  </div>
                  <span className={`text-sm capitalize font-medium ${length === l ? 'text-dark-900' : 'text-gray-400'}`}>{l}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100 flex-1 flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-bold text-dark-800 ml-2">Vocabulary ({selectedWordIds.length})</label>
            <div className="text-xs space-x-2">
              <button onClick={selectAll} className="text-brand-600 font-bold hover:underline">All</button>
              <span className="text-gray-300">|</span>
              <button onClick={clearSelection} className="text-gray-400 hover:text-gray-600">None</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {words.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-10">Word bag is empty.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {words.map(w => {
                  const isSelected = selectedWordIds.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      onClick={() => toggleWord(w.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        isSelected 
                          ? 'bg-brand-500 border-brand-500 text-dark-900 shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-brand-300'
                      }`}
                    >
                      {w.word}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col">
        <div className="flex-1 bg-white rounded-[2.5rem] shadow-soft border border-gray-100 p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
          {isGenerating ? (
            <div className="text-center z-10">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Sparkles size={40} className="text-brand-600 animate-spin-slow" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-2">Weaving your story...</h3>
              <p className="text-gray-500">Integrating {selectedWordIds.length} vocabulary words.</p>
            </div>
          ) : (
            <div className="text-center z-10 max-w-md">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                <PenTool size={32} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-2">Ready to create</h3>
              <p className="text-gray-500 mb-8">Select your settings and vocabulary words on the left, then click generate to see the magic happen.</p>
              <Button 
                size="lg" 
                onClick={handleRun} 
                disabled={selectedWordIds.length === 0}
                className="w-full shadow-glow"
              >
                <Sparkles className="mr-2" size={20}/> Generate {type}
              </Button>
            </div>
          )}
          
          <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-10 right-10 w-32 h-32 bg-brand-200 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
