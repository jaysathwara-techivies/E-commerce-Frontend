import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) { }
  
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

  apiCall<T>(method: string, url: string, body?: any, options?: {}): Observable<T> {
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
}
