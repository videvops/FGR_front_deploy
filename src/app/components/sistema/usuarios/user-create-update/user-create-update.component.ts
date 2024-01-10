import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { Observable, } from 'rxjs';
import { filter, map,startWith,switchMap } from 'rxjs/operators';
import { CatFiscaliasDTO } from 'src/app/models/catalogos/catFiscalias';
import { CatStatusAccountDTO } from 'src/app/models/seguridad/usuarios/status-account.model';
import { UserSIC } from 'src/app/models/seguridad/usuarios/UserSIC';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from 'src/app/models/seguridad/usuarios/usuario.model';
import { CatalogosService } from 'src/app/services/common/catalogos.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios/usuarios.service';
import { parsearErroresAPI } from 'src/app/utils/utils';



@Component({
  selector: 'senap-user-create-update',
  templateUrl: './user-create-update.component.html',
  styleUrls: ['./user-create-update.component.scss']
})
export class UserCreateUpdateComponent implements OnInit {

  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  // filteredOptions!: Observable<string[]>;

  

  form: FormGroup | any;
  mode: 'create' | 'update' = 'create';
  catStatusAccount: CatStatusAccountDTO[] = [];
  userSicList : UserSIC[]=[];
  catFiscalias: CatFiscaliasDTO[] = [];
  errores: string[] = [];

    //Es el selector del autocomplete para que no se despegue la lista de nombres al input
    @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger }) 
    autoComplete!: MatAutocompleteTrigger;


    // Autocomplete
    userSIC = new FormControl('',{ validators: [ Validators.required ]});
    filteredOptions!: UserSIC[];

    userSelectedID : number = 0;
    userSelectedName! : string;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: UserDTO,
              private dialogRef: MatDialogRef<UserCreateUpdateComponent>,
              private fb: FormBuilder,
              private catalogosService:CatalogosService,
              private usuariosService: UsuariosService) {
  }

  ngOnInit() {

  
    if (this.defaults) {
      this.mode = 'update';
     
    } else {
      this.defaults = {} as UserDTO;
 
    }

    if (this.mode === 'create') {
      this.form = this.fb.group({
        id: [this.defaults.id],
        userName: [this.defaults.userName || '', { validators: [ Validators.required ]}],
        friendlyName: [this.defaults.userName ||'', { validators: [ Validators.required ] }],
        email: [this.defaults.email || '', { validators: [ Validators.email ] }],
        statusAccountId: [this.defaults.statusAccountId || 0],
        catFiscaliaID: [this.defaults.catFiscaliaID || 0],
        resetPassword: [this.defaults.resetPassword || false],
       
      });
    } else if (this.mode === 'update') {
      this.form = this.fb.group({
        id: [this.defaults.id],
        userName: [{value: this.defaults.userName || '', disabled: true }, { validators: [ Validators.required ]}],
        friendlyName: [this.defaults.friendlyName || '', { validators: [ Validators.required ] }],
        email: [this.defaults.email || ''],
        statusAccountId: [this.defaults.statusAccountId || 0],
        catFiscaliaID: [this.defaults.catFiscaliaID || 0],
        resetPassword: [this.defaults.resetPassword || false]
      });

      this.userSIC.disable();
      this.userSIC.patchValue(this.defaults.friendlyName);
      this.userSelectedID = this.defaults.personalID;
      console.log(this.userSelectedID)


    }

    this.catalogosService.getStatusAccount()
      .subscribe((response: HttpResponse<CatStatusAccountDTO[]> | any) => {
        this.catStatusAccount = response.body;
      });

  }

  save() {
    if (this.mode === 'create') {
      this.createUser();
    } else if (this.mode === 'update') {
      this.updateUser();
    }
  }

  createCustomer() {
    const customer = this.form.value;
    this.dialogRef.close(customer);
  }

  createUser() {
    const userDTO = this.form.value;
    const createUserDTO = new CreateUserDTO(userDTO);
    createUserDTO.personalID = this.userSelectedID;
    console.log(createUserDTO);

    // Create user in backend
    this.usuariosService.createUser(createUserDTO).subscribe(() => {
      this.dialogRef.close(userDTO);
    }, (error: any) => this.errores = ['Ocurrio un error, intente nuevamente!']);
  }

  updateCustomer() {
    const customer = this.form.value;
    customer.id = this.defaults.id;

    this.dialogRef.close(customer);
  }

  updateUser() {
    const userDTO = this.form.value;
    userDTO.id = this.defaults.id;
    const updateUserDTO = new UpdateUserDTO(userDTO);
    updateUserDTO.personalID = this.userSelectedID;
  

    // Update user in backend
    this.usuariosService.updateUser(userDTO.id, updateUserDTO).subscribe(() => {
      this.dialogRef.close(userDTO);
    }, (error: any) => this.errores = ['Ocurrio un error, intente nuevamente!']);
  }

  cancel(event: any) {
    event.preventDefault();
    this.dialogRef.close(this.defaults);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  onShopSelectionChanged(event) {
    const selectedValue = event.option.id;
    const selectedName = event.option.value;

    console.log(selectedValue);
    console.log(selectedName);
    this.userSelectedID = selectedValue;
    this.userSelectedName = selectedName;

    this.form.get("friendlyName").setValue(this.userSelectedName);

  }

  onSearchChange(searchValue: string): void {  

    this.userSelectedID = 0;
    if(searchValue.length >= 0 && searchValue.length <=3 ){
      this.userSicList = [];
      this.filteredOptions = [];
    }


    else if(searchValue.length >= 4){
 
      this.catalogosService.UserSIC(searchValue).subscribe((userSic: HttpResponse<UserSIC[]> | any) => {
        this.userSicList = [];
        this.userSicList= userSic;
        this.filteredOptions = this.userSicList.filter(option => option.nCompleto.includes(searchValue));
        
     
      }, (error: any) => this.errores = ['Ocurrio un error, intente nuevamente!']);

      
  
  
    
    }

  


  }


  // private _filter(value: any) {
  //   const filterValue = value;
  //     return this.userSicList.filter(option => option.nCompleto.toLowerCase().includes(filterValue));
  // }







}
