import { formatearFecha } from "src/app/utils/utils";

export class RoleDTO {
  id: string;
  name: string;
  normalizedName: string;
  descripcion: string;
  fechaAlta: Date

  constructor(role: RoleDTO) {
    this.id = role.id;
    this.name = role.name;
    this.normalizedName = role.normalizedName;
    this.descripcion = role.descripcion;
    this.fechaAlta = role.fechaAlta;
  }

  get alta() {
    return formatearFecha(new Date(this.fechaAlta));
  }
}

export class CreateUpdateRoleDTO {
  name: string;
  descripcion: string;

  constructor(user: RoleDTO) {
    this.name = user.name;
    this.descripcion = user.descripcion;
  }
}
