export interface Customer {
  custId: number;
  custName: string;
  phoneNo: string;
  email: string;
}

export interface Schedule {
  id: number;
  routeId: number;
  src: string;
  dest: string;
  departureTime: string;
  scheduleDt: string;
  avlSeats: number;
  totSeats: number;
  schStatus: string;
}

export interface PassengerInfo {
  passengerName: string;
  passengerAge: number;
  seatNo: string;
}

export interface BookingRequest {
  scheduleId: number;
  custId: number;
  passengers: PassengerInfo[];
}

export interface PassengerResponse {
  id: number;
  passengerName: string;
  passengerAge: number;
  seatNo: string;
  bookingId: number;
}

export interface BookingResponse {
  id: number;
  scheduleId: number;
  src: string;
  dest: string;
  scheduleDt: string;
  departureTime: string;
  custId: number;
  custName: string;
  bookingDt: string;
  bookingStatus: string;
  passengers: PassengerResponse[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}
