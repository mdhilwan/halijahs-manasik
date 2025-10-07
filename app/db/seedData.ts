import { type SQLiteDatabase } from 'expo-sqlite';

async function seedSampleData(db: SQLiteDatabase) {
  const sampleDuas = [
    {
      title: 'Dua for Travel',
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا ...',
      translation: 'Glory to Him Who has subjected this to us...',
      category: 'Hajj',
      audio: 'dua_travel.mp3',
    },
    {
      title: 'Dua for Entering Makkah',
      arabic: 'اللَّهُمَّ هَذِهِ مَكَّةُ...',
      translation: 'O Allah, this is Makkah...',
      category: 'Hajj',
      audio: 'dua_makkah.mp3',
    },
  ];

  for (const dua of sampleDuas) {
    await db.runAsync(
      `INSERT INTO duas (title, arabic, translation, category, audio)
       VALUES (?, ?, ?, ?, ?)`,
      [dua.title, dua.arabic, dua.translation, dua.category, dua.audio]
    );
  }
}

export default seedSampleData