 export const createDbIfNeeded = async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS game (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_initials TEXT
      );
    `);
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS rounds (
        game_id INTEGER,
        choice TEXT,
        result TEXT,
        scores TEXT,
        FOREIGN KEY(game_id) REFERENCES game(id)
      );
    `);
  };