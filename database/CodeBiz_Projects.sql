CREATE DATABASE codebiz_projects;
USE codebiz_projects;

-- Tech stack category table
CREATE TABLE tech_stack_category (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tscName VARCHAR(255) NOT NULL UNIQUE,
    tscDescription TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tech stack table
CREATE TABLE tech_stack (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tsName VARCHAR(255) NOT NULL,
    tsDescription TEXT,
    categoryId BIGINT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (categoryId) REFERENCES tech_stack_category(id) ON DELETE SET NULL
);
 
-- Projects table
CREATE TABLE projects (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    projName VARCHAR(255) NOT NULL,
    projDescription TEXT,
    techStackIds JSON,
    status ENUM('Planning', 'In Progress', 'Completed', 'On Hold') DEFAULT 'Planning',
    startDate DATE,
    endDate DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MOVING TO SERVICE LAYER ---
-- ALTER TABLES (add updatedAt field)

ALTER TABLE tech_stack_category
ADD COLUMN updatedAt TIMESTAMP NULL DEFAULT NULL AFTER createdAt;

ALTER TABLE tech_stack
ADD COLUMN updatedAt TIMESTAMP NULL DEFAULT NULL AFTER createdAt;

ALTER TABLE projects
ADD COLUMN updatedAt TIMESTAMP NULL DEFAULT NULL AFTER createdAt;

DELETE FROM projects;


-- MOVING JWT AUTH IMPLEMENTATION ---

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    displayName VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NULL DEFAULT NULL
);

-- Add user reference to existing projects table
ALTER TABLE projects
ADD COLUMN user_id BIGINT AFTER id,
ADD CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_projects_user ON projects(user_id);

-- DEFAULT USER OWNS ALL THE EXISTING PROJECTS
INSERT INTO users (username, password_hash, displayName) 
VALUES ('default_user', '$2a$10$defaultHashedPassword', 'Default User');

UPDATE projects 
SET user_id = (SELECT id FROM users WHERE username = 'default_user')
WHERE user_id IS NULL;