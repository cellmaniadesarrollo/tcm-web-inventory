import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api/api.service';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ListsupliersIN } from 'src/app/models/supliers.interface';
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent {
  datapage = {
    allclients: '0',
    alltypes: '0',
    pagination: 1,
    numperpage: '30',
    findlike: '',
  };
  totalentries: any;
  numperpages: any;
  numperpagess = [
    { tems: '20', value: '20' },
    { tems: '30', value: '30' },
    { tems: '50', value: '50' },
    { tems: '100', value: '100' },
  ];
  constructor( 
    private api: ApiService,
    private router: Router, 
  ) {}
  searchForm = new FormGroup({
    valuesearch: new FormControl(''),
  });
  numperpagesForm = new FormGroup({
    valueperpage: new FormControl(''),
  });
  onKeyDownEvent(event: any) {
    this.datapage.findlike = this.searchForm.value.valuesearch || '';
    if (event.target.value.length > 2) {
      this.datapage.pagination = 1;
      this.listitems(this.datapage);
    }
    if (event.target.value.length == 0) {
      this.datapage.pagination = 1;
      this.listitems(this.datapage);
    }
    //  console.log(event.target.value.length)
  }
  findbutton(){
    this.listitems(this.datapage); 
  }
  async listitems(datain: any) {
    const data = await this.api.listmovements(datain);
   // this.movements = data.intake;
    this.numperpages = data.number_of_records_per_page;
    this.totalentries = data.number_of_records;
    this.datapage.allclients = data.allclients;
    this.datapage.pagination = data.actual_page;
    this.datapage.alltypes = data.alltypes;
 
  }
  ngOnInit(): void {
    this.listItems(this.datapage);
    // this.getdataincome();
    // this.makechoice('')
    this.numperpagesForm.setValue({
      valueperpage: this.numperpagess[1].tems,
    });
  }
  supliers:ListsupliersIN[]=[]
  loading: boolean = true;
  async listItems(form: any) {
    this.loading = true;
    const data = await this.api.listsuppliers(form);
    //console.log(data)
    this.loading = false;
    // this.statusincomes = data.statuslist || [];
    this.supliers = data.intake;
    this.numperpages = data.number_of_records_per_page;
    this.totalentries = data.number_of_records;
    this.datapage.allclients = data.allclients;
    this.datapage.pagination = data.actual_page;
    // console.log(this.incomeslists)
    // this.stateincomesform.controls['stateincome'].setValue(
    //   this.datapage.allclients
    // );
  }




  inicio() {
    this.router.navigate(['dashboard']);
  }


 
 


}
