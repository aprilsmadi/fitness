const sqlite3 = require('sqlite3').verbose(); 

const db = new sqlite3.Database('./workouts.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database opened successfully!');


    db.run(`
      CREATE TABLE IF NOT EXISTS workouts (
        workout_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_name TEXT NOT NULL,
        category TEXT,
        difficulty TEXT,
        duration INTEGER,
        calories INTEGER,
        primary_muscle TEXT,
        tips TEXT,
        description TEXT
      );
    `, (err) => {
      if (err) {
        console.error('Error creating workouts table:', err);
      } else {
        console.log('Workouts table created successfully!');

        // Insert workout data, checking for duplicates
        const workouts = [
          ['Push-ups', 'Strength', 'Medium', 300, 50, 'Chest', 'Keep your back straight and core tight.', 'A classic upper body exercise that targets the chest, shoulders, and triceps.'],
          ['Squats', 'Strength', 'Easy', 120, 40, 'Legs', 'Keep your knees behind your toes and squat deeply.', 'A lower body workout targeting the quads, hamstrings, and glutes.'],
          ['Jumping Jacks', 'Cardio', 'Easy', 60, 20, 'Full Body', 'Jump with your legs and arms wide, then return to start position.', 'A simple cardio exercise that helps improve cardiovascular fitness.'],
          ['Burpees', 'Strength', 'Hard', 180, 120, 'Full Body', 'Ensure you jump high and keep your core engaged.', 'A high-intensity full-body exercise that targets multiple muscle groups.']
        ];

        workouts.forEach((workout) => {
          const checkQuery = `SELECT * FROM workouts WHERE workout_name = ?`;

          // Check if the workout already exists
          db.get(checkQuery, [workout[0]], (err, row) => {
            if (err) {
              console.error('Error checking for existing workout:', err);
            } else if (!row) {  
              const insertQuery = `
                INSERT INTO workouts (workout_name, category, difficulty, duration, calories, primary_muscle, tips, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `;
              db.run(insertQuery, workout, (err) => {
                if (err) {
                  console.error('Error inserting workout:', err);
                } else {
                  console.log(`${workout[0]} inserted successfully!`);
                }
              });
            } else {
              console.log(`${workout[0]} already exists, skipping insertion.`);
            }
          });
        });
      }
    });  db.run(`
      CREATE TABLE IF NOT EXISTS workout_sessions (
        session_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,  
        workout_id INTEGER,  
        start_time DATETIME DEFAULT CURRENT_TIMESTAMP,  
        end_time DATETIME,  -- Session end time
        status TEXT,  -- Status of the workout session (e.g., 'completed', 'paused', 'failed')
        FOREIGN KEY (user_id) REFERENCES users(user_id)  ON DELETE CASCADE ,
        FOREIGN KEY (workout_id) REFERENCES workouts(workout_id)  ON DELETE CASCADE
      );
    `, (err) => {
      if (err) {
        console.error('Error creating workout_sessions table:', err);
      } else {
        console.log('Workout Sessions table created successfully!');
      }
    });
  }
});
        
module.exports = db;


