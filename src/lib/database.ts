import { Pool } from 'pg';

// Database configuration from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Database helper functions
export const db = {
  // User operations
  async createUser(userData: {
    email: string;
    passwordHash: string;
    name: string;
    gender: string;
    age: number;
    height: number;
    weight: number;
    activityLevel: string;
    goal: string;
    dailyCalories: number;
    dailyProtein: number;
    dailyFat: number;
    dailyCarbs: number;
  }) {
    const query = `
      INSERT INTO users (email, password_hash, name, gender, age, height, weight, activity_level, goal, daily_calories, daily_protein, daily_fat, daily_carbs)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, email, name, gender, age, height, weight, activity_level, goal, daily_calories, daily_protein, daily_fat, daily_carbs
    `;
    const values = [
      userData.email,
      userData.passwordHash,
      userData.name,
      userData.gender,
      userData.age,
      userData.height,
      userData.weight,
      userData.activityLevel,
      userData.goal,
      userData.dailyCalories,
      userData.dailyProtein,
      userData.dailyFat,
      userData.dailyCarbs
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getUserByEmail(email: string) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async getUserById(id: number) {
    const query = 'SELECT id, email, name, gender, age, height, weight, activity_level, goal, daily_calories, daily_protein, daily_fat, daily_carbs FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Daily log operations
  async getDailyLog(userId: number, date: string) {
    const query = 'SELECT * FROM daily_logs WHERE user_id = $1 AND date = $2';
    const result = await pool.query(query, [userId, date]);
    return result.rows[0];
  },

  async createDailyLog(userId: number, date: string) {
    const query = `
      INSERT INTO daily_logs (user_id, date, total_calories, total_protein, total_fat, total_carbs)
      VALUES ($1, $2, 0, 0, 0, 0)
      RETURNING *
    `;
    const result = await pool.query(query, [userId, date]);
    return result.rows[0];
  },

  async updateDailyLog(logId: number, totals: {
    totalCalories: number;
    totalProtein: number;
    totalFat: number;
    totalCarbs: number;
    weight?: number;
  }) {
    const query = `
      UPDATE daily_logs 
      SET total_calories = $1, total_protein = $2, total_fat = $3, total_carbs = $4, weight = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      totals.totalCalories,
      totals.totalProtein,
      totals.totalFat,
      totals.totalCarbs,
      totals.weight || null,
      logId
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Meal operations
  async createMeal(mealData: {
    userId: number;
    dailyLogId: number;
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    grams?: number;
    category: string;
  }) {
    const query = `
      INSERT INTO meals (user_id, daily_log_id, name, calories, protein, fat, carbs, grams, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      mealData.userId,
      mealData.dailyLogId,
      mealData.name,
      mealData.calories,
      mealData.protein,
      mealData.fat,
      mealData.carbs,
      mealData.grams,
      mealData.category
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getMealsByDailyLog(dailyLogId: number) {
    const query = 'SELECT * FROM meals WHERE daily_log_id = $1 ORDER BY meal_time DESC';
    const result = await pool.query(query, [dailyLogId]);
    return result.rows;
  },

  // Favorite meals operations
  async createFavoriteMeal(mealData: {
    userId: number;
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    grams?: number;
  }) {
    const query = `
      INSERT INTO favorite_meals (user_id, name, calories, protein, fat, carbs, grams)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id, name) DO NOTHING
      RETURNING *
    `;
    const values = [
      mealData.userId,
      mealData.name,
      mealData.calories,
      mealData.protein,
      mealData.fat,
      mealData.carbs,
      mealData.grams
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getFavoriteMeals(userId: number) {
    const query = 'SELECT * FROM favorite_meals WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Test connection
  async testConnection() {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('Database connected successfully:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }
};

export default db;
