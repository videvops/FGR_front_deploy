import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'obtenerEdad'
})

export class AgePipe implements PipeTransform {

  transform(value: Date | string): string {
    // Verificando si es una cadena.
    if(typeof value == 'string') {
      // Si se obtiene como formato Moment (yyyy-mm-ddThh:mm:ss.nnn), se convierte a Date.
      if(value.includes('T')) {
        value = new Date(value);
      }
    }
    let today = moment();
    let birthdate = moment(value, "DD-MM-YYYY");
    let years = today.diff(birthdate, 'years');
    let html:string = years + "";//years + " yr ";
    //html += today.subtract(years, 'years').diff(birthdate, 'months') + " mo";
    return html;
  }

}
