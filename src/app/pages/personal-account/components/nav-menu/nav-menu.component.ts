import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {
  items: MenuItem[] | undefined;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.items = [
      {
        label: 'Контрагенты',
        command: () => this.execute('194253')
      },
      {
        label: 'Сервисы',
        command: () => this.execute('194253')
      },
      {
        label: 'Нал',
        command: () => this.execute('')
      },
      {
        label: 'Документы',
        command: () => this.execute('194253')
      }
    ]
  }


  execute(commandName: string) {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.router.navigate([`${id}/${commandName}`]);
      }
    });
  }
}
