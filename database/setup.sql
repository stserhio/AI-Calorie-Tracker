-- Calorie Tracker Database Setup
-- Run this in PostgreSQL to create all tables

-- Create database (run as superuser)
-- CREATE DATABASE calorietracker;
-- CREATE USER app_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE calorietracker TO app_user;

-- Connect to calorietracker database first
-- \c calorietracker;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    age INTEGER CHECK (age >= 16 AND age <= 80),
    height INTEGER CHECK (height >= 100 AND height <= 250), -- in cm
    weight DECIMAL(5,2) CHECK (weight >= 30 AND weight <= 300), -- in kg
    activity_level VARCHAR(20) CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very-active')),
    goal VARCHAR(10) CHECK (goal IN ('lose', 'maintain', 'gain')),
    daily_calories INTEGER NOT NULL,
    daily_protein DECIMAL(5,1) NOT NULL,
    daily_fat DECIMAL(5,1) NOT NULL,
    daily_carbs DECIMAL(5,1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily logs table
CREATE TABLE daily_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_calories INTEGER DEFAULT 0,
    total_protein DECIMAL(5,1) DEFAULT 0,
    total_fat DECIMAL(5,1) DEFAULT 0,
    total_carbs DECIMAL(5,1) DEFAULT 0,
    weight DECIMAL(5,2), -- optional daily weight tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date) -- One log per user per day
);

-- Meals table
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    daily_log_id INTEGER REFERENCES daily_logs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    calories INTEGER NOT NULL,
    protein DECIMAL(5,1) NOT NULL,
    fat DECIMAL(5,1) NOT NULL,
    carbs DECIMAL(5,1) NOT NULL,
    grams DECIMAL(5,2),
    category VARCHAR(10) CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack')),
    meal_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorite meals table
CREATE TABLE favorite_meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    calories INTEGER NOT NULL,
    protein DECIMAL(5,1) NOT NULL,
    fat DECIMAL(5,1) NOT NULL,
    carbs DECIMAL(5,1) NOT NULL,
    grams DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name) -- Prevent duplicates
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, date);
CREATE INDEX idx_meals_user_log ON meals(user_id, daily_log_id);
CREATE INDEX idx_meals_time ON meals(meal_time);
CREATE INDEX idx_favorite_meals_user ON favorite_meals(user_id);

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON daily_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO users (email, password_hash, name, gender, age, height, weight, activity_level, goal, daily_calories, daily_protein, daily_fat, daily_carbs) VALUES
('test@example.com', '$2b$10$example_hash', 'Test User', 'male', 25, 180, 75, 'moderate', 'maintain', 2500, 150, 83, 250);

-- Sample daily log
INSERT INTO daily_logs (user_id, date, total_calories, total_protein, total_fat, total_carbs) VALUES
(1, CURRENT_DATE, 1200, 80, 45, 150);

-- Sample meals
INSERT INTO meals (user_id, daily_log_id, name, calories, protein, fat, carbs, grams, category) VALUES
(1, 1, 'Oatmeal with berries', 350, 12, 8, 60, 250, 'breakfast'),
(1, 1, 'Grilled chicken salad', 450, 35, 20, 30, 300, 'lunch'),
(1, 1, 'Greek yogurt', 150, 15, 5, 20, 150, 'snack');

-- Sample favorite meals
INSERT INTO favorite_meals (user_id, name, calories, protein, fat, carbs, grams) VALUES
(1, 'Protein Smoothie', 300, 25, 10, 35, 400),
(1, 'Avocado Toast', 280, 8, 18, 30, 120);
