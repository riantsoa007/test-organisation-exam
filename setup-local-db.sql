-- Database setup for local development
-- Run this in MySQL/MariaDB as root user

CREATE DATABASE IF NOT EXISTS exam_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'exam_user'@'localhost' IDENTIFIED BY 'exam_password';
GRANT ALL PRIVILEGES ON exam_management.* TO 'exam_user'@'localhost';
FLUSH PRIVILEGES;

USE exam_management;

-- Create exam table
CREATE TABLE IF NOT EXISTS exam (
    id INT AUTO_INCREMENT NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

-- Insert sample data
INSERT INTO exam (student_name, location, date, time, status) VALUES
('Isabelle.S', NULL, '2024-12-20', '14:00:00', 'En recherche de place'),
('Franciska.S', 'Martinique-B', '2024-12-18', '14:00:00', 'Confirmé'),
('Lucas.R', 'Martinique-B', '2024-12-23', '17:00:00', 'À organiser'),
('Léo.C', 'Martinique-B', '2024-12-26', '13:00:00', 'Annulé'),
('Raphaël.B', NULL, '2024-12-30', '09:00:00', 'En recherche de place'),
('Thibault.V', NULL, '2025-01-05', '11:00:00', 'En recherche de place'),
('Olivia.J', NULL, '2024-12-16', '10:00:00', 'Annulé');

SELECT 'Database setup completed successfully!' as message;