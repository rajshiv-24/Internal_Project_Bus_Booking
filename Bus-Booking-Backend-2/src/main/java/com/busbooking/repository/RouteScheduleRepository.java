package com.busbooking.repository;

import com.busbooking.entity.RouteSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RouteScheduleRepository extends JpaRepository<RouteSchedule, Long> {

    @Query("SELECT rs FROM RouteSchedule rs JOIN rs.busRoute br " +
           "WHERE LOWER(br.src) = LOWER(:src) AND LOWER(br.dest) = LOWER(:dest) " +
           "AND rs.scheduleDt = :date AND rs.avlSeats > 0")
    List<RouteSchedule> findAvailableSchedules(
        @Param("src") String src,
        @Param("dest") String dest,
        @Param("date") LocalDate date
    );
}
