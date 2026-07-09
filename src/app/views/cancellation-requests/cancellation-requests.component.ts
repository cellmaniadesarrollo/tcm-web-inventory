import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CancellationRequestResolveDialogComponent } from './cancellation-request-resolve-dialog/cancellation-request-resolve-dialog.component';
import { ApiService } from '../../service/api/api.service';

@Component({
  selector: 'app-cancellation-requests',
  templateUrl: './cancellation-requests.component.html',
  styleUrls: ['./cancellation-requests.component.css']
})
export class CancellationRequestsComponent {
  rows: any[] = [];
  statusOptions: string[] = ['ALL'];

  filters = {
    status: 'PENDING',
    orderId: '0',
    findlike: '',
  };

  page = 1;
  numperpage = 10;
  totalRecords = 0;
  pageNumbers = 1;

  loading = false;
  private searchTimeout: any;

  resolveModalVisible = false;
  selectedRow: any = null;
  selectedAction: 'accept' | 'reject' = 'accept';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadData();
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page = 1;
      this.loadData();
    }, 400);
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadData();
  }

  goToPage(newPage: number): void {
    if (newPage < 1 || newPage > this.pageNumbers) return;
    this.page = newPage;
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      const params = {
        status: this.filters.status,
        orderId: this.filters.orderId,
        findlike: this.filters.findlike,
        pagination: this.page,
        numperpage: this.numperpage,
      };

      const res = await this.api.cancellationRequestsList(params);

      this.statusOptions = res.statusOptions ?? ['ALL'];
      this.rows = res.intake ?? [];
      this.totalRecords = res.number_of_records ?? 0;
      this.pageNumbers = res.page_numbers ?? 1;
    } catch (err) {
      console.error('Error listando solicitudes de cancelación', err);
    } finally {
      this.loading = false;
    }
  }

  openResolveModal(row: any, action: 'accept' | 'reject'): void {
    this.selectedRow = row;
    this.selectedAction = action;
    this.resolveModalVisible = true;
  }

  closeResolveModal(result: { resolved?: boolean } = {}): void {
    this.resolveModalVisible = false;
    this.selectedRow = null;
    if (result?.resolved) {
      this.loadData();
    }
  }

  statusBadgeClass(status: string): string {
    return 'badge status-badge status-' + status.toLowerCase();
  }
}
