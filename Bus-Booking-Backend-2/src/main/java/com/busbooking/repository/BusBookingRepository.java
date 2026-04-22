package com.busbooking.repository;

import com.busbooking.entity.BusBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusBookingRepository extends JpaRepository<BusBooking, Long> {
    List<BusBooking> findByCustomerCustId(Long custId);
}
