import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-movementsper',
  templateUrl: './movementsper.component.html',
  styleUrls: ['./movementsper.component.css']
})
export class MovementsperComponent {
  constructor(
 
    private router: Router, 
  ) {}


  inicio() {
    this.router.navigate(['dashboard']);
  }
}
