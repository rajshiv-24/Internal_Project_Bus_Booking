package com.busbooking.repository;

import com.busbooking.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    List<Passenger> findByBusBookingId(Long bookingId);
    boolean existsBySeatNoAndBusBookingRouteScheduleId(String seatNo, Long scheduleId);
}
