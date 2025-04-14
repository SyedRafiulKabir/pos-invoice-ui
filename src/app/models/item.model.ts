export interface Item {
    name: string;
    rate: number;
}

export interface InvoiceItem {
    name: string;
    quantity: number;
    rate: number;
    discount: number;
    vat: number;
    amount: number;
}
