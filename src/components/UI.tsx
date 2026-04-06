import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  Home, 
  BookOpen, 
  Music, 
  Mic, 
  ChevronLeft, 
  Play, 
  Pause,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Categories', path: '/categories', icon: BookOpen },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'Search', path: '/search', icon: Search },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "p-3 rounded-full transition-all duration-300 relative group",
                isActive ? "bg-sky-500 text-white shadow-lg scale-110" : "text-gray-500 hover:text-sky-500"
              )}
            >
              <Icon size={24} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const Header = () => {
  return (
    <header className="pt-8 pb-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Jesus Songs</h1>
        <p className="text-gray-500 text-sm">Spiritual Melodies for the Soul</p>
      </div>
      <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-amber-500">
        <Music size={24} />
      </div>
    </header>
  );
};

export const SongCard = ({ song, onClick, className }: { song: any, onClick?: () => void, className?: string, key?: React.Key }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn("glass p-4 rounded-3xl cursor-pointer flex items-center gap-4 group", className)}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-sky-600 shadow-inner">
        <Music size={24} />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">{song.title}</h3>
        <p className="text-xs text-gray-500">{song.category}</p>
      </div>
      <button className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
        <Heart size={20} />
      </button>
    </motion.div>
  );
};

export const CategoryChip = ({ label, active, onClick, className }: { label: string, active?: boolean, onClick?: () => void, className?: string, key?: React.Key }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
        active 
          ? "bg-sky-500 text-white shadow-lg shadow-sky-200" 
          : "glass text-gray-600 hover:bg-white/50",
        className
      )}
    >
      {label}
    </button>
  );
};

export const AlphabetFilter = ({ activeLetter, onSelect }: { activeLetter: string, onSelect: (l: string) => void }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar px-6">
      <button
        onClick={() => onSelect('')}
        className={cn(
          "min-w-[40px] h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all",
          activeLetter === '' ? "bg-sky-500 text-white shadow-lg" : "glass text-gray-500"
        )}
      >
        All
      </button>
      {letters.map(l => (
        <button
          key={l}
          onClick={() => onSelect(l)}
          className={cn(
            "min-w-[40px] h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all",
            activeLetter === l ? "bg-sky-500 text-white shadow-lg" : "glass text-gray-500"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
};
