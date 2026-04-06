import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Heart, ChevronLeft, Sparkles, Mic, Play, Pause,
  Share2, Copy, Check, Music
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { SAMPLE_SONGS } from '../sampleData';
import { Song } from '../types';
import { Header, Navbar, SongCard, CategoryChip, AlphabetFilter, cn } from '../components/UI';
import { getSmartSuggestions } from '../services/geminiService';

// Global songs state - loads from Firestore, falls back to sample
let cachedSongs: Song[] = [];
let songsLoaded = false;

async function loadSongs(): Promise<Song[]> {
  if (songsLoaded && cachedSongs.length > 0) return cachedSongs;
  try {
    const snap = await getDocs(collection(db, 'songs'));
    if (snap.docs.length > 0) {
      cachedSongs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Song));
      cachedSongs.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      cachedSongs = SAMPLE_SONGS; // Fallback if Firestore empty
    }
  } catch (e) {
    console.log('Firestore not available, using sample data');
    cachedSongs = SAMPLE_SONGS;
  }
  songsLoaded = true;
  return cachedSongs;
}

function useSongs() {
  const [songs, setSongs] = useState<Song[]>(cachedSongs.length > 0 ? cachedSongs : SAMPLE_SONGS);
  const [loading, setLoading] = useState(!songsLoaded);
  useEffect(() => {
    loadSongs().then(s => { setSongs(s); setLoading(false); });
  }, []);
  return { songs, loading };
}

// --- Home Page ---
export const Home = () => {
  const { songs, loading } = useSongs();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const categories = ['All', 'Worship', 'Prayer', 'Youth', 'Classical'];

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const catMatch = selectedCategory === 'All' || song.category === selectedCategory;
      const letterMatch = selectedLetter === 'All' || song.letter === selectedLetter || song.title.charAt(0).toUpperCase() === selectedLetter;
      return catMatch && letterMatch;
    });
  }, [songs, selectedCategory, selectedLetter]);

  const featured = songs.slice(0, 2);

  return (
    <div className="pb-32 min-h-screen">
      <Header />
      <div className="px-6">
        {/* Featured */}
        <div className="glass p-6 rounded-[32px] mb-8 shadow-xl shadow-sky-100/50">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
            <Sparkles className="text-amber-500" size={20} /> Featured Songs
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {featured.map(song => (
              <SongCard key={song.id} song={song} onClick={() => navigate(`/song/${song.id}`)} />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(c => (
            <CategoryChip key={c} label={c} active={selectedCategory === c} onClick={() => setSelectedCategory(c)} />
          ))}
        </div>

        {/* Alphabet */}
        <AlphabetFilter selected={selectedLetter} onSelect={setSelectedLetter} />

        {/* All Songs */}
        <h3 className="text-xl font-bold mt-6 mb-4 text-gray-800">
          All Songs <span className="text-sm font-normal text-gray-400">({filteredSongs.length})</span>
        </h3>
        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-gray-400 mt-3">Loading songs...</p></div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSongs.map(song => (
              <SongCard key={song.id} song={song} onClick={() => navigate(`/song/${song.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Song Detail Page ---
export const SongDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { songs } = useSongs();
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  const song = songs.find(s => s.id === id);

  useEffect(() => {
    if (song) {
      setLoadingSuggestions(true);
      getSmartSuggestions(song, songs).then(res => {
        setSuggestions(res);
        setLoadingSuggestions(false);
      });
    }
  }, [song, songs]);

  if (!song) return <div className="flex items-center justify-center h-screen"><p>Song not found</p></div>;

  const handleCopy = () => {
    navigator.clipboard.writeText(song.lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-32 min-h-screen bg-white/50">
      <div className="fixed top-0 left-0 right-0 z-10 glass px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/50 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-bold text-gray-800 truncate max-w-[200px]">{song.title}</h2>
        <div className="flex gap-2">
          <button onClick={() => setIsFavorite(!isFavorite)} className={cn("p-2 rounded-full transition-colors", isFavorite ? "text-rose-500 bg-rose-50" : "text-gray-400 hover:bg-white/50")}>
            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button onClick={handleCopy} className="p-2 rounded-full hover:bg-white/50 transition-colors text-gray-400">
            {copied ? <Check size={24} className="text-green-500" /> : <Copy size={24} />}
          </button>
        </div>
      </div>

      <div className="pt-24 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-[40px] shadow-2xl shadow-sky-100">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white shadow-xl shadow-sky-200">
              <Music size={40} />
            </div>
          </div>
          <div className="text-center mb-8">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-600 text-xs font-bold uppercase tracking-wider">{song.category}</span>
            <h1 className="text-3xl font-bold mt-2 text-gray-800">{song.title}</h1>
          </div>
          <div className="whitespace-pre-line text-lg leading-relaxed text-gray-700 text-center font-medium">{song.lyrics}</div>
        </motion.div>

        {/* AI Suggestions */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <Sparkles className="text-amber-500" size={24} /> Smart Suggestions
          </h3>
          {loadingSuggestions ? (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {[1, 2, 3].map(i => (<div key={i} className="min-w-[200px] h-32 glass rounded-3xl animate-pulse" />))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {suggestions.map(s => (
                <motion.div key={s.id} whileHover={{ scale: 1.05 }} onClick={() => navigate(`/song/${s.id}`)}
                  className="min-w-[200px] glass p-4 rounded-3xl cursor-pointer flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600"><Music size={20} /></div>
                  <h4 className="font-bold text-gray-800 mt-4 line-clamp-2">{s.title}</h4>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Search Page ---
export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { songs } = useSongs();

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return songs.filter(s => s.title.toLowerCase().includes(q) || s.lyrics.toLowerCase().includes(q));
  }, [query, songs]);

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) { alert("Voice search is not supported in this browser."); return; }
    // @ts-ignore
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => { setQuery(event.results[0][0].transcript); };
    recognition.start();
  };

  return (
    <div className="pb-32 min-h-screen">
      <Header />
      <div className="px-6 mb-8">
        <div className="relative">
          <input type="text" placeholder="Search by name or lyrics..." value={query} onChange={(e) => setQuery(e.target.value)}
            className="w-full glass rounded-3xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all shadow-xl" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <button onClick={handleVoiceSearch}
            className={cn("absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all", isListening ? "bg-rose-500 text-white animate-pulse" : "text-sky-500 hover:bg-sky-50")}>
            <Mic size={20} />
          </button>
        </div>
      </div>
      <div className="px-6">
        {query && (<h3 className="text-lg font-bold mb-4 text-gray-700">Search Results <span className="ml-2 text-sm font-normal text-gray-400">({results.length})</span></h3>)}
        <div className="grid grid-cols-1 gap-4">
          {results.map(song => (<SongCard key={song.id} song={song} onClick={() => navigate(`/song/${song.id}`)} />))}
          {query && results.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><Search size={40} /></div>
              <p className="text-gray-500">No songs found matching "{query}"</p>
            </div>
          )}
          {!query && (<div className="text-center py-20"><p className="text-gray-400 italic">Start typing to find your favorite songs...</p></div>)}
        </div>
      </div>
    </div>
  );
};

// --- Favorites Page ---
export const Favorites = () => {
  const navigate = useNavigate();
  const { songs } = useSongs();
  const [favIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]'); } catch { return []; }
  });
  const favorites = songs.filter(s => favIds.includes(s.id));

  return (
    <div className="pb-32 min-h-screen">
      <Header />
      <div className="px-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <Heart className="text-rose-500" size={28} fill="currentColor" /> My Favorites
        </h3>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {favorites.map(song => (<SongCard key={song.id} song={song} onClick={() => navigate(`/song/${song.id}`)} />))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-[40px] p-10">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-300"><Heart size={40} /></div>
            <h4 className="text-xl font-bold text-gray-700 mb-2">No Favorites Yet</h4>
            <p className="text-gray-500">Songs you heart will appear here.</p>
            <button onClick={() => navigate('/')} className="mt-6 px-8 py-3 bg-sky-500 text-white rounded-full font-bold shadow-lg shadow-sky-200 hover:scale-105 transition-transform">Browse Songs</button>
          </div>
        )}
      </div>
    </div>
  );
};
