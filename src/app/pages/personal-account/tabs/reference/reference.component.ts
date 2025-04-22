import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferenceBookComponent } from './reference-book/reference-book.component';

@Component({
  selector: 'app-reference',
  imports: [CommonModule, ReferenceBookComponent],
  templateUrl: './reference.component.html',
  styleUrl: './reference.component.scss'
})
export class ReferenceComponent {

  selectReference: any;

  references: { id: string; label: string; command: () => void }[] = [
    { id: '030521' , label: 'Сотрудники', command: () => this.executeReference('030521') },
    { id: '495142' , label: 'Назначение товара', command: () => this.executeReference('161283') },
    { id: '915825' , label: 'Единицы измерения', command: () => this.executeReference('161283') },
    { id: '925812' , label: 'Склады', command: () => this.executeReference('925812') },
    { id: '103825' , label: 'Грузы', command: () => this.executeReference('103825') },
    { id: '174208' , label: 'Карьеры', command: () => this.executeReference('174208') },
    
  ];

  selectedId!: string;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { }

  select(id: string) {
    this.selectedId = id;
    this.selectReference = id;
  }

  executeReference(type: string) {
   this.select(type)
  }

  ngOnInit(): void {
this.select('030521');
    
  }
}
