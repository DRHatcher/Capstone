import { Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { APIService } from '../../api-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface RequestData {
  id: string;
  email: string;
  role: string;
}

@Component({
    selector: 'app-approval-requests',
    templateUrl: './approval-requests.component.html',
    styleUrl: './approval-requests.component.scss',
    standalone: false
})
export class ApprovalRequestsComponent {

  displayedColumns: string[] = ['token', 'requestersEmail', 'timestamp', 'role', 'action'];
  dataSource: MatTableDataSource<RequestData>;
  loading = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public apiService: APIService,
    public snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getApprovalRequests();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getApprovalRequests() {
    this.loading = true;
    this.apiService.getApprovalRequests().subscribe((res) => {
      this.dataSource.data = res;
      this.loading = false;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  approve(request: any, action: string) {
    this.loading = true;
    this.apiService.approveReject(request, action).subscribe((res) => {
      this.getApprovalRequests();
    }, (err) => {
      this.loading = false;
    });
  }

}
