import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'https://localhost:44360/api/Invoice';  // Change this to your actual API URL

    constructor(private http: HttpClient) {}

    getInvoiceNo(): Observable<string> {
        return this.http.get<string>(`${this.apiUrl}/new-invoice-no`);
    }
}
