package com.busbooking.repository;

import com.busbooking.entity.BusRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusRouteRepository extends JpaRepository<BusRoute, Long> {
    List<BusRoute> findBySrcIgnoreCaseAndDestIgnoreCase(String src, String dest);
}
