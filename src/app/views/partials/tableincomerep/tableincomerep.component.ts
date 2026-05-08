import { Component, Input } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-tableincomerep',
  templateUrl: './tableincomerep.component.html',
  styleUrls: ['./tableincomerep.component.css']
})
export class TableincomerepComponent {
  @Input() fontSize: string = '16px';
  @Input() id: string = '';
  @Input() inventory: string = 'INVENTORYFLOW';

  incomeslists: any[] = [];
  loading = true;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.listItems();
  }

  async listItems() {
    this.loading = true;
    const data = await this.api.listincomesCSRS({
      allclients: '0',
      findlike: this.id,
      inventory: this.inventory,
    });
    this.incomeslists = data.intake;
    this.loading = false;
  }

  async aceptar(item: any) {
    Swal.fire({
      title: '¿Cambiar estado a aprobado?',
      text: `${item.quantity} ${item.inventory_snapshot?.name_model} ${item.inventory_snapshot?.name_item}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aprobado',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await this.api.incomeapproved(item._id);
        if (res === 'OK') this.listItems();
      }
    });
  }

  async NOaceptar(item: any) {
    Swal.fire({
      title: '¿Cambiar estado a rechazado?',
      text: `${item.quantity} ${item.inventory_snapshot?.name_model} ${item.inventory_snapshot?.name_item}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Rechazado',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await this.api.incomedesapproved(item._id);
        if (res === 'OK') this.listItems();
      }
    });
  }

  datacolor(estado: string): string {
    switch (estado) {
      case 'RECHAZADO': return 'table-danger';
      case 'APROBADO': return 'table-success';
      default: return '';
    }
  }
}