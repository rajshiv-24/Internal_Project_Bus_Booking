package com.busbooking.controller;

import com.busbooking.dto.BusBookingDTO.*;
import com.busbooking.security.AuthRequest;
import com.busbooking.security.AuthResponse;
import com.busbooking.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    /**
     * POST /api/customer/register
     * Public endpoint — no JWT required
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        ApiResponse response = customerService.register(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/customer/login
     * Public endpoint — returns JWT token on success
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = customerService.login(request);
        return ResponseEntity.ok(response);
    }
}
