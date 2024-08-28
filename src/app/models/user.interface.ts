export interface UserI {
  _id?: any;
  name_user?: any;
  employee?:EmployeeI;
  user_groups?:UsergroupI[];

}
export interface UsergroupI {
  _id?:any;
  groups?:any;
}
export interface EmployeeI {
  _id?: any;
  first_name1?: any;
  first_name2?: any;
  last_name1?: any;
  last_name2?: any;
  dni?: any;
  birthdate?: any;
  date_of_admission?: any;
  email_personal?: any;
  email_business?: any;
  addres?: any;
  phone_personal?: any;
  phone_business?: any;
  genders?: GenderI;
}
export interface GenderI {
  _id?:any;
  name?:any;
}