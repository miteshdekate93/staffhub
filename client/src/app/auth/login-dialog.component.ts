import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Login</h2>
    <mat-dialog-content style="min-width:300px;padding-top:8px">
      <mat-form-field appearance="outline" style="width:100%;margin-bottom:8px">
        <mat-label>Username</mat-label>
        <input matInput [(ngModel)]="username" (keyup.enter)="login()">
      </mat-form-field>
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Password</mat-label>
        <input matInput type="password" [(ngModel)]="password" (keyup.enter)="login()">
      </mat-form-field>
      <p style="color:#888;font-size:13px;margin-top:4px">Demo credentials: admin / admin123</p>
      <p *ngIf="error" style="color:red">{{ error }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="login()" [disabled]="loading">
        <mat-spinner *ngIf="loading" diameter="18" style="display:inline-block;margin-right:6px"></mat-spinner>
        Login
      </button>
    </mat-dialog-actions>
  `
})
export class LoginDialogComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>, private auth: AuthService) {}

  login() {
    if (!this.username || !this.password) { this.error = 'Enter username and password.'; return; }
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => { this.error = 'Invalid username or password.'; this.loading = false; }
    });
  }
}
