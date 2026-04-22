package com.busbooking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "passenger")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "passenger_name", nullable = false)
    private String passengerName;

    @Column(name = "passenger_age", nullable = false)
    private Integer passengerAge;

    @Column(name = "seat_no", nullable = false)
    private String seatNo;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private BusBooking busBooking;
}
