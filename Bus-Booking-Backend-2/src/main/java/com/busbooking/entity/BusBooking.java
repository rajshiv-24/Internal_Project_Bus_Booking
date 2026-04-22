package com.busbooking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "bus_booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private RouteSchedule routeSchedule;

    @ManyToOne
    @JoinColumn(name = "cust_id", nullable = false)
    private Customer customer;

    @Column(name = "booking_dt", nullable = false)
    private LocalDate bookingDt;

    @Column(name = "booking_status", nullable = false)
    private String bookingStatus;
}
