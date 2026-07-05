import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const credentials = localStorage.getItem('credentials');
    if (!credentials) {
      return next.handle(req);
    }

    let token: string | null = null;
    try {
      token = JSON.parse(credentials).token;
    } catch {
      token = null;
    }

    if (!token || !req.url.startsWith('http://localhost:3000')) {
      return next.handle(req);
    }

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(authReq);
  }
}
