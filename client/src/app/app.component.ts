import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from './services/auth.service';
import { LoginDialogComponent } from './auth/login-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>people</mat-icon>
      <span style="margin-left:8px">StaffHub</span>
      <span style="flex:1"></span>
      <a mat-button routerLink="/employees" routerLinkActive="active">Employees</a>
      <a mat-button routerLink="/departments" routerLinkActive="active">Departments</a>
      <button mat-button *ngIf="!auth.isLoggedIn()" (click)="openLogin()">
        <mat-icon>login</mat-icon> Login
      </button>
      <button mat-button *ngIf="auth.isLoggedIn()" (click)="auth.logout()">
        <mat-icon>logout</mat-icon> Logout
      </button>
    </mat-toolbar>
    <div style="padding: 24px">
      <router-outlet />
    </div>
  `
})
export class AppComponent {
  constructor(public auth: AuthService, private dialog: MatDialog) {}

  openLogin() {
    this.dialog.open(LoginDialogComponent, { width: '360px' });
  }
}
