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
  selector: 'app-printtiketsitems',
  templateUrl: './printtiketsitems.component.html',
  styleUrls: ['./printtiketsitems.component.css'],
})
export class PrinttiketsitemsComponent {
  @Input() title: any;
  @Input() cant: any;
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
    console.log(this.title,this.cant)
    this.validationsname();
    this.showDialog();
  }
  showDialog() {
    this.displayDialog = true;
  }
  printform: FormGroup = new FormGroup({
    id: new FormControl(''),
    cantt: new FormControl(''),
    large:new FormControl(''),
  });
  validationsname() {
    this.printform = this.formBuilder.group({
      id: [this.title, Validators.required],
      cantt: [ this.cant, Validators.required],
      large: [ false, Validators.required],
    });
  }
  submitted = false;
  loading=false;
  async onSubmit() {
    this.submitted = true;
    if (this.printform.valid) {
      this.loading=true;
      const data = await this.api.getpdfbase64per(this.printform.value); 
      if (data) { 
        this.closeModal(data, true);
          printJS({
      printable: data.pdfbase64,
      type: 'pdf',
      base64: true,
      showModal: true,
    }); 
      }
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
