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
import { DymoserviceService } from 'src/app/service/dymoservice/dymoservice.service';
 
@Component({
  selector: 'app-printticketslocal',
  templateUrl: './printticketslocal.component.html',
  styleUrls: ['./printticketslocal.component.css']
})
export class PrintticketslocalComponent {
  @Input() printtype:any
  @Input() namet1: any;
  @Input() namet2: any;
  @Input() nameb: any;
  @Input() can: any; 
  @Input() qrdata: any; 
  @Input() price: any; 
  @Output() closeModalEvent = new EventEmitter< any>();
  constructor(
    private api: ApiService,
    private activerouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private apidymo:DymoserviceService
  ) {}
  closeModal( ) { 
    this.closeModalEvent.emit();
  }

  displayDialog: boolean = false;
  ngOnInit(): void { 
    this.validationsname(); 
    this.showDialog();
  }
  showDialog() {
  
    this.displayDialog = true;
  }
  printform: FormGroup = new FormGroup({
    topText1:new FormControl(''), 
    topText2:new FormControl(''), 
    bottomText1:new FormControl(''),
     cant:new FormControl(''),
      qrText: new FormControl(''), 
      price:new FormControl(null),
      iva: new FormControl(true)
  });
  validationsname() {
    this.printform = this.formBuilder.group({  
      topText1:[this.namet1, Validators.required], 
      topText2:[this.namet2, Validators.required], 
      bottomText1:[this.nameb, Validators.required],
       cant:[this.can, [Validators.required, Validators.min(1)]],
        qrText:[this.qrdata, Validators.required], 
        price:[this.price, Validators.required], 
        iva: [true]
    });
  }
  submitted = false;
  loading=false;

  async onSubmit() {
    this.submitted = true;
    if (this.printform.valid) {
      this.loading=true; 
      if(this.printtype==='dymo'){
     const data= await this.apidymo.printTickets(this.printform.value)
     console.log(data)
      }else {
      const params = new URLSearchParams(this.printform.value)
      const url =  `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;//`http://localhost:5000/api/printtikets?${params.toString()}`;// `https://82d3-186-69-248-234.ngrok-free.app/api/printtikets?${params.toString()}`;//
     window.open(url, '_blank'); 
      }
      
    this.closeModal( )
    }
  } 


  get numero() {
    return this.printform.get('id');
  }
  onInputChange(event: any) {
    const input = event.target.value;
    if (input < 0 || input === '') {
      this.numero?.setValue('');
    }
  }
  onFocus(event: any) { 
    event.target.select();
  }
  getPrecioConIva(): number {
    const price = this.printform.get('price')?.value || 0;
    const conIva = this.printform.get('iva')?.value;
  
    if (!conIva) {
      return price;
    } else {
      return price * 1.15; // suma el 15%
    }
  }
 
}
