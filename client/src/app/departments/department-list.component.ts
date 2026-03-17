import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../services/employee.service';
import { Department } from '../models/employee.model';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  template: `
    <h2>Departments</h2>
    <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
    <table mat-table [dataSource]="departments" *ngIf="!loading" style="width:100%;max-width:600px">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let d">{{ d.name }}</td>
      </ng-container>
      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let d">{{ d.description }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="['name','description']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['name','description']"></tr>
    </table>
  `
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  loading = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loading = true;
    this.employeeService.getDepartments().subscribe({
      next: data => { this.departments = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
