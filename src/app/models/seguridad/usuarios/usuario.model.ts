import { formatearFecha } from "src/app/utils/utils";

export class CreateUserDTO {
  userName: string;
  email: string;
  friendlyName: number;
  statusAccountId: number;
  resetPassword: boolean;
  personalID:number;

  constructor(user: UserDTO) {
    this.userName = user.userName;
    this.email = user.email;
    this.friendlyName = user.friendlyName;
    this.statusAccountId = user.statusAccountId;
    this.resetPassword = user.resetPassword;
    this.personalID = user.personalID;
  }
}

export class UpdateUserDTO {
  email: string;
  friendlyName: number;
  statusAccountId: number;
  catFiscaliaID: number;
  resetPassword: boolean;
  personalID:number;

  constructor(user: UserDTO) {
    this.email = user.email;
    this.friendlyName = user.friendlyName;
    this.statusAccountId = user.statusAccountId;
    this.catFiscaliaID = user.catFiscaliaID;
    this.resetPassword = user.resetPassword;
    this.personalID = user.personalID;
  }
}

export class UserDTO {
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  accessFailedCount: number;
  friendlyName: number;
  statusAccountId: number;
  userId: number;
  catFiscaliaID: number;
  fechaAlta: Date;
  resetPassword: boolean;
  user: any;
  personalID : number;

  constructor(user: UserDTO) {
    this.id = user.id;
    this.userName = user.userName;
    this.normalizedUserName = user.normalizedUserName;
    this.email = user.email;
    this.normalizedEmail = user.normalizedEmail;
    this.accessFailedCount = user.accessFailedCount;
    this.friendlyName = user.friendlyName;
    this.statusAccountId = user.statusAccountId;
    this.userId = user.userId;
    this.catFiscaliaID = user.catFiscaliaID;
    this.fechaAlta = user.fechaAlta;
    this.resetPassword = user.resetPassword;
    this.personalID = user.personalID;
  }

  get status() {
    return this.statusAccountId;
  }

  get alta() {
    return formatearFecha(new Date(this.fechaAlta));
  }
}

export class Usuario {
  id: number;
  firstName: string;
  lastName: string;
  street: string;
  zipcode: number;
  city: string;
  phoneNumber: string;
  mail: string;

  constructor(ejemplo: Usuario) {
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
