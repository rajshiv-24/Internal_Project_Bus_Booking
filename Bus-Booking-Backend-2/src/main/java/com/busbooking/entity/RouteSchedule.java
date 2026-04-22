package com.busbooking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "route_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private BusRoute busRoute;

    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;

    @Column(name = "schedule_dt", nullable = false)
    private LocalDate scheduleDt;

    @Column(name = "avl_seats", nullable = false)
    private Integer avlSeats;

    @Column(name = "tot_seats", nullable = false)
    private Integer totSeats;

    @Column(name = "sch_status", nullable = false)
    private String schStatus;
}
