import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  ListitemsincomeI,
  ListdocumentincomeI,
  ListincomesI,
  ListcountriesI,
  ListrimpeI,
  ListsuppliersincomeI,
  ListstatusincomesI,
} from 'src/app/models/income.inteface';

import { SocketService } from 'src/app/service/socket/socket.service';
import { Subscription } from 'rxjs';
import { SetdataService } from 'src/app/service/setdata/setdata.service';
@Component({
  selector: 'app-inventorysales',
  templateUrl: './inventorysales.component.html',
  styleUrls: ['./inventorysales.component.css']
})
export class InventorysalesComponent {

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private socketService: SocketService,
    private setdataService: SetdataService, 
  ) { }

  ubicacion: { latitud: number; longitud: number } | null = null;
  sucursal: any;

ngOnInit(): void {
  this.obtenerUbicacion();
}

async obtenerUbicacion(): Promise<void> {
  try {
    // Obtener ubicación
    const ubicacion = await new Promise<{ latitud: number; longitud: number }>(
      (resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitud: position.coords.latitude,
                longitud: position.coords.longitude
              });
            },
            (error) => {
              reject('No se pudo obtener la ubicación: ' + error.message);
            }
          );
        } else {
          reject('La geolocalización no está soportada en este navegador.');
        }
      }
    );

    // Guardar ubicación en la variable
    this.ubicacion = ubicacion;

    // Llamar al API con la ubicación
    this.sucursal = await this.api.ubicacionessucursales(this.ubicacion);
    console.log(this.sucursal)
  } catch (error) {
    console.error('Error:', error);
  }

}

  inicio() {
    this.router.navigate(['dashboard']);
  }
}
