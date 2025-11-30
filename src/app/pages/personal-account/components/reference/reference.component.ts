import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferenceBookComponent } from './reference-book/reference-book.component';

@Component({
  selector: 'app-reference',
  imports: [CommonModule, ReferenceBookComponent],
  templateUrl: './reference.component.html',
  styleUrl: './reference.component.scss'
})
export class ReferenceComponent implements OnInit {

  config: any;
  selectReference: any;
  referenceConfig: any;
  references: any[] = [];

  selectedId!: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.config = data['config'];
      if (this.config?.references_menu) {
        this.references = this.config.references_menu.map((ref: any) => ({
          ...ref,
          command: () => this.executeReference(ref.id)
        }));
      }
      this.referenceConfig = this.config.config;
      const defaultRef = this.config?.defaultReference || '030521';
      this.select(defaultRef);
    });
  }

  select(id: string) {
    this.selectedId = id;
    this.selectReference = id;
  }

  executeReference(type: string) {
    this.select(type);
  }
}