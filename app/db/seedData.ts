import { type SQLiteDatabase } from 'expo-sqlite';

async function seedSampleData(db: SQLiteDatabase) {
  const sampleDuas = [
    {
      title: 'Talbiyah',
      arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْك',
      translation: "Here I am, O Allah, here I am",
      category: 'Hajj',
      audio: 'talbiyah.mp3',
    },
  ];

  const rows = await db.getAllAsync("SELECT * FROM duas;");
  console.log("Current duas: ", rows);

  if (rows.length === 0) {
    for (const dua of sampleDuas) {
      console.log('seeding...', dua.title)
      await db.runAsync(
        "INSERT INTO duas (title, arabic, translation, category, audio) VALUES (?, ?, ?, ?, ?);",
        [
          "Talbiyah",
          "لَبَّيْكَ اللَّهُمَّ لَبَّيْك",
          "Here I am, O Allah, here I am",
          "hajj",
          "talbiyah.mp3",
        ]
      );
    }
  }

  // await db.withTransactionAsync(async () => {
  //   for (const dua of sampleDuas) {
  //     await db.runAsync(
  //       `INSERT INTO duas (title, arabic, translation, category, audio) VALUES (?, ?, ?, ?, ?)`,
  //       [dua.title, dua.arabic, dua.translation, dua.category, dua.audio]
  //     );
  //   }
  // });
}

export default seedSampleData