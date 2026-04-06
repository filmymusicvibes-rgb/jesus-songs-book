import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MapPin, ChevronRight, Music } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleAddressTap = () => {
    const count = tapCount + 1;
    setTapCount(count);
    if (count >= 5) { navigate('/admin'); setTapCount(0); }
    setTimeout(() => setTapCount(0), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-48 h-48 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-200/30 rounded-full blur-3xl" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute text-emerald-300/15 text-2xl animate-bounce" style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i * 0.5}s` }}>♪</div>
        ))}
      </div>

      <div className={`relative z-10 max-w-md mx-auto px-6 py-4 flex flex-col items-center min-h-screen transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Bible Verse */}
        <div className="text-center mb-8 mt-4">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl px-5 py-4 border border-emerald-200/50 shadow-lg shadow-emerald-100/30">
            <p className="text-emerald-800/80 text-xs leading-relaxed italic font-medium">
              "Hen mandrengmadta-hen sikkoi ja GAMANGtungan apsele kanenan kentai; hen m'engtain sikkoi ja Kitung-hen apsele senkendratai."
            </p>
            <p className="text-emerald-600 text-xs font-bold mt-2">— Sanenken 104:33</p>
          </div>
        </div>

        {/* Vishwa Vani - Text Only */}
        <div className="flex flex-col items-center mb-3">
          <h2 className="text-3xl font-bold italic bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent" style={{ fontFamily: "'Georgia', serif" }}>
            Vishwa Vani
          </h2>
          <p className="text-emerald-400 text-[11px] italic mt-1">Reaching the regions beyond</p>
        </div>

        {/* Book Title */}
        <div className="text-center mb-6 mt-2">
          <h3 className="text-emerald-600 text-lg font-semibold italic mb-1" style={{ fontFamily: "'Georgia', serif" }}>
            Derna Daidna Maranji
          </h3>
          <h1 className="text-3xl font-extrabold text-emerald-900 tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>
            A KENKENNANJI
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto mt-3" />
        </div>

        {/* Song Book Card */}
        <div className="w-full bg-gradient-to-br from-white/60 to-emerald-50/60 backdrop-blur-xl rounded-[32px] p-6 border border-emerald-200/50 shadow-2xl shadow-emerald-100/50 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-300/50">
              <Music className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-center text-emerald-700 text-sm font-medium mb-5">
            Spiritual Songs Collection<br />
            <span className="text-emerald-500 text-xs">Praise & Worship Melodies for the Soul</span>
          </p>
          <button onClick={() => navigate('/songs')}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-300/50 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
            <BookOpen className="w-6 h-6" /> Open Songs <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Address - SECRET: Tap 5 times for Admin */}
        <div className="text-center mt-auto pb-6" onClick={handleAddressTap}>
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-5 py-3 border border-emerald-100/50 select-none cursor-default">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-700 text-xs font-bold italic" style={{ fontFamily: "'Georgia', serif" }}>Vishwa Vani</span>
            </div>
            <p className="text-emerald-600/70 text-[10px] leading-relaxed">
              Atchapuvalasa Village, Veeraghattam Mandal,<br />
              Parvathipuram Manyam Dist. - 532460,<br />
              Andhra Pradesh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
