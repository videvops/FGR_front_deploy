import { AfterViewInit, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CatColoniaDTO } from 'src/app/models/catalogos/catColonia';
import { CatEntidadFederativaDTO } from 'src/app/models/catalogos/catEntidadFederativa';
import { CatMunicipioDemarcacionTerritorialDTO } from 'src/app/models/catalogos/catMunicipioDemarcacionTerritorial';
import { CatTipoVialidadDTO } from 'src/app/models/catalogos/catTipoVialidad';
import { SENAP_DireccionUbicacion } from 'src/app/models/common/ubicacion';
import { CatalogosService } from 'src/app/services/common/catalogos.service';

@Component({
  selector: 'app-formulario-ubicacion',
  templateUrl: './formulario-ubicacion.component.html',
  styleUrls: ['./formulario-ubicacion.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormularioUbicacionComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormularioUbicacionComponent),
      multi: true,
    }
  ]
})
export class FormularioUbicacionComponent implements OnInit, ControlValueAccessor, OnDestroy {

  
  private _gap = 16;
  gap = `${this._gap}px`;
  col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
  col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;

  form!: FormGroup;

  @Input()
  modelo: SENAP_DireccionUbicacion | any; 

  @Input() catEntidadFed!:number; //--->para hacer el onchange cuando una carpeta derive de una noticia

  subscriptions: Subscription[] = [];
  catEntidadFederativa: CatEntidadFederativaDTO[] = [];
  catMunicipio: CatMunicipioDemarcacionTerritorialDTO[] = [];
  catColonia: CatColoniaDTO[] = [];
  catTipoVialidad: CatTipoVialidadDTO[] = [];

  get value(): SENAP_DireccionUbicacion {
    return this.form.value;
  }

  set value(value: SENAP_DireccionUbicacion) {
    this.form.patchValue(value);
    this.onChange(value);
    this.onTouched();
  }

  constructor(
    private formBuilder: FormBuilder,
    private ubicacionService: CatalogosService
  ) {}




  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {     
    
    // console.log("cat entidad fed");
    // console.log(this.catEntidadFed);

    //CatEntidadFederativa
    this.ubicacionService
      .obtenerCatEntidadFederativaDTO()
      .subscribe((entidadFederativa) => {
        this.catEntidadFederativa = entidadFederativa.body;
      });

    //CatColonia
    this.ubicacionService.obtenerCatColoniaDTO().subscribe((colonia) => {
      this.catColonia = colonia.body;
    });

    //CatTipoVialidad
    this.ubicacionService.obtenerCatTipoVialidadDTO().subscribe((vialidad) => {
      this.catTipoVialidad = vialidad.body;
    });

    this.form = this.formBuilder.group({
      catEntidadFederativaID: ['', Validators.required],
      catMunicipioDemarcacionTerritorialID: ['', Validators.required],
      codigoPostal: [''],
      catColoniaID: [0],
      calleVialidad: [''],
      localidad: [''],
      numeroExterior: [''],   
      numeroInterior: [''],
      catTipoVialidadID: [0],
      latitud: [0],
      longitud: [0],
      colonia:['']
    });

    if (this.modelo !== undefined) {     
      if (this.modelo.catEntidadFederativaID !== undefined) {
        //console.log(this.modelo.catEntidadFederativaID);
        this.onChangeEntidadFederativa(this.modelo.catEntidadFederativaID);
        
      }
      this.form.patchValue(this.modelo);
    }
    
    this.subscriptions.push(
      this.form.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
   

    if(this.catEntidadFed !==undefined ){  //--> cuando una carpeta deriva de una noticia...
        this.onChangeEntidadFederativa(this.catEntidadFed);
      this.form.patchValue(this.modelo);
       
      }  
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  onChangeEntidadFederativa(catEntidadFederativaID: number) {
    this.ubicacionService
      .obtenerMunicipios(catEntidadFederativaID)
      .subscribe((estados) => {
        this.catMunicipio = estados.body;
      });
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.form.valid ? null : { profile: { valid: false } };
  }

 
}
