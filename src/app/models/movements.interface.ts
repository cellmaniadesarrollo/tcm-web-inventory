import { ListbrandI } from "./item.inteface";

export interface UsersMoveI {
  _id?: any;
  employee?: EmployeeMoveI;
}

export interface EmployeeMoveI {
  _id?: any;
  first_name1?: any;
  last_name1?: any;
}

export interface TechnicianeMoveI {
  _id?: UsersMoveI;
 // user?: UsersMoveI;
}
export interface MovementnameI {
  _id?: any;
  name_movement?: any;
}
export interface MovementtypeI {
  _id?: any;
  name_movementtype?: any;
}
export interface MovementsI {
  _id?: any;
  cant_movement?: any;
  date_movement?: any;
  itemsinventory?: ListitemsinventoryIN;
  id_movement_name?: any;
  user_recipient?: ListusersIN;
  user_sender?: ListusersIN;
  uuid_movement?: uuiMoivementIn;
  observations_movement?: any;
  numorder?:NumordersIN;
  name_movement?:NamemovementIn;
}
export interface uuiMoivementIn{
  _id?:any;
  uuid?:any;
}
export interface NamemovementIn{
  _id?:any;
  name_movement?:any
  movementtype?:TypeMovementIN;
}
export interface TypeMovementIN{
  _id?:any;
  name_movementtype?:any
}
export interface NumordersIN{
  _id?:any;
  numorders?:any;
}
export interface ListusersIN{
  _id?: any;
  employee?: ListemployeeIn;
}
export interface ListemployeeIn{
  _id?: any;
  first_name1?: any;
  last_name1?: any;
}

export interface ListitemsinventoryIN{
  _id?: any;
  items?:ListitemsIN;
 
}

export interface ListitemsIN{
_id?:any;
inventoryfownameitem?:ListnameI;
models?:ListmodelsIN;
}
export interface ListnameI {
  _id?: any;
  name_nameitems?: any;

}
export interface ListmodelsIN{
  _id?:any;
  business_model?:any
brand?:ListbrandI;
}

export interface ListmovementsIN {
  allclients?: any;
  alltypes?:any;
  page_numbers?: any;
  actual_page?: any;
  number_of_records?: any;
  number_of_records_per_page?: any;
  intake: MovementsI[];
  // stateproduct: ListstateproductI[];
  pdfbase64?:any;
}

export interface ListonemovementIN{
  movementout?:MovementsI;
  technician?: ListusersIN;
}