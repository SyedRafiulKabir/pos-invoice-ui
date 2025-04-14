import { Routes } from '@angular/router';
import { InvoiceComponent } from './components/invoice/invoice.component';

export const routes: Routes = [
    { path: '', redirectTo: 'invoice', pathMatch: 'full' },
    { path: 'invoice', component: InvoiceComponent }
  ];
