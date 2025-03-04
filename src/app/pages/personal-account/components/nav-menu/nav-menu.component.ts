import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface CustomMenuItem {
  label: string;
  commandName?: string;
}

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavMenuComponent {
  @Input() items: CustomMenuItem[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  execute(commandName: string) {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.router.navigate([`${id}/${commandName}`]);
      }
    });
  }
}
