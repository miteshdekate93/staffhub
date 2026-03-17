import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>people</mat-icon>
      <span style="margin-left:8px">StaffHub</span>
      <span style="flex:1"></span>
      <a mat-button routerLink="/employees" routerLinkActive="active">Employees</a>
      <a mat-button routerLink="/departments" routerLinkActive="active">Departments</a>
    </mat-toolbar>
    <div style="padding: 24px">
      <router-outlet />
    </div>
  `
})
export class AppComponent {}
