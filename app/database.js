// import * as SQLite from 'expo-sqlite';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

// const openDatabaseAsync = () => {
//     return new Promise((resolve, reject) => {
//         try {
//             const db = SQLite.openDatabase('zole_scores.db');
//             resolve(db);
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

// const db = await SQLite.openDatabaseAsync('zole_scores.db');


// export const createTable = async () => {
//     console.log('Starting createTable...');

//     // Wrap the transaction in a Promise to work with async/await
//     await new Promise((resolve, reject) => {
//         db.transaction(tx => {
//             // First SQL operation
//             tx.executeSql(
//                 `CREATE TABLE IF NOT EXISTS games (
//                     id INTEGER PRIMARY KEY AUTOINCREMENT,
//                     players TEXT,
//                     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//                 );`,
//                 [],
//                 () => {
//                     console.log('Games table created successfully');
//                 },
//                 (_, error) => {
//                     console.error('Error creating games table:', error);
//                     reject(error); // Reject the promise if there's an error
//                     return false;
//                 }
//             );

//             // Second SQL operation
//             tx.executeSql(
//                 `CREATE TABLE IF NOT EXISTS rounds (
//                     id INTEGER PRIMARY KEY AUTOINCREMENT,
//                     game_id INTEGER,
//                     round_number INTEGER,
//                     player_choices TEXT,
//                     results TEXT,
//                     scores INTEGER,
//                     FOREIGN KEY(game_id) REFERENCES games(id)
//                 );`,
//                 [],
//                 () => {
//                     console.log('Rounds table created successfully');
//                 },
//                 (_, error) => {
//                     console.error('Error creating rounds table:', error);
//                     reject(error); // Reject the promise if there's an error
//                     return false;
//                 }
//             );
//         }, (error) => {
//             reject(error); // Reject the promise if the transaction fails
//         }, () => {
//             resolve(); // Resolve the promise once the transaction is complete
//         });
//     });

//     console.log('Finished createTable...');
// };

// export const createNewGame = (players) => {
//     console.log('Starting createNewGame...');
//     return new Promise((resolve, reject) => {
//         db.transaction(tx => {
//             tx.executeSql(
//                 `INSERT INTO games (players) VALUES (?);`,
//                 [JSON.stringify(players)],
//                 (_, result) => {
//                     resolve(result.insertId);
//                 },
//                 (_, error) => {
//                     console.error('Error creating new game:', error);
//                     reject(error);
//                 }
//             );
//         });
//     });
// };

// export const fetchInitials = () => {
//     return new Promise((resolve, reject) => {
//         db.transaction(tx => {
//             tx.executeSql(
//                 `SELECT players FROM games ORDER BY created_at DESC LIMIT 1;`,
//                 [],
//                 (_, result) => {
//                     if (result.rows.length > 0) {
//                         resolve(JSON.parse(result.rows.item(0).players));
//                     } else {
//                         resolve([]);
//                     }
//                 },
//                 (_, error) => {
//                     console.error('Error fetching initials:', error);
//                     reject(error);
//                 }
//             );
//         });
//     });
// };

// export const saveRound = (gameId, roundNumber, playerChoices, results, scores) => {
//     db.transaction(tx => {
//         tx.executeSql(
//             `INSERT INTO rounds (game_id, round_number, player_choices, results, scores) VALUES (?, ?, ?, ?, ?);`,
//             [gameId, roundNumber, JSON.stringify(playerChoices), JSON.stringify(results), JSON.stringify(scores)],
//             () => {
//                 console.log('Round saved successfully');
//             },
//             (_, error) => {
//                 console.error('Error saving round:', error);
//                 return false;
//             }
//         );
//     });
// };

// export const copyDatabaseFile = async () => {
//     const dbPath = `${FileSystem.documentDirectory}SQLite/zole_scores.db`;
//     const destinationPath = `${FileSystem.documentDirectory}zole_scores_copy.db`;

//     try {
//         await FileSystem.copyAsync({
//             from: dbPath,
//             to: destinationPath,
//         });
//         console.log('Database file copied successfully to:', destinationPath);

//         // Share the copied database file
//         await Sharing.shareAsync(destinationPath);
//     } catch (error) {
//         console.error('Error copying database file:', error);
//     }
// };



