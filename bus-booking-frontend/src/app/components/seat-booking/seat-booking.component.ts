import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Schedule, PassengerInfo } from '../../models/models';

@Component({
  selector: 'app-seat-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-vh-100" style="background:#f0f4f8;">
      <div class="container py-4">

        <!-- Journey Info Bar -->
        <div class="card border-0 rounded-4 shadow-sm mb-4" style="background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#fff;">
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col-auto">
                <i class="bi bi-bus-front-fill fs-1" style="color:#e94560;"></i>
              </div>
              <div class="col">
                <h4 class="fw-bold mb-1">{{ schedule?.src }} &nbsp;→&nbsp; {{ schedule?.dest }}</h4>
                <div class="d-flex gap-3 flex-wrap">
                  <span class="small"><i class="bi bi-calendar3 me-1 text-warning"></i>{{ schedule?.scheduleDt }}</span>
                  <span class="small"><i class="bi bi-clock me-1 text-warning"></i>{{ schedule?.departureTime }}</span>
                  <span class="small"><i class="bi bi-people me-1 text-warning"></i>{{ schedule?.avlSeats }} seats available</span>
                </div>
              </div>
              <div class="col-auto">
                <span class="badge rounded-pill px-3 py-2 fs-6" style="background:#e94560;">
                  Schedule #{{ schedule?.id }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- Seat Map -->
          <div class="col-lg-7">
            <div class="card border-0 rounded-4 shadow-sm">
              <div class="card-header bg-white border-0 rounded-top-4 p-4 pb-2">
                <h5 class="fw-bold mb-0"><i class="bi bi-grid-3x3-gap me-2 text-danger"></i>Select Your Seats</h5>
                <p class="text-muted small mb-0">Click on available seats to select them</p>
              </div>
              <div class="card-body p-4">
                <!-- Legend -->
                <div class="d-flex gap-3 mb-4 flex-wrap">
                  <div class="d-flex align-items-center gap-2">
                    <div class="seat-demo available"></div><span class="small text-muted">Available</span>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <div class="seat-demo selected"></div><span class="small text-muted">Selected</span>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <div class="seat-demo booked"></div><span class="small text-muted">Booked</span>
                  </div>
                </div>

                <!-- Bus Front -->
                <div class="text-center mb-3">
                  <div class="d-inline-block px-4 py-1 rounded-pill text-white small fw-semibold"
                    style="background:#0f3460;">
                    <i class="bi bi-chevron-up me-1"></i> FRONT
                  </div>
                </div>

                <!-- Seat Grid -->
                <div class="seat-map" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:8px; max-width:320px; margin:auto;">
                  <ng-container *ngFor="let row of seats; let rowIndex = index">
                    <ng-container *ngFor="let seat of row; let colIndex = index">
                      <div *ngIf="colIndex === 2" class="aisle"></div>
                      <div
                        [ngClass]="{
                          'seat': true,
                          'seat-available': !isBooked(seat) && !isSelected(seat),
                          'seat-selected': isSelected(seat),
                          'seat-booked': isBooked(seat)
                        }"
                        (click)="selectSeat(seat)"
                        [attr.title]="seat"
                        [attr.data-testid]="rowIndex + '' + colIndex">
                        {{ seat }}
                      </div>
                    </ng-container>
                  </ng-container>
                </div>

                <div class="d-flex gap-2 mt-4">
                  <button class="btn btn-outline-secondary rounded-3 flex-fill" (click)="clearSelection()" data-testid="clear-selection">
                    <i class="bi bi-x-circle me-1"></i> Clear
                  </button>
                  <button class="btn rounded-3 flex-fill fw-semibold" style="background:#e94560;color:#fff;"
                    (click)="confirmSeats()" [disabled]="selectedSeats.length === 0" data-testid="book-seats">
                    <i class="bi bi-check-circle me-1"></i> Confirm ({{ selectedSeats.length }})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Passenger Details -->
          <div class="col-lg-5">
            <div class="card border-0 rounded-4 shadow-sm">
              <div class="card-header bg-white border-0 rounded-top-4 p-4 pb-2">
                <h5 class="fw-bold mb-0"><i class="bi bi-people me-2 text-danger"></i>Passenger Details</h5>
                <p class="text-muted small mb-0">
                  {{ selectedSeats.length === 0 ? 'Select seats first' : selectedSeats.length + ' seat(s) selected' }}
                </p>
              </div>
              <div class="card-body p-4">
                <div *ngIf="selectedSeats.length === 0" class="text-center py-4">
                  <i class="bi bi-cursor-fill fs-1 text-muted"></i>
                  <p class="text-muted mt-2">Please select seats from the seat map</p>
                </div>

                <div *ngFor="let seat of selectedSeats; let i = index" class="mb-3">
                  <div class="p-3 rounded-3" style="background:#f8f9fa;border-left:3px solid #e94560;">
                    <div class="fw-semibold small text-danger mb-2">
                      <i class="bi bi-person-circle me-1"></i> Seat {{ seat }}
                    </div>
                    <input type="text" class="form-control form-control-sm mb-2 rounded-2"
                      placeholder="Passenger Name *"
                      [(ngModel)]="passengers[i].passengerName">
                    <input type="number" class="form-control form-control-sm rounded-2"
                      placeholder="Age *" min="1" max="120"
                      [(ngModel)]="passengers[i].passengerAge">
                  </div>
                </div>

                <div *ngIf="bookingMessage" [class]="'alert mt-3 rounded-3 alert-' + (bookingSuccess ? 'success' : 'danger')">
                  {{ bookingMessage }}
                </div>

                <button *ngIf="selectedSeats.length > 0"
                  class="btn w-100 py-2 fw-bold rounded-3 mt-3"
                  style="background:#0f3460;color:#fff;"
                  (click)="submitBooking()" [disabled]="bookingLoading">
                  <span *ngIf="bookingLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!bookingLoading" class="bi bi-ticket-perforated me-2"></i>
                  {{ bookingLoading ? 'Processing...' : 'Confirm Booking' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .seat {
      width: 48px; height: 48px; border-radius: 8px 8px 4px 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 600; cursor: pointer;
      transition: all 0.15s; border: 2px solid transparent;
      position: relative; user-select: none;
    }
    .seat::before {
      content: ''; position: absolute; top: -6px; left: 50%; transform: translateX(-50%);
      width: 60%; height: 6px; background: inherit; border-radius: 3px 3px 0 0; opacity: 0.6;
    }
    .seat-available { background: #e8f5e9; color: #2e7d32; border-color: #a5d6a7; }
    .seat-available:hover { background: #c8e6c9; transform: scale(1.1); border-color: #4caf50; }
    .seat-selected { background: #e94560; color: #fff; border-color: #c0392b; transform: scale(1.05); }
    .seat-booked { background: #eceff1; color: #b0bec5; border-color: #cfd8dc; cursor: not-allowed; }
    .aisle { width: 20px; }
    .seat-demo { width: 20px; height: 20px; border-radius: 4px; border: 2px solid transparent; }
    .available { background: #e8f5e9; border-color: #a5d6a7; }
    .selected { background: #e94560; border-color: #c0392b; }
    .booked { background: #eceff1; border-color: #cfd8dc; }
  `]
})
export class SeatBookingComponent implements OnInit {
  schedule: Schedule | null = null;
  rows = 8; cols = 4;
  seats: string[][] = [];
  bookedSeats: string[] = [];
  selectedSeats: string[] = [];
  passengers: PassengerInfo[] = [];
  bookingMessage = ''; bookingSuccess = false; bookingLoading = false;

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.schedule = nav?.extras?.state?.['schedule'] ?? null;
  }

  ngOnInit() {
    // Generate seat grid: A1-D8 style (4 cols, 8 rows)
    this.seats = Array.from({ length: this.rows }, (_, row) =>
      Array.from({ length: this.cols }, (_, col) =>
        `${String.fromCharCode(65 + col)}${row + 1}`
      )
    );
    if (this.schedule) {
      this.api.getBookedSeats(this.schedule.id).subscribe({
        next: (res) => { if (res.success) this.bookedSeats = res.data.bookedSeats; }
      });
    } else {
      this.router.navigate(['/schedule']);
    }
  }

  isBooked(seat: string) { return this.bookedSeats.includes(seat); }
  isSelected(seat: string) { return this.selectedSeats.includes(seat); }

  selectSeat(seat: string) {
    if (this.isBooked(seat)) return;
    const idx = this.selectedSeats.indexOf(seat);
    if (idx >= 0) {
      this.selectedSeats.splice(idx, 1);
      this.passengers.splice(idx, 1);
    } else {
      this.selectedSeats.push(seat);
      this.passengers.push({ passengerName: '', passengerAge: 0, seatNo: seat });
    }
  }

  confirmSeats() {
    this.passengers = this.selectedSeats.map((seat, i) => ({
      ...this.passengers[i],
      seatNo: seat
    }));
  }

  clearSelection() {
    this.selectedSeats = []; this.passengers = [];
  }

  submitBooking() {
    const user = this.auth.getUser();
    if (!user) { this.router.navigate(['/login']); return; }

    for (const p of this.passengers) {
      if (!p.passengerName || !p.passengerAge) {
        this.bookingMessage = 'Please fill in all passenger details.';
        this.bookingSuccess = false; return;
      }
    }

    const payload = {
      scheduleId: this.schedule!.id,
      custId: user.custId,
      passengers: this.passengers.map((p, i) => ({ ...p, seatNo: this.selectedSeats[i] }))
    };

    this.bookingLoading = true;
    this.api.bookTicket(payload).subscribe({
      next: (res) => {
        this.bookingLoading = false;
        this.bookingSuccess = res.success;
        this.bookingMessage = res.message;
        if (res.success) {
          setTimeout(() => this.router.navigate(['/my-bookings']), 1800);
        }
      },
      error: () => { this.bookingLoading = false; this.bookingMessage = 'Booking failed. Try again.'; }
    });
  }
}
