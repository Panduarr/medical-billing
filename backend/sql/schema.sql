CREATE DATABASE IF NOT EXISTS medical_quotes;

USE medical_quotes;

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    providers VARCHAR(50) NOT NULL,
    practice_type VARCHAR(100) NOT NULL,
    software_type VARCHAR(150) NOT NULL,
    features VARCHAR(150) NOT NULL,
    timeline VARCHAR(100) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    timezone VARCHAR(100) NOT NULL,
    google_event_id VARCHAR(255),
    meet_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
