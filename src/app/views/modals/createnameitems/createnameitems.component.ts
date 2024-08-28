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
  selector: 'app-createnameitems',
  templateUrl: './createnameitems.component.html',
  styleUrls: ['./createnameitems.component.css'],
})
export class CreatenameitemsComponent { 
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
  nameproductform: FormGroup = new FormGroup({
    nameproduct: new FormControl(''),
  });
  validationsname() {
    this.nameproductform = this.formBuilder.group({
      nameproduct: ['', Validators.required],
    });
  }
  submitted = false;
  async onSubmitclose() {
    this.submitted = true;
    if (this.nameproductform.valid) { 
      const data = await this.api.datanewnameitem(this.nameproductform.value,this.inventory);
      if (data) {
        this.closeModal(data,true);
      }
    }
  }
  async onSubmit() {
    this.submitted = true;
    if (this.nameproductform.valid) { 
      const data = await this.api.datanewnameitem(this.nameproductform.value,this.inventory);
      if (data) {
        this.validationsname();
        this.closeModal(data,false);
        this.submitted = false;
      }
    }
  }
}
