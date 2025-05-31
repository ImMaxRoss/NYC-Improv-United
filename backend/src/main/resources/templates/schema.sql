-- Schema.sql
-- Create database if it doesn't exist
DROP DATABASE IF EXISTS improvcoach;

CREATE DATABASE IF NOT EXISTS improvcoach;
USE improvcoach;

-- Create coaches table
CREATE TABLE IF NOT EXISTS coaches (
    coach_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    bio TEXT,
    experience TEXT,
    certifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- INSERT INTO coaches (email, password, first_name, last_name) VALUES
-- ('johndoe@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', 'John', 'Doe');

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    team_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TEXT,
    coach_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE CASCADE,
    INDEX idx_coach_id (coach_id)
);

-- Create performers table (contacts)
CREATE TABLE IF NOT EXISTS performers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coach_id BIGINT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE CASCADE,
    INDEX idx_coach_id (coach_id),
    INDEX idx_name (first_name, last_name)
);

-- Create performer_teams junction table
CREATE TABLE IF NOT EXISTS performer_teams (
    performer_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    joined_date DATE DEFAULT (CURRENT_DATE),
    PRIMARY KEY (performer_id, team_id),
    FOREIGN KEY (performer_id) REFERENCES performers(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);

-- Create focus_areas table
CREATE TABLE IF NOT EXISTS focus_areas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color_code VARCHAR(7) -- Hex color code
);

-- Insert default focus areas
INSERT INTO focus_areas (name, description, color_code) VALUES
('Yes And', 'Building on ideas and accepting offers', '#4CAF50'),
('Agreement', 'Finding shared reality and understanding', '#2196F3'),
('Who/What/Where', 'Establishing context and environment', '#FF9800'),
('Physicality', 'Using body and space effectively', '#9C27B0'),
('Listening', 'Active attention and responsiveness', '#F44336'),
('Commitment', 'Full engagement and follow-through', '#3F51B5'),
('Avoidance of Denial', 'Accepting and building reality', '#009688'),
('Identification of Game', 'Noticing the unusual thing', '#795548'),
('Resting the Game', 'Patiently resting game', '#795548'),
('Heightening', 'Heightening the game', '#795548'),
('Exploration', 'Exploring the game', '#795548'),
('Top of Intelligence', 'Top of intelligence reactions', '#795548'),
('Justification', 'Justifying obserdity in believable ways', '#795548'),
('Framing', 'Clearly communicating unusual and out of norm behaviors', '#795548'),
('Labeling', 'Boiling down game and concisely summarizing the game with dialogue for your teammates', '#795548');

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    minimum_duration_minutes INT DEFAULT 5,
    created_by_coach_id BIGINT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_coach_id) REFERENCES coaches(coach_id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_public (is_public)
);

-- Create exercise_focus_areas junction table
CREATE TABLE IF NOT EXISTS exercise_focus_areas (
    exercise_id BIGINT NOT NULL,
    focus_area_id BIGINT NOT NULL,
    PRIMARY KEY (exercise_id, focus_area_id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    FOREIGN KEY (focus_area_id) REFERENCES focus_areas(id) ON DELETE CASCADE
);

-- Create evaluation_templates table
CREATE TABLE IF NOT EXISTS evaluation_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    exercise_id BIGINT,
    created_by_coach_id BIGINT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_coach_id) REFERENCES coaches(coach_id) ON DELETE SET NULL,
    INDEX idx_exercise (exercise_id)
);

-- Create evaluation_criteria table
CREATE TABLE IF NOT EXISTS evaluation_criteria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluation_template_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    max_score INT DEFAULT 4,
    focus_area_id BIGINT,
    order_index INT DEFAULT 0,
    FOREIGN KEY (evaluation_template_id) REFERENCES evaluation_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (focus_area_id) REFERENCES focus_areas(id) ON DELETE SET NULL,
    INDEX idx_template (evaluation_template_id)
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coach_id BIGINT NOT NULL,
    team_id BIGINT,
    name VARCHAR(100),
    scheduled_date DATETIME,
    total_duration_minutes INT,
    is_template BOOLEAN DEFAULT false,
    workshop_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    INDEX idx_coach_date (coach_id, scheduled_date),
    INDEX idx_template (is_template)
);

-- Create lesson_exercises junction table
CREATE TABLE IF NOT EXISTS lesson_exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lesson_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    order_index INT NOT NULL,
    planned_duration_minutes INT,
    evaluation_template_id BIGINT,
    exercise_notes TEXT,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluation_template_id) REFERENCES evaluation_templates(id) ON DELETE SET NULL,
    INDEX idx_lesson_order (lesson_id, order_index)
);

-- Create practice_sessions table
CREATE TABLE IF NOT EXISTS practice_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lesson_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    current_exercise_id BIGINT,
    current_exercise_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (current_exercise_id) REFERENCES lesson_exercises(id) ON DELETE SET NULL,
    INDEX idx_lesson (lesson_id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    practice_session_id BIGINT NOT NULL,
    performer_id BIGINT NOT NULL,
    PRIMARY KEY (practice_session_id, performer_id),
    FOREIGN KEY (practice_session_id) REFERENCES practice_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (performer_id) REFERENCES performers(id) ON DELETE CASCADE
);

-- Create exercise_evaluations table
CREATE TABLE IF NOT EXISTS exercise_evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lesson_exercise_id BIGINT NOT NULL,
    practice_session_id BIGINT,
    notes TEXT,
    evaluated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_exercise_id) REFERENCES lesson_exercises(id) ON DELETE CASCADE,
    FOREIGN KEY (practice_session_id) REFERENCES practice_sessions(id) ON DELETE SET NULL,
    INDEX idx_lesson_exercise (lesson_exercise_id)
);

-- Create evaluated_performers table
CREATE TABLE IF NOT EXISTS evaluated_performers (
    exercise_evaluation_id BIGINT NOT NULL,
    performer_id BIGINT NOT NULL,
    PRIMARY KEY (exercise_evaluation_id, performer_id),
    FOREIGN KEY (exercise_evaluation_id) REFERENCES exercise_evaluations(id) ON DELETE CASCADE,
    FOREIGN KEY (performer_id) REFERENCES performers(id) ON DELETE CASCADE
);

-- Create evaluation_scores table
CREATE TABLE IF NOT EXISTS evaluation_scores (
    exercise_evaluation_id BIGINT NOT NULL,
    criterion_name VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    PRIMARY KEY (exercise_evaluation_id, criterion_name),
    FOREIGN KEY (exercise_evaluation_id) REFERENCES exercise_evaluations(id) ON DELETE CASCADE
);

-- Create practice_notes table
CREATE TABLE IF NOT EXISTS practice_notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lesson_id BIGINT NOT NULL,
    practice_session_id BIGINT,
    note_type VARCHAR(50), -- 'overall', 'exercise-specific', etc.
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (practice_session_id) REFERENCES practice_sessions(id) ON DELETE SET NULL,
    INDEX idx_lesson (lesson_id)
);

-- Keep existing evaluations table for backward compatibility
CREATE TABLE IF NOT EXISTS evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT,
    performance_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    performer_names VARCHAR(255),
    yes_and INT,
    agreement INT,
    who_what_where INT,
    physicality INT,
    listening INT,
    commitment INT,
    avoidance_of_denial INT,
    efficiency INT,
    notes TEXT,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    INDEX idx_team_date (team_id, performance_date)
);

INSERT INTO exercises (name, description, minimum_duration_minutes, created_by_coach_id, is_public, created_at, updated_at) VALUES
('Zip Zap Zop', 'A classic improv warm-up game to build focus and energy among players.', 5, NULL, true, NOW(), NOW());