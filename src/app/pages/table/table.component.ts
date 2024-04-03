import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit{
  constructor(
    private authService:AuthenticationService
  ) {

  }
  async ngOnInit() {
    await this.getEmployee()
  }
  employees: any[] = [];
  currentPage = 1;
  totalPages:any = [];
  totalEmployees = 0;
  listLimit= [10,15,20,30]
  limit = 10; // 
  sortKey = 'name'; // Default sort key
  sortOrder = 'asc'; // Default sort order

  getEmployee(){
    return new Promise((resolve, reject) =>{
      let baseUrl ='http://localhost:3000/employees'
      let url = `${baseUrl}?page=${this.currentPage}&limit=${this.limit}&sort=${this.sortKey}:${this.sortOrder}`
      this.authService.apiCall('GET', url, null).subscribe(
        async (response: any) => {
          if (response) {
            this.employees = response.employees;
            this.currentPage = response.currentPage;
            this.totalPages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
            console.log('this.totalPages: ', this.totalPages);
            this.totalEmployees = response.totalEmployees;
          }
          resolve(response);
        },
        (error: any) => {
          reject(error);
        }
      )
    }).catch(e=>e)
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.getEmployee();
  }

  
  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getEmployee();
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
      this.getEmployee();
    }
  }

  onLimitChange() {
    this.currentPage = 1; // Reset to first page when limit changes
    this.getEmployee();
  }
  sortBy(key: string): void {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }
    this.getEmployee();
  }
}
