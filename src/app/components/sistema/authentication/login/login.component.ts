import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { userCredentials } from 'src/app/models/seguridad/seguridad';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';
import { fadeInUpAnimation } from '../../../../../@fury/animations/fade-in-up.animation';

@Component({
  selector: 'fury-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInUpAnimation]
})
export class LoginComponent implements OnInit {

  formAuth: FormGroup;

  inputType = 'password';
  visible = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar,
              private seguridadService: SeguridadService,
              private mensajeService : MensajesService
  ) {
    this.formAuth = fb.group({
      username: fb.control('initial value', Validators.required)
    });
  }

  ngOnInit() {
    this.formAuth = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /*send() {
    this.router.navigate(['/']);
    this.snackbar.open('Lucky you! Looks like you didn\'t need a password or email address! For a real application we provide validators to prevent this. ;)', 'LOL THANKS', {
      duration: 10000
    });
  }*/

  login(credentials: userCredentials) {
    if(this.formAuth.invalid) {
      this.mensajeService.MensajeErrorStr('Faltan campos por ingresar','Error');
    } else {
      this.seguridadService.login(credentials)
      .subscribe(response => {
        this.seguridadService.guardarToken(response.body);
        this.mensajeService.MensajeSucceed('Hola ' + this.seguridadService.obtenerCampoJWT("friendlyname"), 'Bienvenido');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      }, errores => {
        if (errores.error instanceof ErrorEvent) {
          this.mensajeService.MensajeErrorStr(errores.error.message,'Error');
        } else {
          this.mensajeService.MensajeErrorStr(errores.error,'Error');
        }
      });
    }
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
