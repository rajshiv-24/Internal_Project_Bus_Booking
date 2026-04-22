package com.busbooking.service;

import com.busbooking.dto.BusBookingDTO.*;
import com.busbooking.entity.Customer;
import com.busbooking.repository.CustomerRepository;
import com.busbooking.security.AuthRequest;
import com.busbooking.security.AuthResponse;
import com.busbooking.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Register: validates uniqueness, hashes password, saves customer.
     */
    public ApiResponse register(RegisterRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email already registered", null);
        }
        if (customerRepository.existsByPhoneNo(request.getPhoneNo())) {
            return new ApiResponse(false, "Phone number already registered", null);
        }

        Customer customer = new Customer();
        customer.setCustName(request.getCustName());
        customer.setPhoneNo(request.getPhoneNo());
        customer.setEmail(request.getEmail());
        // Hash the password before saving
        customer.setPassword(passwordEncoder.encode(request.getPassword()));

        Customer saved = customerRepository.save(customer);
        return new ApiResponse(true, "Registration successful", toResponse(saved));
    }

    /**
     * Login: authenticates via Spring Security, returns JWT token + customer info.
     */
    public AuthResponse login(AuthRequest request) {
        try {
            // Spring Security validates email + password (uses BCrypt comparison)
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            return new AuthResponse(null, null, null, null, "Invalid email or password", false);
        }

        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow();

        // Build UserDetails to generate JWT
        UserDetails userDetails = User.builder()
                .username(customer.getEmail())
                .password(customer.getPassword())
                .roles("USER")
                .build();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                customer.getCustId(),
                customer.getCustName(),
                customer.getEmail(),
                "Login successful",
                true
        );
    }

    private CustomerResponse toResponse(Customer c) {
        return new CustomerResponse(c.getCustId(), c.getCustName(), c.getPhoneNo(), c.getEmail());
    }
}
