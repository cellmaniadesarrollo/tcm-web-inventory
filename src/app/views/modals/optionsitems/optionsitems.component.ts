import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import printJS from 'print-js';
@Component({
  selector: 'app-optionsitems',
  templateUrl: './optionsitems.component.html',
  styleUrls: ['./optionsitems.component.css'],
})
export class OptionsitemsComponent {
  @Input() title: any;
  @Input() iditem: any;
  @Output() closeModalEvent = new EventEmitter<{ data: any }>();
  constructor(
    private api: ApiService,
    private activerouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  closeModal(data: any, close: boolean) {
    const datos = { data: data, close: close };
    this.closeModalEvent.emit({ data: datos });
  }
 
  displayDialog: boolean = false;
  ngOnInit(): void {   
    this.showDialog();
    this.change();
  }
  showDialog() {
    this.displayDialog = true;
  }
 
  loading = false; 
  
  active = 1; 
  partialVisible1: boolean = false;
  partialVisible: boolean = false;
  partialVisible2: boolean = false;
  partialVisible3: boolean = false;
  openPartialedit() {
    this.partialVisible1 = true;
  }
  closePartialedit(event:any) { 
    this.closeModal( event,  true)
  }
  openPartialmovement() {
    this.partialVisible = true;
  }
  closePartialmovement(event: { data: any }) {
    if (event.data.close) {
      this.partialVisible = false;
    }
  }
  change() {
    switch (this.active) {
      case 1:
        this.partialVisible = true;
        this.partialVisible1 = false;
        this.partialVisible2 = false;
        this.partialVisible3 = false;
        break;
      case 2:
        this.partialVisible = false;
        this.partialVisible1 = true;
        this.partialVisible2 = false;
        this.partialVisible3 = false;
        break;
      case 3:
        this.partialVisible = false;
        this.partialVisible1 = false;
        this.partialVisible2 = true;
        this.partialVisible3 = false;
        break;
      case 4:
        this.partialVisible = false;
        this.partialVisible1 = false;
        this.partialVisible2 = false;
        this.partialVisible3 = true;
        break;
      default:
        break;
    } 
  }
 
}
