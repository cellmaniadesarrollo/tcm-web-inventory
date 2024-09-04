import { Component, Input } from '@angular/core';
import { ListincomesI } from 'src/app/models/income.inteface';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ApiService } from 'src/app/service/api/api.service';
@Component({
  selector: 'app-tableincomerep',
  templateUrl: './tableincomerep.component.html',
  styleUrls: ['./tableincomerep.component.css']
})
export class TableincomerepComponent {
  @Input() fontSize: string = '16px';
  @Input() id: string = '';
  constructor(
    private api: ApiService,
  ) { }
  datapage = {
    allclients: '0',
    pagination: 1,
    numperpage: '30',
    findlike: '',
  };
  incomeslists: ListincomesI[] = [];

  loading: boolean = true;
  ngOnInit(): void { 
      this.datapage.findlike = this.id
      this.listItems(this.datapage); 
  }

  async listItems(form: any) {

    const data = await this.api.listincomesCSRS(form);
    
    this.incomeslists = data.intake;
    this.loading=false
  }


  async aceptar(data: any) {
    Swal.fire({
      title: '¿Cambiar estado a aprobado?',
      text:
        data.quantity +
        ' ' +
        data.inventoryflow.modelitem +
        ' ' +
        data.inventoryflow.nameitem,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aprobado',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const asa = await this.api.incomeapproved(data._id);
        if (asa == 'OK') {
          this.listItems(this.datapage);
        }
      }
    });
  }
  async NOaceptar(data: any) {
    Swal.fire({
      title: '¿Cambiar estado a rechazado?',
      text:
        data.quantity +
        ' ' +
        data.inventoryflow.modelitem +
        ' ' +
        data.inventoryflow.nameitem,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Rechazado',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const asa = await this.api.incomedesapproved(data._id);
        if (asa == 'OK') {
          this.listItems(this.datapage);
        }
      }
    });
  }
  datacolor(data: any) {
    switch (data) {
      case 'RECHAZADO':
        return 'table-danger';
      case 'APROBADO':
        return 'table-success';
    }
    return '';
  }
}
