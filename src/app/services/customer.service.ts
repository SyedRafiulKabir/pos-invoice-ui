import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

    private baseUrl = 'https://localhost:44360/api/Customer';

    constructor(private http: HttpClient) {}

    getCustomerByMobile(mobileNo: string): Observable<Customer | null> {
        return this.http.get<Customer>(`${this.baseUrl}/${mobileNo}`);
    }
}
