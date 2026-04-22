package com.busbooking.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

// ---- Customer DTOs ----
@Data
class RegisterRequest {
    private String custName;
    private String phoneNo;
    private String email;
    private String password;
}

@Data
class LoginRequest {
    private String email;
    private String password;
}

// ---- Schedule DTOs ----
@Data
class ScheduleSearchRequest {
    private String src;
    private String dest;
    private LocalDate date;
}

@Data
class CreateScheduleRequest {
    private Long routeId;
    private LocalTime departureTime;
    private LocalDate scheduleDt;
    private Integer totSeats;
}

// ---- Booking DTOs ----
@Data
class BookingRequest {
    private Long scheduleId;
    private Long custId;
    private List<PassengerInfo> passengers;
}

@Data
class PassengerInfo {
    private String passengerName;
    private Integer passengerAge;
    private String seatNo;
}
