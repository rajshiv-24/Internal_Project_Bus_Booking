import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Functional HTTP interceptor.
 * Automatically attaches  Authorization: Bearer <token>
 * to every outgoing request EXCEPT login and register.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  // Skip public endpoints
  const isPublic =
    req.url.includes('/customer/login') ||
    req.url.includes('/customer/register');

  if (token && !isPublic) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
