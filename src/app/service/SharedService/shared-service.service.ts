import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  private dataSource = new BehaviorSubject<any>(null); // Puedes tipar si deseas
  currentData$ = this.dataSource.asObservable();

  setData(data: any) {
    this.dataSource.next(data);
  }
}
