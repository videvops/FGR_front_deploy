export interface creacionEjemploDTO {
  nombre: string;
  descripcion: string;
  edad: number
}

export interface ejemploDTO {
  id: number;
  nombre: string;
  descripcion: string;
  edad: number
}

export class Ejemplo {
  id: number;
  firstName: string;
  lastName: string;
  street: string;
  zipcode: number;
  city: string;
  phoneNumber: string;
  mail: string;

  constructor(ejemplo: Ejemplo) {
    this.id = ejemplo.id;
    this.firstName = ejemplo.firstName;
    this.lastName = ejemplo.lastName;
    this.street = ejemplo.street;
    this.zipcode = ejemplo.zipcode;
    this.city = ejemplo.city;
    this.phoneNumber = ejemplo.phoneNumber;
    this.mail = ejemplo.mail;
  }

  get name() {
    let name = '';

    if (this.firstName && this.lastName) {
      name = this.firstName + ' ' + this.lastName;
    } else if (this.firstName) {
      name = this.firstName;
    } else if (this.lastName) {
      name = this.lastName;
    }

    return name;
  }

  set name(value) {
  }

  get address() {
    return `${this.street}, ${this.zipcode} ${this.city}`;
  }

  set address(value) {
  }
}
