package com.busbooking.controller;

import com.busbooking.dto.BusBookingDTO.*;
import com.busbooking.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "http://localhost:4200")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchSchedules(
            @RequestParam String src,
            @RequestParam String dest,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(scheduleService.searchSchedules(src, dest, date));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createSchedule(@RequestBody CreateScheduleRequest request) {
        return ResponseEntity.ok(scheduleService.createSchedule(request));
    }

    @GetMapping("/routes")
    public ResponseEntity<ApiResponse> getAllRoutes() {
        return ResponseEntity.ok(scheduleService.getAllRoutes());
    }
}
