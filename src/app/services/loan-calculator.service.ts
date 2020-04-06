import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Installment } from '../models/installment';

@Injectable({
  providedIn: 'root'
})
export class LoanCalculatorService {

  constructor(private http: HttpClient) { }

  getInstallment(payload): Observable<Installment> {
    let queryParams = new HttpParams({fromObject: payload});

    return this.http.get('assets/mock-data.json', { params: queryParams}).pipe(
      map(res => res as Installment),
      catchError((error: HttpErrorResponse) => {
        return throwError(`${error.status} - ${error.statusText}`);
      })
    );
  }
}
