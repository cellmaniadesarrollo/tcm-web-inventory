import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule,routingComponents  } from './app-routing.module';
import { AppComponent } from './app.component'; 


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { HeaderComponent } from './views/templates/header/header.component';
import { FooterComponent } from './views/templates/footer/footer.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgToastModule } from 'ng-angular-popup'
import {NgbModule,NgbModalModule} from '@ng-bootstrap/ng-bootstrap'; 
import { DatePipe } from '@angular/common';
import { SidebarComponent } from './views/templates/sidebar/sidebar.component'; 
 
 
import { MatSelectModule } from '@angular/material/select'; 
 
 
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CreatenameitemsComponent } from './views/modals/createnameitems/createnameitems.component';
import { CreatebrandComponent } from './views/modals/createbrand/createbrand.component';
import { CreatemodelComponent } from './views/modals/createmodel/createmodel.component';
import { CreatetypeComponent } from './views/modals/createtype/createtype.component';
import { CreatecolorComponent } from './views/modals/createcolor/createcolor.component';
import { CreatequalityComponent } from './views/modals/createquality/createquality.component';
import { CreatestateiteminventoryComponent } from './views/modals/createstateiteminventory/createstateiteminventory.component';
import { PrinttiketsitemsComponent } from './views/modals/printtiketsitems/printtiketsitems.component';
import { OptionsitemsComponent } from './views/modals/optionsitems/optionsitems.component';
import { EdititemsComponent } from './views/partials/edititems/edititems.component';
import { DevelopmentComponent } from './views/partials/development/development.component';
import { OutsComponent } from './views/partials/outs/outs.component';
import { PrintticketslocalComponent } from './views/modals/printticketslocal/printticketslocal.component';
import { TablemovementsComponent } from './views/partials/tablemovements/tablemovements.component';
import { ReloadComponent } from './views/partials/reload/reload.component';
import { ReportwassapincomesComponent } from './views/modals/reportwassapincomes/reportwassapincomes.component';
import { ReporpricespdfincomesComponent } from './views/modals/reporpricespdfincomes/reporpricespdfincomes.component'; 
  
@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    CreatenameitemsComponent,
    CreatebrandComponent,
    CreatemodelComponent,
    CreatetypeComponent,
    CreatecolorComponent,
    CreatequalityComponent,
    CreatestateiteminventoryComponent,
    PrinttiketsitemsComponent,
    OptionsitemsComponent,
    EdititemsComponent,
    DevelopmentComponent,
    OutsComponent,
    PrintticketslocalComponent,
    TablemovementsComponent,
    ReportwassapincomesComponent,
    ReporpricespdfincomesComponent, 
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule addedng g s se  
    NgxPaginationModule,
    TagInputModule,
   SweetAlert2Module,
    NgToastModule,
    NgbModule, 
    MatSelectModule,
    NgbModalModule,
    ButtonModule,
    DialogModule, 
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
