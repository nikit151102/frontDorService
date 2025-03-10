import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { InvoicesComponent } from './invoices/invoices.component';
import { ProductsComponent } from './products/products.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoices-table',
  standalone: true,
  imports: [CommonModule, InvoicesComponent, ProductsComponent],
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.scss']
})
export class InvoicesTableComponent implements OnInit, OnChanges {
  @Input() counterpartyId!: any;
  selectedComponent: string = 'invoices';

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void { }

  showComponent(component: string) {
    this.selectedComponent = component;
  }
}
