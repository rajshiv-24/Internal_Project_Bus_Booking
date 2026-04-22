package com.busbooking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cust_id")
    private Long custId;

    @Column(name = "cust_name", nullable = false)
    private String custName;

    @Column(name = "phone_no", nullable = false, unique = true)
    private String phoneNo;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;
}
