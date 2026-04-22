package com.busbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class BusBookingDTO {

    // ================= REQUEST DTOs =================

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String custName;
        private String phoneNo;
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleSearchRequest {
        private String src;
        private String dest;
        private LocalDate date;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateScheduleRequest {
        private Long routeId;
        private LocalTime departureTime;
        private LocalDate scheduleDt;
        private Integer totSeats;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingRequest {
        private Long scheduleId;
        private Long custId;
        private List<PassengerInfo> passengers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PassengerInfo {
        private String passengerName;
        private Integer passengerAge;
        private String seatNo;
    }

    // ================= RESPONSE DTOs =================

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerResponse {
        private Long custId;
        private String custName;
        private String phoneNo;
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleResponse {
        private Long id;
        private Long routeId;
        private String src;
        private String dest;
        private LocalTime departureTime;
        private LocalDate scheduleDt;
        private Integer avlSeats;
        private Integer totSeats;
        private String schStatus;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingResponse {
        private Long id;
        private Long scheduleId;
        private String src;
        private String dest;
        private LocalDate scheduleDt;
        private LocalTime departureTime;
        private Long custId;
        private String custName;
        private LocalDate bookingDt;
        private String bookingStatus;
        private List<PassengerResponse> passengers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PassengerResponse {
        private Long id;
        private String passengerName;
        private Integer passengerAge;
        private String seatNo;
        private Long bookingId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookedSeatsResponse {
        private Long scheduleId;
        private List<String> bookedSeats;
    }
}
