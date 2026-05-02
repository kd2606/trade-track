import jsPDF from 'jspdf';
import { Transaction } from '@/types';

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  businessInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
  };
}

interface InvoiceItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export class InvoiceGenerator {
  private doc: jsPDF;
  
  constructor() {
    this.doc = new jsPDF();
  }

  generateInvoice(data: InvoiceData): void {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Set font
    this.doc.setFont('helvetica');

    // Header
    this.doc.setFontSize(20);
    this.doc.text('INVOICE', margin, yPosition);
    yPosition += 15;

    // Invoice number and date
    this.doc.setFontSize(12);
    this.doc.text(`Invoice #: ${data.invoiceNumber}`, margin, yPosition);
    this.doc.text(`Date: ${data.date}`, pageWidth - margin - 40, yPosition);
    yPosition += 10;

    // Business Info
    this.doc.setFontSize(10);
    this.doc.text('From:', margin, yPosition);
    yPosition += 5;
    this.doc.text(data.businessInfo.name, margin, yPosition);
    yPosition += 5;
    this.doc.text(data.businessInfo.address, margin, yPosition);
    yPosition += 5;
    this.doc.text(`Phone: ${data.businessInfo.phone}`, margin, yPosition);
    yPosition += 5;
    this.doc.text(`Email: ${data.businessInfo.email}`, margin, yPosition);
    yPosition += 15;

    // Customer Info (if provided)
    if (data.customerName) {
      this.doc.text('Bill To:', margin, yPosition);
      yPosition += 5;
      this.doc.text(data.customerName, margin, yPosition);
      if (data.customerEmail) {
        yPosition += 5;
        this.doc.text(`Email: ${data.customerEmail}`, margin, yPosition);
      }
      if (data.customerPhone) {
        yPosition += 5;
        this.doc.text(`Phone: ${data.customerPhone}`, margin, yPosition);
      }
      yPosition += 15;
    }

    // Table Headers
    const tableTop = yPosition;
    const tableHeaders = ['Item', 'Description', 'Qty', 'Price', 'Total'];
    const columnWidths = [60, 60, 20, 30, 30];
    let currentX = margin;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    tableHeaders.forEach((header, index) => {
      this.doc.text(header, currentX, tableTop);
      currentX += columnWidths[index];
    });
    yPosition += 10;

    // Table Items
    this.doc.setFont('helvetica', 'normal');
    data.items.forEach((item) => {
      // Check if we need a new page
      if (yPosition > 250) {
        this.doc.addPage();
        yPosition = margin;
      }

      currentX = margin;
      
      // Item Name (truncate if too long)
      const itemName = item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name;
      this.doc.text(itemName, currentX, yPosition);
      currentX += columnWidths[0];

      // Description (truncate if too long)
      const description = item.description && item.description.length > 25 
        ? item.description.substring(0, 25) + '...' 
        : (item.description || '');
      this.doc.text(description, currentX, yPosition);
      currentX += columnWidths[1];

      // Quantity
      this.doc.text(item.quantity.toString(), currentX, yPosition);
      currentX += columnWidths[2];

      // Unit Price
      this.doc.text(`₹${item.unitPrice.toFixed(2)}`, currentX, yPosition);
      currentX += columnWidths[3];

      // Total Price
      this.doc.text(`₹${item.totalPrice.toFixed(2)}`, currentX, yPosition);
      
      yPosition += 8;
    });

    // Summary Section
    yPosition += 20;
    const summaryX = pageWidth - margin - 100;

    // Line
    this.doc.line(summaryX, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Subtotal
    this.doc.text(`Subtotal: ₹${data.subtotal.toFixed(2)}`, summaryX, yPosition);
    yPosition += 8;

    // Tax
    this.doc.text(`Tax (${data.taxRate}%): ₹${data.taxAmount.toFixed(2)}`, summaryX, yPosition);
    yPosition += 8;

    // Total
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.text(`Total: ₹${data.total.toFixed(2)}`, summaryX, yPosition);
    yPosition += 15;

    // Footer
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.text('Thank you for your business!', margin, yPosition);
    yPosition += 10;
    this.doc.text('This is a computer-generated invoice.', margin, yPosition);
  }

  downloadInvoice(invoiceNumber: string): void {
    this.doc.save(`invoice-${invoiceNumber}.pdf`);
  }

  getInvoiceDataUrl(): string {
    return this.doc.output('datauristring');
  }
}

export function generateInvoiceFromTransaction(transaction: Transaction, businessInfo: any): InvoiceData {
  const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const date = new Date(transaction.date).toLocaleDateString('en-IN');
  
  const items: InvoiceItem[] = [{
    name: transaction.product_name || 'Product',
    description: transaction.description || '',
    quantity: transaction.quantity || 1,
    unitPrice: transaction.selling_price || transaction.amount,
    totalPrice: transaction.amount
  }];

  const subtotal = transaction.amount;
  const taxRate = 0; // Default tax rate (can be made configurable)
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return {
    invoiceNumber,
    date,
    items,
    subtotal,
    taxRate: taxRate * 100,
    taxAmount,
    total,
    businessInfo
  };
}
