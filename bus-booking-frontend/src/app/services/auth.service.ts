import { Injectable } from '@angular/core';

export interface StoredUser {
  custId: number;
  custName: string;
  email: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'bus_user';

  setUser(data: StoredUser): void {
    sessionStorage.setItem(this.KEY, JSON.stringify(data));
  }

  getUser(): StoredUser | null {
    const data = sessionStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  getToken(): string | null {
    return this.getUser()?.token ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.removeItem(this.KEY);
  }
}
