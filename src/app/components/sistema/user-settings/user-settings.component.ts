import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInRightAnimation } from '../../../../@fury/animations/fade-in-right.animation';
import { scaleInAnimation } from '../../../../@fury/animations/scale-in.animation';
import { fadeInUpAnimation } from '../../../../@fury/animations/fade-in-up.animation';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios/usuarios.service';
import { Router } from '@angular/router';
import { MyErrorStateMatcher } from 'src/app/models/seguridad/usuarios/error-state-matcher';

@Component({
  selector: 'senap-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation, scaleInAnimation]
})
export class UserSettingsComponent implements OnInit {

  formPassword: FormGroup | any;
  formAvatar: FormGroup | any;
  fiscaliaId: string = "";
  updateAvatar: boolean = true;
  updatePass: boolean = true;
  errores: string[] = [];
  matcher = new MyErrorStateMatcher();
  tipo: boolean = true;

  private _gap = 16;
  gap = `${this._gap}px`;
  col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
  col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;
  col4 = `1 1 calc(25% - ${this._gap / 1.3}px)`;

  constructor(private _fb: FormBuilder, private _seguridadService: SeguridadService, private _usuariosService: UsuariosService, private _router: Router) {
  }

  ngOnInit() {
    console.log("_gap = ", this._gap);
    console.log("gap = ", this.gap);
    console.log("col2 = ", this.col2);
    console.log("col3 = ", this.col3);
    console.log("col4 = ", this.col4);

    this.fiscaliaId = this._seguridadService.obtenerCampoJWT("CatFiscaliaID");

    this.initFormPassword();
    this.initFormAvatar();
  }

  imageSelected(file: File) {
    this.formAvatar.get('avatar').setValue(file);
  }

  initFormPassword() {
    this.formPassword = this._fb.group({
      currentPassowrd: ['', { validators: [ Validators.required ] }],
      newPassword:  ['', { validators: [ Validators.required ] }],
      confirmPassword:  ['', { validators: [ Validators.required ] }]
    }, { validators: this.checkPasswords });
  }

  initFormAvatar() {
    this.formAvatar = this._fb.group({
      catFiscaliaID: [this.fiscaliaId || 0, { validators: [ Validators.required ]}],
      avatar: ['', { validators: [ Validators.required ] }]
    });
  }

  updatePassword() {
    this.errores = [];
    this.updatePass = false;
    this._usuariosService.updatePassword(this._seguridadService.getUserId(), this.formPassword.value)
      .subscribe(() => {
        this.tipo = false;
        this.errores = ['Contraseña actualizada!'];
        this.formPassword.reset();
      }, err => {
        this.tipo = true;
        this.errores = ['Ocurrio un error, intente nuevamente!']
      });
  }

  changeAvatar() {
    this.errores = [];
    this.updateAvatar = false;
    this._usuariosService.saveAvatar(this.formAvatar.value)
      .subscribe(() => {
        this.tipo = false;
        this.errores = ['Avatar actualizado!']
        this.formAvatar.reset();
      }, err => {
        this.tipo = true;
        this.errores = ['Ocurrio un error, intente nuevamente!']
      });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { notSame: true }
  }
}
