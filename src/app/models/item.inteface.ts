export interface ListbrandI {
  _id?: any;
  name_brands?: any;

}
export interface ListnameI {
  _id?: any;
  name_nameitems?: any;

}

export interface ListmodelI {
  _id?: any;
  business_model?: any;

}

export interface ListcolorI {
  _id?: any;
  color_name?: any;

}
export interface ListtypeI {
  _id?: any;
  type_inventoryflow?: any;

}
export interface ListqualityI {
  _id?: any;
  quality_inventoryflow?: any;

}
export interface ListstateproductI {
  _id?: any;
  stateproduct_inventoryflow?: any;
}
export interface ListstateproductI {
  _id?: any;
  stateproduct_inventoryflow?: any;
}


export interface ListsweightI {
  _id?: any;
  nomenclatureweight?: any;
}
export interface ListsvolumeI {
  _id?: any;
  nomenclaturvolume?: any;
}
export interface ListsstateinventoryI {
  _id?: any;
  state_inventoryflow?: any;
}
export interface ListscomesfromI {
  _id?: any;
  comesfrom?: any;
}
export interface ListnewdataI {
  names:ListnameI[];
  brand: ListbrandI[];
  color: ListcolorI[];
  type: ListtypeI[];
  quality: ListqualityI[];
  stateproduct: ListstateproductI[]; 
  stateinventoryflow:ListsstateinventoryI[];
 // comesfrom:ListscomesfromI[];
}

export interface ListItemsnameI{
  _id?: any;
  inventoryfownameitem?: ListnameI;
  models?:ListmodelI;
  item_price?:any;
  colors: ListcolorI;
  quality:ListqualityI;
  stateproduc:ListstateproductI;
//  globalstock?:any;
}
export interface ListstockI{
  _id?: any;
  stock?: any;
}
export interface ListitemsI{
  _id?: any;
  sku?: any;
  observations?:any;

  items:ListItemsnameI;

 // comesfrom:ListscomesfromI;
  
  stock:ListstockI;
}
export interface ListitemsIN {
  allclients?: any;
  page_numbers?: any;
  actual_page?: any;
  number_of_records?: any;
  number_of_records_per_page?: any;
  intake: ListitemsI[];
  stateproduct: ListstateproductI[];
  pdfbase64?:any;
}

export interface Getimgbase64{
  imgbase64?:any;
  namefile?:any;
}
export interface Getpdfbase64{
  pdfbase64?:any;
  namefile?:any;
}

export interface Getxmlticket{
  xml?:any; 
}

export interface Getoneitem{
  _id?:any;
  id_stock?:any;
  upc?:any;
  sku?:any;
  id_items?:any;
  id_details?:any;
  id_state?:any;
  id_color?:any;
  id_quality?:any;
 // id_comesfrom?:any;
  id_stateproduct_inventoryflow?:any;
  observations?:any;
}

export interface Listmovementsitem{
  _id:any;
  observations_movement:any;
  cant_movement:any;
  date_movement:any;
  movementname:any;
  numordermovement:any;
  sender:any;
  recipient:any;


}
export interface Listincomeshistory{
  _id:any;
  unit_price: any;
  observations:any;
  quantity:any;
  date_income:any;
  document:any;
  supplier:any;
  status:any;
  taxpercentaje:any;

}