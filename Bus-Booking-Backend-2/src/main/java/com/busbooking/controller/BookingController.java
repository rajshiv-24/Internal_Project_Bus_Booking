package com.busbooking.controller;

import com.busbooking.dto.BusBookingDTO.*;
import com.busbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/booking")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/book")
    public ResponseEntity<ApiResponse> bookTicket(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.bookTicket(request));
    }

    @GetMapping("/customer/{custId}")
    public ResponseEntity<ApiResponse> getBookingsByCustomer(@PathVariable Long custId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(custId));
    }

    @GetMapping("/passengers/{bookingId}")
    public ResponseEntity<ApiResponse> getPassengersByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getPassengersByBooking(bookingId));
    }

    @GetMapping("/booked-seats/{scheduleId}")
    public ResponseEntity<ApiResponse> getBookedSeats(@PathVariable Long scheduleId) {
        return ResponseEntity.ok(bookingService.getBookedSeats(scheduleId));
    }
}
