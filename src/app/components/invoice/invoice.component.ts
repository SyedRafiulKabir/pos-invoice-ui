import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { Item, InvoiceItem } from '../../models/item.model';
import { Invoice } from '../../models/invoice.model';

@Component({
    selector: 'app-invoice',
    imports: [CommonModule, FormsModule],
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
    invoiceNo = 'INV-2025-04-001';
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
    paidAmount = 0;
    returnAmount = 0;
    saleConfirmed = false;

    categoryItems: { [category: string]: Item[] } = {
        Grocery: [{ name: 'Lux Soap', rate: 20 }, { name: 'Rice', rate: 50 }],
        Electronics: [{ name: 'LED Bulb', rate: 150 }],
        Clothing: [{ name: 'T-Shirt', rate: 250 }]
    };

    fetchCustomerInfo() {
        if (this.customerMobile === '01700000000') {
            this.customer = {
                mobile: '01700000000',
                name: 'Mr. Kabir',
                address: 'Dhaka'
            };
        } else {
            this.customer = null;
        }
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
        const discount = row.discount || 0;
        const vat = row.vat || 0;
        row.amount = base - discount + vat;
        this.calculateTotal();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, row) => sum + (row.quantity * row.rate - row.discount), 0);
        this.totalVat = this.items.reduce((sum, row) => sum + row.vat, 0);
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
      // this.invoiceService.save(invoice).subscribe(...)
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
