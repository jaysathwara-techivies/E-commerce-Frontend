import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http'
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {
  // private currentUserSubject: BehaviorSubject<any>;
  private isAdmin = false;

  public currentUser: Observable<any>;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    const storedCredentials:any = localStorage.getItem('credentials');
    // this.currentUserSubject = new BehaviorSubject<any>(storedCredentials ? JSON.parse(storedCredentials)._id : null);
    this.currentUser = storedCredentials ? JSON.parse(storedCredentials)._id : null;
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }

  apiCall<T>(method: string, url: string, body?: any, headers?: HttpHeaders): Observable<T> {
    const options = { headers };
    
    switch (method.toLowerCase()) {
      case 'get':
        return this.http.get<T>(url, options).pipe(catchError(this.handleError));
      case 'post':
        return this.http.post<T>(url, body, options).pipe(catchError(this.handleError));
      case 'put':
        return this.http.put<T>(url, body, options).pipe(catchError(this.handleError));
      case 'delete':
        return this.http.delete<T>(url, options).pipe(catchError(this.handleError));
      default:
        throw new Error('Unsupported HTTP method');
    }
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('credentials');
  }

  logOut() {

    localStorage.removeItem('credentials')
  }
  public get currentUserValue(): any {
    return this.currentUser;
  }

  isAdminUser(): boolean {
    let admin:any = localStorage.getItem('credentials')

    return JSON.parse(admin).role === 'admin';
  }

}
