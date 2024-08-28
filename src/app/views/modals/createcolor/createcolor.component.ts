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
  selector: 'app-createcolor',
  templateUrl: './createcolor.component.html',
  styleUrls: ['./createcolor.component.css']
})
export class CreatecolorComponent {
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
  colorform: FormGroup = new FormGroup({
    color_name: new FormControl(''),
  }); 
  validationsname() {
    this.colorform = this.formBuilder.group({
      color_name: ['', Validators.required],
    });
  }
  submitted = false;
  async onSubmitclose() {
    this.submitted = true;
    if (this.colorform.valid) {
      const data = await this.api.datanewcolor(this.colorform.value,this.inventory);
      if (data) {
        this.closeModal(data,true);
      }
    }
  }
  async onSubmit() {
    this.submitted = true;
    if (this.colorform.valid) { 
      const data =await this.api.datanewcolor(this.colorform.value,this.inventory);
      if (data) { 
        this.validationsname();
        this.closeModal(data,false);
        this.submitted = false;
      }
    }
  }
}
