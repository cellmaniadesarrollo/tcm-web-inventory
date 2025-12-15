export interface ListitemsincomeI {
  _id?: any;
  upc?: any;
  sku?: any;
  nameitem?: any;
  //comesfrom?: any;
  modelitem?: any;
  quality?: any;
  stateproduc?: any;
  price?: any;
  colors1?: any;
  idname?: any;
  last_unit_price_income?: any;
  last_income_price?: any;
}
export interface ListinventorysnamesI {
  _id?: any;
  inventory_name?: any;
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
export interface BatchSnapshotI {
  batchNumber?: number;
  identifiers?: string[];
}
export interface ListincomesI {
  _id?: any;
  date_income?: any;
  unit_sales_price?: any;
  unit_price?: any;
  observations?: any;
  quantity?: any;
  incomestype?: ListSatatusincomesI;
  user_create?: any; 
  // ✅ snapshot de lote
  batch_snapshot?: BatchSnapshotI;
  inventory_snapshot: {
    sku?: any;
    upc?: any;
    name_item?: any;
    name_model?: any;
    name_color?: any;
    name_quality?: any;
  };
  inventoryflow?: ListitemsincomeI;
  documentnumberincome?: ListnumberincomeI;
  firstStatus?: { createduser?: any };
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
  inventorys?: ListinventorysnamesI[];
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
  batch?: {
    unitPrice?: any;
    hasTax?: any;
  }
  document_info?: {
    document_number?: any;
  }
}
