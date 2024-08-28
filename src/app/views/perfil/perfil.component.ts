import { Component,ViewChild, } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { UserI } from 'src/app/models/user.interface';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators,FormBuilder,AbstractControl } from '@angular/forms';
import Validation from 'src/app/service/customvalidation/customvalidation.service';
import { AlertsService } from 'src/app/alerts/alerts.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent {
  @ViewChild('closebutton') closebutton: any;
  constructor(
    private api: ApiService,
    private router: Router,
    private alerts: AlertsService, 
    private formBuilder: FormBuilder
  ) {}
   usuario:UserI={};
  ngOnInit(): void {
this.userdetails()
this.loadimg()
  }
  userimg:any=false;
  loadimg(){
    const data= localStorage.getItem('Userimg');
    if(data!='false'){
      
   this.userimg=data
   //console.log(this.userimg)
    }
  }

  perfilForm = new FormGroup({
    pasword_user: new FormControl(''),
    pasword_user1: new FormControl(''),
    img_user:new FormControl(false),
  });
  async userdetails(){
    const data=await this.api.getuserdetails()
    this.usuario=data 
   // console.log(data)
  }
  fieldTextType: boolean = false;
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  submitte=false;
  get f(): { [key: string]: AbstractControl } {
    return this.perfilForm.controls;
  }
iniciarmodal(){
   this.imgsubida =''
   this.imageUrl=''
   this.imageSizeInBytes=0
   this.perfilForm = this.formBuilder.group(
    {
       pasword_user: [
        '' 
      ],
      pasword_user1: [''],
      img_user: [false ],
    },
    {
      validators: [Validation.match('pasword_user', 'pasword_user1')],
    }
  );
}
imgsubida:String=''

imageSizeInBytes: number=0;
imageUrl: any;
async saveedit(data:any){
  this.submitte  = true;

  if (this.perfilForm.invalid) { 
    return;
  } else {
    Swal.fire({
      title: '¿Etitar perfil?',
      text:'Para que los cambios surtan efecto, es necesario volver a iniciar sesión. ¿Deseas continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.closebutton.nativeElement.click();
        const get = await this.api.userdetailsedit(data); 
        if (get == 'OK') { 
          
          this.submitte = false; 
        }
      }
    });




     
  }
//console.log(data)
}

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer && dataTransfer.files.length > 0) {
      const file = dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  handleFile(file: File) {
    if (!file || !file.type.match('image.*')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
      //console.log(this.imageUrl); // Aquí puedes imprimir la imagen en base64 en la consola
      this.imageSizeInBytes = this.calculateSizeInMB(this.imageUrl);
     //console.log('Tamaño de la imagen en megabytes:', this.imageSizeInBytes);
      if(this.imageSizeInBytes>0.01){
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 150;
          const MAX_HEIGHT = 150;
          let width = img.width;
          let height = img.height;
        
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
        
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
        
          if (ctx) { // Verificar si ctx no es nulo
            ctx.drawImage(img, 0, 0, width, height);
        
            let quality = 1.0; // Calidad inicial
        
            // Compresión hasta alcanzar un tamaño de archivo de aproximadamente 1MB
            let imageData = canvas.toDataURL('image/jpeg', quality);
            var imgis=false
            while (this.calculateSizeInMB(imageData) > 0.01) {
              quality -= 0.1; // Reducir calidad en 10%
              imageData = canvas.toDataURL('image/jpeg', quality);
              imgis=true
            } 
            this.imageUrl = imageData;
            this.perfilForm.controls['img_user'].setValue(this.imageUrl)
         
          //  console.log('Imagen comprimida en base64:', this.imageUrl);
           // this.imageSizeInBytes = this.calculateSizeInMB(this.imageUrl);
          //  console.log('Tamaño de la imagen en megabytes:', this.imageSizeInBytes);
          }
        };
          
        
      }else{ 
        this.perfilForm.controls['img_user'].setValue(this.imageUrl) 
      }
    };
    reader.readAsDataURL(file);
 
  }

  selectFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      this.handleFile(file);
    });
    fileInput.click();
  }
  calculateSizeInMB(base64String: string): number {
    // Eliminar el encabezado de la URL de datos
    const base64WithoutHeader = base64String.split(',')[1];
    // Obtener el tamaño de la cadena base64 (en bytes) dividiendo la longitud de la cadena entre 4 y multiplicándola por 3
    const sizeInBytes = (base64WithoutHeader.length * 3) / 4;
    // Convertir bytes a megabytes y redondear a dos decimales
    return sizeInBytes / (1024 * 1024);
  }

  compressTo1MB(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;
      
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
      
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
      
        if (ctx) { // Verificar si ctx no es nulo
          ctx.drawImage(img, 0, 0, width, height);
      
          let quality = 1.0; // Calidad inicial
      
          // Compresión hasta alcanzar un tamaño de archivo de aproximadamente 1MB
          let imageData = canvas.toDataURL('image/jpeg', quality);
          while (this.calculateSizeInMB(imageData) > 1) {
            quality -= 0.1; // Reducir calidad en 10%
            imageData = canvas.toDataURL('image/jpeg', quality);
          }
      
          // Imagen comprimida con tamaño aproximado de 1MB
          this.imageUrl = imageData;
          console.log('Imagen comprimida en base64:', this.imageUrl);
        }
      };
    };
    reader.readAsDataURL(file);
  }

  
}
