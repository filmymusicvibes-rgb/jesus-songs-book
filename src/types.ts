export interface Song {
  id: string;
  title: string;
  lyrics: string;
  category: 'Worship' | 'Prayer' | 'Youth' | 'Classical';
  letter: string;
  audioUrl?: string;
  createdAt?: string;
}

export interface UserFavorite {
  id: string;
  userId: string;
  songId: string;
  createdAt: string;
}
