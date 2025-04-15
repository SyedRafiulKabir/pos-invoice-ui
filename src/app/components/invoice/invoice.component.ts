import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { Item, InvoiceItem } from '../../models/item.model';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';  // Import the service
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerService } from '../../services/customer.service';

@Component({
    selector: 'app-invoice',
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
    invoiceNo = '';
    customerMobile = '';
    customer: Customer | null = null;

    categories = ['Grocery', 'Electronics', 'Clothing'];
    selectedCategory = '';
    salesBy = 'Admin';

    itemSearch = '';
    filteredItems: Item[] = [];
    items: InvoiceItem[] = [];

    total = 0;
    totalVat = 0;
    grandTotal = 0;
    paidAmount = 0;
    returnAmount = 0;
    saleConfirmed = false;

    categoryItems: { [category: string]: Item[] } = {
        Grocery: [{ name: 'Lux Soap', rate: 20 }, { name: 'Rice', rate: 50 }],
        Electronics: [{ name: 'LED Bulb', rate: 150 }],
        Clothing: [{ name: 'T-Shirt', rate: 250 }]
    };

    constructor(private invoiceService: InvoiceService, private customerService: CustomerService) {}  // Inject the service

    ngOnInit(): void {
        this.getInvoiceNo();
    }
    
    getInvoiceNo(): void {
        this.invoiceService.getInvoiceNo().toPromise()
    .then((res : any) => {
        this.invoiceNo =res.invoiceNo;
    })
    .catch((err) => {
        console.error('Failed to load invoice no', err);
    });

        console.log(this.invoiceNo);
    }

    fetchCustomerInfo() {
        if (!this.customerMobile) return;

        this.customerService.getCustomerByMobile(this.customerMobile).subscribe({
            next: (res) => {
                this.customer = res;
            },
            error: (err) => {
                console.warn('Customer not found or error:', err);
                this.customer = null;
            }
        });
    }

    onCategoryChange() {
        this.filteredItems = this.categoryItems[this.selectedCategory] || [];
    }

    addItem() {
        const found = this.filteredItems.find(i => i.name.toLowerCase() === this.itemSearch.toLowerCase());
        if (found) {
            const item: InvoiceItem = {
                name: found.name,
                quantity: 1,
                rate: found.rate,
                discount: 0,
                vat: 0,
                amount: 0
            };
            this.calculateRow(item);
            this.items.push(item);
            this.itemSearch = '';
        }
    }

    calculateRow(row: InvoiceItem) {
        const base = row.quantity * row.rate;
        const discountAmount = base * (row.discount / 100 || 0);
        const vatAmount = (base - discountAmount) * (row.vat / 100 || 0);
    
        row.amount = base - discountAmount + vatAmount;
    
        this.calculateTotal();
    }
    

    calculateTotal() {
        let subtotal = 0;
        let vatTotal = 0;
    
        for (let row of this.items) {
            const baseAmount = row.quantity * row.rate;
    
            const discountAmount = baseAmount * (row.discount / 100);
            const vatAmount = (baseAmount - discountAmount) * (row.vat / 100);
    
            row.amount = baseAmount - discountAmount + vatAmount;
    
            subtotal += baseAmount - discountAmount;
            vatTotal += vatAmount;
        }
    
        this.total = parseFloat(subtotal.toFixed(2));
        this.totalVat = parseFloat(vatTotal.toFixed(2));
        this.grandTotal = this.total + this.totalVat;
    }
    

    calculateReturn() {
        this.returnAmount = this.paidAmount - (this.total + this.totalVat);
    }

    confirmSale() {
        this.saleConfirmed = true;
        const invoice: Invoice = {
            invoiceNo: this.invoiceNo,
            customer: this.customer,
            salesTerminal: this.selectedCategory,
            salesBy: this.salesBy,
            items: this.items,
            total: this.total,
            totalVat: this.totalVat,
            paidAmount: this.paidAmount,
            returnAmount: this.returnAmount,
            confirmedAt: new Date()
        };

        console.log('Final Invoice:', invoice);
        // You could pass it to an API:
        // this.invoiceService.save(invoice).subscribe(...);
    }

    reset() {
        this.customerMobile = '';
        this.customer = null;
        this.selectedCategory = '';
        this.items = [];
        this.total = 0;
        this.totalVat = 0;
        this.paidAmount = 0;
        this.returnAmount = 0;
        this.saleConfirmed = false;
    }

    save() {
        console.log('Saving sale data...', this.items);
    }
}
