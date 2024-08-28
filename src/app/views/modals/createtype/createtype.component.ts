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
  selector: 'app-createtype',
  templateUrl: './createtype.component.html',
  styleUrls: ['./createtype.component.css']
})
export class CreatetypeComponent {
  @Input() inventory: any; 
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
  typeform: FormGroup = new FormGroup({
    type_inventoryflow: new FormControl(''),
    url:new FormControl(''),
  });
  validationsname() {
    this.typeform = this.formBuilder.group({
      type_inventoryflow: ['', Validators.required],
      url:[this.inventory, Validators.required]
    });
  }
  submitted = false;
  async onSubmitclose() {
    this.submitted = true;
    if (this.typeform.valid) { 
      const data =  await this.api.datanewtype(this.typeform.value,this.inventory);
      if (data) {
        this.closeModal(data,true);
      }
    }
  }
  async onSubmit() {
    
    this.submitted = true;
    if (this.typeform.valid) {
      const data =  await this.api.datanewtype(this.typeform.value,this.inventory);
        if (data) {
        this.validationsname();
        this.closeModal(data,false);
        this.submitted = false;
      }
    }
  }
}
