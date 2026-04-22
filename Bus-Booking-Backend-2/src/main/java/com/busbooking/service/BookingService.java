package com.busbooking.service;

import com.busbooking.dto.BusBookingDTO.*;
import com.busbooking.entity.*;
import com.busbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BusBookingRepository bookingRepository;

    @Autowired
    private RouteScheduleRepository scheduleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Transactional
    public ApiResponse bookTicket(BookingRequest request) {
        RouteSchedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        Customer customer = customerRepository.findById(request.getCustId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (schedule.getAvlSeats() < request.getPassengers().size()) {
            return new ApiResponse(false, "Not enough seats available", null);
        }

        // Check if any seat is already booked
        for (PassengerInfo p : request.getPassengers()) {
            if (passengerRepository.existsBySeatNoAndBusBookingRouteScheduleId(p.getSeatNo(), schedule.getId())) {
                return new ApiResponse(false, "Seat " + p.getSeatNo() + " is already booked", null);
            }
        }

        // Create booking
        BusBooking booking = new BusBooking();
        booking.setRouteSchedule(schedule);
        booking.setCustomer(customer);
        booking.setBookingDt(LocalDate.now());
        booking.setBookingStatus("CONFIRMED");
        BusBooking savedBooking = bookingRepository.save(booking);

        // Save passengers
        List<Passenger> passengers = request.getPassengers().stream().map(p -> {
            Passenger passenger = new Passenger();
            passenger.setPassengerName(p.getPassengerName());
            passenger.setPassengerAge(p.getPassengerAge());
            passenger.setSeatNo(p.getSeatNo());
            passenger.setBusBooking(savedBooking);
            return passenger;
        }).collect(Collectors.toList());

        passengerRepository.saveAll(passengers);

        // Update available seats
        schedule.setAvlSeats(schedule.getAvlSeats() - request.getPassengers().size());
        scheduleRepository.save(schedule);

        BookingResponse response = toBookingResponse(savedBooking, passengers);
        return new ApiResponse(true, "Booking confirmed successfully!", response);
    }

    public ApiResponse getBookingsByCustomer(Long custId) {
        List<BusBooking> bookings = bookingRepository.findByCustomerCustId(custId);
        List<BookingResponse> responses = bookings.stream()
                .map(b -> {
                    List<Passenger> passengers = passengerRepository.findByBusBookingId(b.getId());
                    return toBookingResponse(b, passengers);
                })
                .collect(Collectors.toList());
        return new ApiResponse(true, "Bookings fetched", responses);
    }

    public ApiResponse getPassengersByBooking(Long bookingId) {
        List<Passenger> passengers = passengerRepository.findByBusBookingId(bookingId);
        List<PassengerResponse> responses = passengers.stream()
                .map(p -> new PassengerResponse(
                        p.getId(), p.getPassengerName(), p.getPassengerAge(),
                        p.getSeatNo(), p.getBusBooking().getId()))
                .collect(Collectors.toList());
        return new ApiResponse(true, "Passengers fetched", responses);
    }

    public ApiResponse getBookedSeats(Long scheduleId) {
        List<Passenger> passengers = passengerRepository.findAll().stream()
                .filter(p -> p.getBusBooking() != null && 
                           p.getBusBooking().getRouteSchedule() != null && 
                           p.getBusBooking().getRouteSchedule().getId().equals(scheduleId))
                .collect(Collectors.toList());

        List<String> bookedSeats = passengers.stream()
                .map(Passenger::getSeatNo)
                .collect(Collectors.toList());

        return new ApiResponse(true, "Booked seats fetched",
                new BookedSeatsResponse(scheduleId, bookedSeats));
    }

    private BookingResponse toBookingResponse(BusBooking b, List<Passenger> passengers) {
        if (b == null || b.getRouteSchedule() == null || b.getCustomer() == null) {
            throw new RuntimeException("Invalid booking data: booking, route schedule, or customer is null");
        }
        
        List<PassengerResponse> passengerResponses = passengers.stream()
                .map(p -> new PassengerResponse(
                        p.getId(), p.getPassengerName(), p.getPassengerAge(),
                        p.getSeatNo(), b.getId()))
                .collect(Collectors.toList());

        BusRoute route = b.getRouteSchedule().getBusRoute();
        if (route == null) {
            throw new RuntimeException("Route information missing for schedule");
        }
        
        return new BookingResponse(
                b.getId(),
                b.getRouteSchedule().getId(),
                route.getSrc(),
                route.getDest(),
                b.getRouteSchedule().getScheduleDt(),
                b.getRouteSchedule().getDepartureTime(),
                b.getCustomer().getCustId(),
                b.getCustomer().getCustName(),
                b.getBookingDt(),
                b.getBookingStatus(),
                passengerResponses
        );
    }
}
