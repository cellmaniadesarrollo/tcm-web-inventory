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

@Component({
  selector: 'app-createbrand',
  templateUrl: './createbrand.component.html',
  styleUrls: ['./createbrand.component.css']
})
export class CreatebrandComponent { 
  @Input() inventory:any;
  @Output() closeModalEvent = new EventEmitter<{ data: any }>();
  constructor(
    private api: ApiService,
    private activerouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  closeModal(data:any,close:boolean) {
    const datos = {data:data,close:close  };
    this.closeModalEvent.emit({ data: datos });
  }

  displayDialog: boolean = false;
  ngOnInit(): void {
    this.validationsname();
    this.showDialog();
  }
  showDialog() {
    this.displayDialog = true;
  }
  marcaform: FormGroup = new FormGroup({
    name_brands: new FormControl(''),
  }); 
  validationsname() {
    this.marcaform = this.formBuilder.group({
      name_brands: ['', Validators.required],
    });
  }
  submitted = false;
  async onSubmitclose() {
    this.submitted = true;
    if (this.marcaform .valid) {
      const data = await this.api.datanewmarca(this.marcaform.value,this.inventory);
      if (data) {
        this.closeModal(data,true);
      }
    }
  }
  async onSubmit() {
    this.submitted = true;
    if (this.marcaform .valid) { 
      const data = await this.api.datanewmarca(this.marcaform.value,this.inventory);
      if (data) {
        console.log(data)
        this.validationsname();
        this.closeModal(data,false);
        this.submitted = false;
      }
    }
  }
}
