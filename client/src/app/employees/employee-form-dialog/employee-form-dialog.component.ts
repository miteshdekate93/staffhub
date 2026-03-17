import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../services/employee.service';
import { Department, Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Employee' : 'Add Employee' }}</h2>

    <mat-dialog-content style="min-width:360px;padding-top:8px">
      <mat-form-field appearance="outline" style="width:100%;margin-bottom:8px">
        <mat-label>First Name</mat-label>
        <input matInput [(ngModel)]="form.firstName" required>
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%;margin-bottom:8px">
        <mat-label>Last Name</mat-label>
        <input matInput [(ngModel)]="form.lastName" required>
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%;margin-bottom:8px">
        <mat-label>Email</mat-label>
        <input matInput type="email" [(ngModel)]="form.email" required>
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%;margin-bottom:8px">
        <mat-label>Job Title</mat-label>
        <input matInput [(ngModel)]="form.jobTitle" required>
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%;margin-bottom:8px">
        <mat-label>Department</mat-label>
        <mat-select [(ngModel)]="form.departmentId" required>
          <mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Salary</mat-label>
        <input matInput type="number" [(ngModel)]="form.salary" min="0">
      </mat-form-field>

      <p *ngIf="error" style="color:red;margin-top:8px">{{ error }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="saving">
        <mat-spinner *ngIf="saving" diameter="18" style="display:inline-block;margin-right:6px"></mat-spinner>
        {{ data ? 'Save' : 'Add' }}
      </button>
    </mat-dialog-actions>
  `
})
export class EmployeeFormDialogComponent implements OnInit {
  form: Partial<Employee> = {};
  departments: Department[] = [];
  saving = false;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<EmployeeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    if (this.data) {
      this.form = { ...this.data };
    }
    this.employeeService.getDepartments().subscribe({
      next: deps => this.departments = deps,
      error: () => this.error = 'Could not load departments.'
    });
  }

  save() {
    if (!this.form.firstName || !this.form.lastName || !this.form.email || !this.form.jobTitle || !this.form.departmentId) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    this.saving = true;
    this.error = '';

    const request$ = this.data
      ? this.employeeService.updateEmployee(this.data.id, this.form)
      : this.employeeService.createEmployee(this.form);

    request$.subscribe({
      next: emp => this.dialogRef.close(emp),
      error: () => { this.error = 'Failed to save employee. Please try again.'; this.saving = false; }
    });
  }
}
