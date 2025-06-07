import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { InventoryComponent } from './views/inventory/inventory.component';
import { InventorynewComponent } from './views/inventory/inventorynew/inventorynew.component';
import { MovementsComponent } from './views/movements/movements.component';
import { IncomeComponent } from './views/income/income.component';
import { IncomerepComponent } from './views/incomerep/incomerep.component';
import { PerfilComponent } from './views/perfil/perfil.component';
import { InventoryperComponent } from './views/inventoryper/inventoryper.component';
import { InventorypernewComponent } from './views/inventoryper/inventorypernew/inventorypernew.component';
import { SuppliersComponent } from './views/suppliers/suppliers.component'; 
import { MovementsperComponent } from './views/movementsper/movementsper.component';
import { ReloadComponent } from './views/partials/reload/reload.component';
import { IncomeperComponent } from './views/incomeper/incomeper.component';
import { InventorysalesComponent } from './views/inventorysales/inventorysales.component';
import { InventorysalesnewComponent } from './views/inventorysales/inventorysalesnew/inventorysalesnew.component';
import { MovementssalesComponent } from './views/movementssales/movementssales.component';
import { TicketPrinterComponent } from './views/ticket-printer/ticket-printer.component';
import { IncomesalesComponent } from './views/incomesales/incomesales.component';
import { OutgoingTransfersComponent } from './views/outgoing-transfers/outgoing-transfers.component';
import { NewTransferComponent } from './views/outgoing-transfers/new-transfer/new-transfer.component';
import { ReceivingTransfersComponent } from './views/receiving-transfers/receiving-transfers.component';
 
const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'inventory',component:InventoryComponent },
 // {path:'inventory/:id',component:InventoryComponent },
  {path:'inventorynew',component:InventorynewComponent },
  {path:'movements/:id',component:MovementsComponent },
  {path:'movements',component:MovementsComponent },
  {path:'income',component:IncomeComponent },
  {path:'incomerep',component:IncomerepComponent},
  {path:'incomeper',component:IncomeperComponent},
  {path:'incomesales',component:IncomesalesComponent},
  {path:'perfil',component:PerfilComponent},
  {path:'inventoryper',component:InventoryperComponent},
  {path:'inventorypernew',component:InventorypernewComponent},
  {path:'suppliers',component:SuppliersComponent }, 
  {path:'movementsper',component:MovementsperComponent},
  {path:'reload',component:ReloadComponent },
  {path:'inventorysales',component:InventorysalesComponent },
  {path:'inventorysalesnew',component:InventorysalesnewComponent },
  {path:'movementssales',component:MovementssalesComponent},
  // {path:'ticket-printing',component:TicketPrinterComponent},
  {path:'outgoing-transfers',component:OutgoingTransfersComponent},
  {path:'new-transfers',component:NewTransferComponent},
  {path:'receiving-transfers',component:ReceivingTransfersComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents=[LoginComponent,DashboardComponent,InventoryComponent,InventorynewComponent,MovementsComponent,IncomeComponent,IncomerepComponent,PerfilComponent,InventoryperComponent,InventorypernewComponent,SuppliersComponent,MovementsperComponent,ReloadComponent]
