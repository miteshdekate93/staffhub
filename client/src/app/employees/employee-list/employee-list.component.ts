import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { EmployeeFormDialogComponent } from '../employee-form-dialog/employee-form-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatChipsModule, MatDialogModule
  ],
  template: `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h2 style="margin:0">Employees</h2>
      <button mat-raised-button color="primary" (click)="openAddDialog()">
        <mat-icon>add</mat-icon> Add Employee
      </button>
    </div>

    <mat-form-field appearance="outline" style="width:100%;max-width:400px">
      <mat-label>Search employees</mat-label>
      <input matInput [(ngModel)]="search" (input)="onSearch()" placeholder="Name or email...">
      <mat-icon matSuffix>search</mat-icon>
    </mat-form-field>

    <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px">
      <mat-spinner diameter="40"></mat-spinner>
    </div>

    <table mat-table [dataSource]="employees" *ngIf="!loading" style="width:100%">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let e">{{ e.firstName }} {{ e.lastName }}</td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let e">{{ e.email }}</td>
      </ng-container>
      <ng-container matColumnDef="jobTitle">
        <th mat-header-cell *matHeaderCellDef>Job Title</th>
        <td mat-cell *matCellDef="let e">{{ e.jobTitle }}</td>
      </ng-container>
      <ng-container matColumnDef="department">
        <th mat-header-cell *matHeaderCellDef>Department</th>
        <td mat-cell *matCellDef="let e">
          <mat-chip>{{ e.department?.name }}</mat-chip>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>

    <p *ngIf="!loading && employees.length === 0" style="color:#666">
      No employees found. Click "Add Employee" to get started.
    </p>
  `
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  search = '';
  columns = ['name', 'email', 'jobTitle', 'department'];

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.employeeService.getEmployees(this.search).subscribe({
      next: res => { this.employees = res.items; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() { this.load(); }

  openAddDialog() {
    const ref = this.dialog.open(EmployeeFormDialogComponent, {
      data: null,
      width: '440px'
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }
}
