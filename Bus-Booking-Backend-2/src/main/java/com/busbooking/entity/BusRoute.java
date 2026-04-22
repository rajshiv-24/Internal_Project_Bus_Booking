package com.busbooking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bus_route")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "src", nullable = false)
    private String src;

    @Column(name = "dest", nullable = false)
    private String dest;
}
