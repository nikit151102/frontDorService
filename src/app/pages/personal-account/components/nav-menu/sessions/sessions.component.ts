// sessions.component.ts
import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SessionsService } from './sessions.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  providers: [DatePipe]
})
export class SessionsComponent implements OnInit {
  isOpen = false;
  isLoading = false;
  sessions: any[] = [];
  error: string | null = null;

  constructor(
    private sessionsService: SessionsService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.sessionsService.connectToWebSocket();
    const userAgent = window.navigator.userAgent;
    console.log('userAgent', userAgent)
  }

  toggleSessions(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    // if (this.isOpen && this.sessions.length === 0) {
    //   this.loadSessions();
    // }
    if (this.isOpen ) {
      this.loadSessions();
    }
  }

  loadSessions() {
    this.isLoading = true;
    this.error = null;

    this.sessionsService.getActiveSessions().subscribe({
      next: (response: any) => {
        this.sessions = response.data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Не удалось загрузить сессии. Пожалуйста, попробуйте снова.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error loading sessions:', err);
      }
    });
  }

  updateStatus(data: any, status: number) {
    const updateData = { ...data };
    updateData.status = status;
    this.sessionsService.updateSession(updateData).subscribe((response: any) => {
    });
    this.openedStatusDropdown = null;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd.MM.y, HH:mm') || 'N/A';
    } catch (e) {
      console.error('Error formatting date', e);
      return 'N/A';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Не определена';
      case 1: return 'Активна';
      case 2: return 'В спящем режиме';
      case 3: return 'Приостановлена';
      case 4: return 'Завершена';
      case 5: return 'Прервана';
      case 6: return 'Заблокирована';
      default: return 'Неизвестный статус';
    }
  }



  openedStatusDropdown: string | null = null;
  @ViewChild('dropdown') dropdown!: ElementRef;
  shouldPositionTop = true;
  dropdownPosition: any = { top: null, bottom: null };

  toggleStatusDropdown(event: MouseEvent, session: any) {
    const clickedElement = event.target as HTMLElement;
    const dropdownContainer = this.dropdown.nativeElement;
    const containerRect = dropdownContainer.getBoundingClientRect();
    const elementRect = clickedElement.getBoundingClientRect();

    const relativeY = elementRect.top - containerRect.top;
    const dropdownHeight = 90;
    if ((relativeY + dropdownHeight + 16) > containerRect.height) {
      this.dropdownPosition = {
        bottom: 13,
        top: null
      };
    } else {
      this.dropdownPosition = {
        top: 20,
        bottom: null
      };
    }
    this.openedStatusDropdown = this.openedStatusDropdown === session.id ? null : session.id;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOpen = false;
      this.cdr.detectChanges();
    }
  }
}