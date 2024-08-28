export interface ListsupliersIN {
    _id: any,
    ruc:any,
    razon_social: any,
    address: any,
  }
  export interface  ListsupliersI {
    allclients?: any;
    alltypes?:any;
    page_numbers?: any;
    actual_page?: any;
    number_of_records?: any;
    number_of_records_per_page?: any;
    intake: ListsupliersIN[];
    // stateproduct: ListstateproductI[];
    pdfbase64?:any;
  }