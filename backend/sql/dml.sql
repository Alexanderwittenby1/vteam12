-- Infoga användardata
INSERT INTO user_table (email, password, oauth_provider, balance, payment_method, is_admin, role, last_login) VALUES
('johndoe@example.com', '123', 'google', 50.00, 'credit_card', FALSE,'user', NULL),
('janedoe@example.com', '123', 'facebook', 30.00, 'paypal', FALSE,'user', NULL),
('alice@example.com', '123', 'twitter', 25.00, 'credit_card', FALSE,'user', NULL),
('bob@example.com', '123', 'google', 100.00, 'bank_transfer', FALSE,'user', NULL);

INSERT INTO City (name, boundaries) VALUES
('New York', ST_GeomFromText('POLYGON((-74.25909 40.477399, -73.700171 40.477399, -73.700171 40.917577, -74.25909 40.917577, -74.25909 40.477399))')),
('San Francisco', ST_GeomFromText('POLYGON((-123.173825 37.63983, -122.356658 37.63983, -122.356658 37.92982, -123.173825 37.92982, -123.173825 37.63983))'));

INSERT INTO Scooter (city_id, latitude, longitude, battery_level, is_available, needs_service, is_charging, last_maintenance, status)
VALUES
(1, 56.1817, 15.5901, 80.00, TRUE, FALSE, FALSE, '2025-01-05 08:00:00', 'Available'),  -- At BTH main entrance
(2, 56.1810, 15.5910, 90.00, TRUE, FALSE, FALSE, '2025-01-05 10:15:00', 'Available'),  -- Near student housing
(1, 56.1815, 15.5920, 60.00, TRUE, FALSE, FALSE, '2025-01-05 13:20:00', 'Available'),  -- Near bus stop
(2, 56.1820, 15.5915, 70.00, TRUE, FALSE, TRUE, '2025-01-05 15:55:00', 'Charging'),  -- Near charging station
(1, 56.1812, 15.5898, 40.00, TRUE, TRUE, FALSE, '2025-01-05 16:30:00', 'Needs Service'); -- Near lecture halls


INSERT INTO ChargingStation (city_id, name, location, capacity) VALUES
(1, 'Downtown Charging Hub', ST_PointFromText('POINT(-74.005 40.7128)'), 10),
(2, 'Bay Area Charging Center', ST_PointFromText('POINT(-122.4194 37.7749)'), 15);


INSERT INTO ParkingZone (city_id, name, boundaries, zone_type, parking_fee) VALUES
(1, 'Central Park Zone', ST_GeomFromText('POLYGON((-73.9654 40.7851, -73.9498 40.7851, -73.9498 40.7897, -73.9654 40.7897, -73.9654 40.7851))'), 'Public', 2.50),
(2, 'Golden Gate Zone', ST_GeomFromText('POLYGON((-122.4787 37.8085, -122.4724 37.8085, -122.4724 37.8121, -122.4787 37.8121, -122.4787 37.8085))'), 'Public', 3.00);


INSERT INTO Trip (user_id, scooter_id, start_time, end_time, start_location, end_location, distance, cost, time_fee, parking_fee, payment_status) VALUES
(1, 1, '2023-11-28 08:00:00', '2023-11-28 08:30:00', ST_PointFromText('POINT(-74.006 40.7128)'), ST_PointFromText('POINT(-74.000 40.715)'), 5.00, 15.00, 3.00, 2.00, 'Paid'),
(2, 2, '2023-11-28 09:00:00', NULL, ST_PointFromText('POINT(-73.985 40.7308)'), NULL, 0.00, 0.00, 0.00, 0.00, 'Pending'),
(1, 3, '2023-12-01 10:00:00', '2023-12-01 10:45:00', ST_PointFromText('POINT(-74.005 40.713)'), ST_PointFromText('POINT(-74.003 40.7125)'), 3.00, 12.50, 2.50, 2.00, 'Paid'),
(1, 2, '2023-12-03 11:30:00', '2023-12-03 12:00:00', ST_PointFromText('POINT(-74.010 40.716)'), ST_PointFromText('POINT(-74.005 40.717)'), 2.50, 10.00, 2.00, 1.00, 'Paid'),
(2, 3, '2023-12-05 13:00:00', '2023-12-05 13:40:00', ST_PointFromText('POINT(-73.980 40.730)'), ST_PointFromText('POINT(-73.975 40.732)'), 3.50, 14.00, 3.00, 2.00, 'Pending'),
(1, 4, '2023-12-07 14:00:00', '2023-12-07 14:25:00', ST_PointFromText('POINT(-74.002 40.710)'), ST_PointFromText('POINT(-74.005 40.7105)'), 4.00, 13.00, 2.00, 3.00, 'Paid'),
(2, 1, '2023-12-10 15:00:00', '2023-12-10 15:30:00', ST_PointFromText('POINT(-73.960 40.740)'), ST_PointFromText('POINT(-73.955 40.742)'), 6.00, 18.00, 4.00, 2.00, 'Paid'),
(1, 2, '2023-12-12 16:00:00', '2023-12-12 16:40:00', ST_PointFromText('POINT(-74.015 40.730)'), ST_PointFromText('POINT(-74.010 40.735)'), 4.50, 16.00, 3.00, 2.00, 'Paid'),
(2, 4, '2023-12-15 17:30:00', '2023-12-15 18:00:00', ST_PointFromText('POINT(-73.975 40.745)'), ST_PointFromText('POINT(-73.970 40.747)'), 5.50, 17.50, 4.00, 2.50, 'Pending'),
(1, 3, '2023-12-18 18:30:00', '2023-12-18 19:00:00', ST_PointFromText('POINT(-74.007 40.711)'), ST_PointFromText('POINT(-74.002 40.712)'), 4.00, 12.00, 2.00, 2.00, 'Paid'),
(2, 1, '2023-12-20 19:00:00', '2023-12-20 19:30:00', ST_PointFromText('POINT(-73.960 40.7405)'), ST_PointFromText('POINT(-73.955 40.7425)'), 6.50, 19.00, 4.50, 2.50, 'Paid');

INSERT INTO ScooterLog (scooter_id, timestamp, location, speed, battery_level, event_type) VALUES
(1, '2023-11-28 08:05:00', ST_PointFromText('POINT(-74.002 40.711)'), 15.00, 80.00, 'Movement'),
(2, '2023-11-28 08:15:00', ST_PointFromText('POINT(-73.980 40.728)'), 0.00, 45.25, 'Charging');

DELIMITER //
DROP PROCEDURE IF EXISTS delete_simulation;

CREATE PROCEDURE delete_simulation()
BEGIN
    DELETE FROM Scooter 
    WHERE simulation_id IS NOT NULL;
    DELETE FROM user_table
    WHERE simulation_id IS NOT NULL;
END //

DELIMITER ;

DELIMITER //

DROP PROCEDURE IF EXISTS book_bike;

CREATE PROCEDURE book_bike(IN in_simulation_id INT)
BEGIN
    UPDATE Scooter 
    SET user_id = in_simulation_id, 
        is_available = FALSE, 
        status = 'in_use'
    WHERE simulation_id = in_simulation_id 
        AND is_available = TRUE
        AND user_id IS NULL
    LIMIT 1;
END//

DELIMITER ;


DELIMITER //

CREATE PROCEDURE RentScooter(IN scooter_id INT, IN user_id INT)
BEGIN
  -- Uppdatera scooterns tillgänglighet
  UPDATE Scooter SET is_available = 0 WHERE scooter_id = scooter_id;

  -- Lägg till en ny resa med start_time
  INSERT INTO Trip (scooter_id, user_id, start_time) VALUES (scooter_id, user_id, NOW());
END //

DELIMITER ;