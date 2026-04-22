package com.busbooking.security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long custId;
    private String custName;
    private String email;
    private String message;
    private boolean success;
}
