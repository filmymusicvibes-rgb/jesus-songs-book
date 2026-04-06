import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Song } from '../types';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Music, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = 'bharos2026';
const CATEGORIES: Song['category'][] = ['Worship', 'Prayer', 'Youth', 'Classical'];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSong, setNewSong] = useState({ title: '', lyrics: '', category: 'Worship' as Song['category'], letter: 'A', audioUrl: '' });

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'songs'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Song));
      data.sort((a, b) => a.title.localeCompare(b.title));
      setSongs(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { if (isAuth) fetchSongs(); }, [isAuth]);

  const handleAdd = async () => {
    if (!newSong.title.trim() || !newSong.lyrics.trim()) return alert('Title and Lyrics required!');
    try {
      const songData = { ...newSong, letter: newSong.title.charAt(0).toUpperCase(), createdAt: new Date().toISOString() };
      await addDoc(collection(db, 'songs'), songData);
      setNewSong({ title: '', lyrics: '', category: 'Worship', letter: 'A', audioUrl: '' });
      setIsAdding(false);
      fetchSongs();
    } catch (e) { console.error(e); alert('Error adding song'); }
  };

  const handleUpdate = async () => {
    if (!editingSong) return;
    try {
      const { id, ...data } = editingSong;
      data.letter = data.title.charAt(0).toUpperCase();
      await updateDoc(doc(db, 'songs', id), data as any);
      setEditingSong(null);
      fetchSongs();
    } catch (e) { console.error(e); alert('Error updating song'); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteDoc(doc(db, 'songs', id));
      fetchSongs();
    } catch (e) { console.error(e); alert('Error deleting song'); }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-sm border border-white/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><Music className="w-8 h-8 text-white" /></div>
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
            <p className="text-white/60 text-sm mt-1">Jesus Songs Book</p>
          </div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && setIsAuth(true)}
            placeholder="Enter admin password" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 mb-4 outline-none focus:border-amber-400" />
          <button onClick={() => password === ADMIN_PASSWORD ? setIsAuth(true) : alert('Wrong password!')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:scale-105 transition-transform">Login</button>
        </div>
      </div>
    );
  }

  const filtered = songs.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-white/10 hover:bg-white/20"><ArrowLeft className="w-5 h-5" /></button>
            <div><h1 className="text-xl font-bold">Admin Panel</h1><p className="text-white/50 text-xs">{songs.length} songs</p></div>
          </div>
          <button onClick={() => { setIsAdding(true); setEditingSong(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 font-semibold text-sm hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" /> Add Song
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search songs..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 outline-none focus:border-amber-400" />
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingSong) && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editingSong ? '✏️ Edit Song' : '➕ Add New Song'}</h3>
              <button onClick={() => { setIsAdding(false); setEditingSong(null); }} className="p-1 rounded-lg bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <input value={editingSong?.title ?? newSong.title} onChange={e => editingSong ? setEditingSong({...editingSong, title: e.target.value}) : setNewSong({...newSong, title: e.target.value})}
                placeholder="Song Title" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-amber-400" />
              <select value={editingSong?.category ?? newSong.category} onChange={e => { const v = e.target.value as Song['category']; editingSong ? setEditingSong({...editingSong, category: v}) : setNewSong({...newSong, category: v}); }}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400 [&>option]:bg-slate-800">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea value={editingSong?.lyrics ?? newSong.lyrics} onChange={e => editingSong ? setEditingSong({...editingSong, lyrics: e.target.value}) : setNewSong({...newSong, lyrics: e.target.value})}
                placeholder="Paste lyrics here..." rows={10} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-amber-400 resize-y font-mono text-sm leading-relaxed" />
              <input value={editingSong?.audioUrl ?? newSong.audioUrl} onChange={e => editingSong ? setEditingSong({...editingSong, audioUrl: e.target.value}) : setNewSong({...newSong, audioUrl: e.target.value})}
                placeholder="Audio URL (optional)" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-amber-400" />
              <button onClick={editingSong ? handleUpdate : handleAdd}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> {editingSong ? 'Update Song' : 'Save Song'}
              </button>
            </div>
          </div>
        )}

        {/* Songs List */}
        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-white/50 mt-3">Loading songs...</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12"><Music className="w-12 h-12 text-white/20 mx-auto mb-3" /><p className="text-white/50">{searchTerm ? 'No matching songs' : 'No songs yet. Click "Add Song" to start!'}</p></div>
        ) : (
          <div className="space-y-2">
            {filtered.map(song => (
              <div key={song.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">{song.letter || song.title.charAt(0)}</span>
                      <div className="min-w-0">
                        <h4 className="font-semibold truncate">{song.title}</h4>
                        <p className="text-xs text-white/40">{song.category} • {song.lyrics.split('\n').length} lines</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingSong(song); setIsAdding(false); }} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(song.id, song.title)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
