import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetdataService {
  private data: any;

  setData(data: any) {
    console.log("d",data)
    this.data = data;
  }

  getData(): any {
    const tempData = this.data;
    this.data = null; // Elimina el dato después de leerlo
    return tempData;
  }
}
