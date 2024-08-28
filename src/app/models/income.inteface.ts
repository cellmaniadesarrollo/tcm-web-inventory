export interface ListitemsincomeI {
  _id?: any;
  upc?: any;
  nameitem?: any;
  //comesfrom?: any;
  modelitem?: any;
  quality?: any;
  stateproduc?: any;
  price?: any;
  colors1?: any;
  idname?:any;
}
export interface ListinventorysnamesI {
 _id?:any;
 inventory_name?:any; 
}
export interface ListdocumentincomeI {
  _id?: any;
  name_type_document?: any;
}
export interface ListtaxesnameI {
  _id?: any;
  tax_name?: any;
}
export interface ListtaxespercentajeI {
  _id?: any;
  percentaje?: any;
}
export interface ListsuppliersincomeI {
  _id?: any;
  razon_social: 1;
  countriel: ListcountriesI;
}
export interface ListincomesI {
  _id?: any;
  date_income?: any;
  unit_price?: any;
  observations?: any;
  quantity?: any;
  incomestype?: ListSatatusincomesI;
  inventoryflow?: ListitemsincomeI;
  documentnumberincome?: ListnumberincomeI;
}
export interface ListstatusincomesI {
  _id?: any;
  name_incomestypes?: any;
}
export interface ListnumberincomeI {
  _id?: any;
  document_number?: any;
  supplier?: ListsupplierI;
  taxpercentaje?: ListtaxespercentajeI;
}
export interface ListsupplierI {
  _id?: any;
  razon_social?: any;
}
export interface ListSatatusincomesI {
  _id?: any;
  name_incomestypes?: any;
}
export interface ListincomesIN {
  allclients?: any;
  inventorys?:ListinventorysnamesI[];
  page_numbers?: any;
  actual_page?: any;
  number_of_records?: any;
  number_of_records_per_page?: any;
  intake: ListincomesI[];
  statuslist?: ListstatusincomesI[];
}

export interface ListcountriesI {
  _id?: any;
  name_countrie?: any;
}
export interface ListrimpeI {
  _id?: any;
  name_rimpe?: any;
}

export interface ListIncomeseditI {
  _id?: any;
  observations?: any;
  unit_price?: any;
  items?: {
    _id?: any;
    itemsinventory?: {
      _id?: any;
      item_price?: any;
    };
  };
}
