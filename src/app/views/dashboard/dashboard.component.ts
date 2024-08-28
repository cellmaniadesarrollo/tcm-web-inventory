import { Component } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import printJS from 'print-js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(private api: ApiService) {}
  cantproducts = 0;
  canstmovementsout = 0;
  canstmovementsreturns = 0;
  cantstock0 = 0;
  cantincome = 0;
  ngOnInit(): void {
    this.datadash();
  }
  async datadash() {
    const data = await this.api.dashboardata();
    // console.log(data)
    this.cantproducts = data.contproducts.cantproducts;
    this.canstmovementsout = data.contmovementsout.SALIDA;
    this.canstmovementsreturns = data.contmovementsout.ENTRADA;
    this.cantstock0 = data.contstock0.cantstock0;
    this.cantincome = data.contincomes.incomestype;
  }

  async getreportout() {
    this.simpleAlert();
    const data = await this.api.getreportstockout();

    printJS({
      printable: data,
      type: 'pdf',
      base64: true,
      showModal: true,
    });
    Swal.close();
    //  console.log(data)
  }
  async simpleAlert() {
    Swal.fire({
      title: '',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
}
