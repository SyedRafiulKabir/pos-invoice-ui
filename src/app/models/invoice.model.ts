import { Customer } from './customer.model';
import { InvoiceItem } from './item.model';

export interface Invoice {
    invoiceNo: string;
    customer: Customer | null;
    salesTerminal: string;
    salesBy: string;
    items: InvoiceItem[];
    total: number;
    totalVat: number;
    paidAmount: number;
    returnAmount: number;
    confirmedAt: Date;
}
