import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { SeatBookingComponent } from './components/seat-booking/seat-booking.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { PassengersComponent } from './components/passengers/passengers.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'seat-booking', component: SeatBookingComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'passengers/:bookingId', component: PassengersComponent }
];
