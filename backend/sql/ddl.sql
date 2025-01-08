
-- Create User table
CREATE TABLE user_table (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    oauth_provider VARCHAR(20),
    balance DECIMAL(10,2) DEFAULT 0.00,
    payment_method VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    simulation_id INT NULL,
    role VARCHAR(20) DEFAULT 'user',
    last_login DATETIME 
);


-- Create City table
CREATE TABLE City (
    city_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    boundaries POLYGON NOT NULL
);

-- Create Scooter table
CREATE TABLE Scooter (
    scooter_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    city_id INT NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    battery_level DECIMAL(5, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    needs_service BOOLEAN DEFAULT FALSE,
    is_charging BOOLEAN DEFAULT FALSE,
    last_maintenance DATETIME,
    speed INT DEFAULT 0,
    simulation_id INT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (city_id) REFERENCES City(city_id),
    FOREIGN KEY (user_id) REFERENCES user_table(user_id)
);


-- Create ChargingStation table
CREATE TABLE ChargingStation (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    location POINT NOT NULL,
    capacity INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES City(city_id)
);

-- Create ParkingZone table
CREATE TABLE ParkingZone (
    zone_id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    boundaries POLYGON NOT NULL,
    zone_type VARCHAR(50) NOT NULL,
    parking_fee DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (city_id) REFERENCES City(city_id)
);

-- Create Trip table
CREATE TABLE Trip (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scooter_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    start_location POINT NOT NULL,
    end_location POINT,
    distance DECIMAL(10,2),
    cost DECIMAL(10,2),
    time_fee DECIMAL(10,2),
    parking_fee DECIMAL(10,2),
    payment_status VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_table(user_id),
    FOREIGN KEY (scooter_id) REFERENCES Scooter(scooter_id)
);

-- Create ScooterLog table
CREATE TABLE ScooterLog (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    scooter_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    location POINT NOT NULL,
    speed DECIMAL(5,2),
    battery_level DECIMAL(5,2) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (scooter_id) REFERENCES Scooter(scooter_id)
);

CREATE TABLE RecentTrips (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scooter_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    start_location POINT NOT NULL,
    end_location POINT,
    distance DECIMAL(10,2),
    cost DECIMAL(10,2),
    time_fee DECIMAL(10,2),
    parking_fee DECIMAL(10,2),
    payment_status VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_table(user_id),
    FOREIGN KEY (scooter_id) REFERENCES Scooter(scooter_id)
);


-- CREATE PROCEDURE get_user_data (IN email VARCHAR(100))
-- BEGIN
--     SELECT u.*, t.*
--     FROM user_table u
--     LEFT JOIN Trip t ON u.user_id = t.user_id
--     WHERE u.email = email
--     ORDER BY t.start_time DESC
--     LIMIT 10;
-- END //

-- -- Återställ delimiter till semikolon
-- DELIMITER ;

-- Create indexes for better query performance
CREATE INDEX idx_scooter_city ON Scooter(city_id);
CREATE INDEX idx_station_city ON ChargingStation(city_id);
CREATE INDEX idx_zone_city ON ParkingZone(city_id);
CREATE INDEX idx_trip_user ON Trip(user_id);
CREATE INDEX idx_trip_scooter ON Trip(scooter_id);
CREATE INDEX idx_log_scooter ON ScooterLog(scooter_id);
CREATE INDEX idx_trip_times ON Trip(start_time, end_time);
CREATE INDEX idx_scooter_log_timestamp ON ScooterLog(timestamp);