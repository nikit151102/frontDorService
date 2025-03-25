import { Component, OnInit } from '@angular/core';
import { ToastMessage, ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  messages: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }

  remove(id: number) {
    this.toastService.remove(id); 
  }
}
