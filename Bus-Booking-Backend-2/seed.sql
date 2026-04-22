-- ============================================================
--  BusGo PostgreSQL Seed Script (WITH BCrypt passwords)
--  Run AFTER starting Spring Boot once (tables auto-created)
-- ============================================================

-- Step 1: Create DB (run as superuser)
-- CREATE DATABASE bus_booking_db;
-- \c bus_booking_db

-- ============================================================
-- Step 2: Seed Bus Routes
-- ============================================================
INSERT INTO bus_route (src, dest) VALUES
  ('Chennai',   'Bangalore'),
  ('Mumbai',    'Pune'),
  ('Delhi',     'Agra'),
  ('Hyderabad', 'Vijayawada'),
  ('Kolkata',   'Bhubaneswar'),
  ('Jaipur',    'Ahmedabad'),
  ('Lucknow',   'Varanasi');

-- ============================================================
-- Step 3: Seed Route Schedules
-- ============================================================
INSERT INTO route_schedule (route_id, departure_time, schedule_dt, avl_seats, tot_seats, sch_status) VALUES
  (1, '06:00:00', '2025-05-01', 40, 40, 'ACTIVE'),
  (1, '14:00:00', '2025-05-01', 40, 40, 'ACTIVE'),
  (1, '21:00:00', '2025-05-01', 40, 40, 'ACTIVE'),
  (2, '08:00:00', '2025-05-01', 40, 40, 'ACTIVE'),
  (2, '16:30:00', '2025-05-01', 40, 40, 'ACTIVE'),
  (3, '07:30:00', '2025-05-02', 40, 40, 'ACTIVE'),
  (4, '09:00:00', '2025-05-02', 40, 40, 'ACTIVE'),
  (5, '10:00:00', '2025-05-03', 40, 40, 'ACTIVE'),
  (6, '07:00:00', '2025-05-03', 40, 40, 'ACTIVE'),
  (7, '11:00:00', '2025-05-04', 40, 40, 'ACTIVE');

-- ============================================================
-- Step 4: Seed Customers with BCrypt hashed passwords
-- Plain passwords:  rahul->pass123  priya->pass456  amit->pass789
-- ============================================================
INSERT INTO customer (cust_name, phone_no, email, password) VALUES
  ('Rahul Sharma', '9876543210', 'rahul@email.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  ('Priya Patel',  '9123456789', 'priya@email.com',
   '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqrnV4s7WNsWdNCv4kMKCeHrQfmW'),
  ('Amit Kumar',   '9988776655', 'amit@email.com',
   '$2a$10$TelS4bMSCGCCrPFJnJMx7eEEr1K6J2y5v7N3sLnVpCKm3IqOSbD5q');

-- ============================================================
-- Step 5: Verify
-- ============================================================
SELECT * FROM bus_route;
SELECT rs.id, br.src, br.dest, rs.departure_time, rs.schedule_dt, rs.avl_seats
FROM route_schedule rs JOIN bus_route br ON rs.route_id = br.id;
SELECT cust_id, cust_name, email FROM customer;
