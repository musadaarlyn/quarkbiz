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
