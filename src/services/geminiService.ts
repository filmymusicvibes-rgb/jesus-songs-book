import { GoogleGenAI } from "@google/genai";
import { Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getSmartSuggestions = async (currentSong: Song, allSongs: Song[]): Promise<Song[]> => {
  try {
    const prompt = `Given the song "${currentSong.title}" in the category "${currentSong.category}", suggest 3 similar songs from this list: ${allSongs.map(s => s.title).join(', ')}. Return only the titles as a comma-separated list.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const suggestedTitles = response.text?.split(',').map(t => t.trim()) || [];
    return allSongs.filter(s => suggestedTitles.includes(s.title) && s.id !== currentSong.id).slice(0, 3);
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return [];
  }
};
