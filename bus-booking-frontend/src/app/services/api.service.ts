import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, BookingRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Customer
  register(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/customer/register`, data);
  }

  login(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/customer/login`, data);
  }

  // Schedule
  searchSchedules(src: string, dest: string, date: string): Observable<ApiResponse> {
    const params = new HttpParams().set('src', src).set('dest', dest).set('date', date);
    return this.http.get<ApiResponse>(`${this.baseUrl}/schedule/search`, { params });
  }

  createSchedule(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/schedule/create`, data);
  }

  getRoutes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/schedule/routes`);
  }

  // Booking
  bookTicket(data: BookingRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/booking/book`, data);
  }

  getBookedSeats(scheduleId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/booking/booked-seats/${scheduleId}`);
  }

  getBookingsByCustomer(custId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/booking/customer/${custId}`);
  }

  getPassengersByBooking(bookingId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/booking/passengers/${bookingId}`);
  }
}
