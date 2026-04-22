package com.busbooking.service;

import com.busbooking.dto.BusBookingDTO.*;
import com.busbooking.entity.BusRoute;
import com.busbooking.entity.RouteSchedule;
import com.busbooking.repository.BusRouteRepository;
import com.busbooking.repository.RouteScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    @Autowired
    private RouteScheduleRepository scheduleRepository;

    @Autowired
    private BusRouteRepository routeRepository;

    public ApiResponse searchSchedules(String src, String dest, java.time.LocalDate date) {
        List<RouteSchedule> schedules = scheduleRepository.findAvailableSchedules(src, dest, date);
        List<ScheduleResponse> responses = schedules.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        if (responses.isEmpty()) {
            return new ApiResponse(false, "No schedules available for the selected route and date", responses);
        }
        return new ApiResponse(true, "Schedules found", responses);
    }

    public ApiResponse createSchedule(CreateScheduleRequest request) {
        BusRoute route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + request.getRouteId()));

        RouteSchedule schedule = new RouteSchedule();
        schedule.setBusRoute(route);
        schedule.setDepartureTime(request.getDepartureTime());
        schedule.setScheduleDt(request.getScheduleDt());
        schedule.setTotSeats(request.getTotSeats());
        schedule.setAvlSeats(request.getTotSeats());
        schedule.setSchStatus("ACTIVE");

        RouteSchedule saved = scheduleRepository.save(schedule);
        return new ApiResponse(true, "Schedule created successfully", toResponse(saved));
    }

    public ApiResponse getAllRoutes() {
        List<BusRoute> routes = routeRepository.findAll();
        return new ApiResponse(true, "Routes fetched", routes);
    }

    private ScheduleResponse toResponse(RouteSchedule rs) {
        if (rs == null || rs.getBusRoute() == null) {
            throw new RuntimeException("Invalid schedule data: schedule or bus route is null");
        }
        
        ScheduleResponse r = new ScheduleResponse();
        r.setId(rs.getId());
        r.setRouteId(rs.getBusRoute().getId());
        r.setSrc(rs.getBusRoute().getSrc());
        r.setDest(rs.getBusRoute().getDest());
        r.setDepartureTime(rs.getDepartureTime());
        r.setScheduleDt(rs.getScheduleDt());
        r.setAvlSeats(rs.getAvlSeats());
        r.setTotSeats(rs.getTotSeats());
        r.setSchStatus(rs.getSchStatus());
        return r;
    }
}
