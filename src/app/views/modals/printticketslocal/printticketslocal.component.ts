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
  selector: 'app-printticketslocal',
  templateUrl: './printticketslocal.component.html',
  styleUrls: ['./printticketslocal.component.css']
})
export class PrintticketslocalComponent {
  @Input() namet1: any;
  @Input() namet2: any;
  @Input() nameb: any;
  @Input() can: any; 
  @Input() qrdata: any; 
  @Output() closeModalEvent = new EventEmitter< any>();
  constructor(
    private api: ApiService,
    private activerouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
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
      reset:new FormControl(false),
  });
  validationsname() {
    this.printform = this.formBuilder.group({  
      topText1:[this.namet1, Validators.required], 
      topText2:[this.namet2, Validators.required], 
      bottomText1:[this.nameb, Validators.required],
       cant:[this.can, Validators.required],
        qrText:[this.qrdata, Validators.required], 
        reset:[false, Validators.required], 
    });
  }
  submitted = false;
  loading=false;

  async onSubmit() {
    this.submitted = true;
    if (this.printform.valid) {
      this.loading=true; 
      const params = new URLSearchParams(this.printform.value)
      const url =`http://192.168.10.250:5000/api/printtikets?${params.toString()}`;//`http://localhost:5000/api/printtikets?${params.toString()}`; //
      window.open(url, '_blank');
  //  const data= await this.api.printticketlocal(this.printform.value)
  //  console.log(data)
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
}
