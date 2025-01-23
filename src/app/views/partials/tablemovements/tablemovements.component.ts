import { Component } from '@angular/core';

@Component({
  selector: 'app-tablemovements',
  templateUrl: './tablemovements.component.html',
  styleUrls: ['./tablemovements.component.css']
})
export class TablemovementsComponent {
  loading=false
  typestypemovements:any = [];
  typesmovements:any = [];
  numperpagess:any = [];
  movements:any = [];
  ngOnInit(): void {
    this.typestypemovements = [
      { _id: "1", name_movementtype: "Entrada" },
      { _id: "2", name_movementtype: "Salida" },
      { _id: "3", name_movementtype: "Transferencia" }
    ];
  
    this.typesmovements = [
      { _id: "101", name_movement: "Recepción de mercancía" },
      { _id: "102", name_movement: "Envío a cliente" },
      { _id: "103", name_movement: "Devolución" }
    ];
  
    this.numperpagess = [
      { tems: 10, value: "10 por página" },
      { tems: 20, value: "20 por página" },
      { tems: 50, value: "50 por página" }
    ];
  
    this.movements = [
      {
        _id: "1",
        itemsinventory: {
          items: {
            inventoryfownameitem: { name_nameitems: "Producto A" },
            models: { business_model: "Modelo A1" }
          }
        },
        user_sender: { employee: { first_name1: "Juan", last_name1: "Pérez" } },
        user_recipient: { employee: { first_name1: "María", last_name1: "Gómez" } },
        date_movement: "2024-01-01T00:00:00Z",
        name_movement: { name_movement: "Recepción de mercancía" },
        cant_movement: 50,
        numorder: { numorders: "ORD12345" },
        observations_movement: "Sin observaciones"
      },
      {
        _id: "2",
        itemsinventory: {
          items: {
            inventoryfownameitem: { name_nameitems: "Producto B" },
            models: { business_model: "Modelo B2" }
          }
        },
        user_sender: { employee: { first_name1: "Carlos", last_name1: "Ruiz" } },
        user_recipient: { employee: { first_name1: "Ana", last_name1: "Martínez" } },
        date_movement: "2024-01-02T00:00:00Z",
        name_movement: { name_movement: "Envío a cliente" },
        cant_movement: 30,
        numorder: { numorders: "ORD67890" },
        observations_movement: "Revisar estado al recibir"
      }
    ];
  }
}
