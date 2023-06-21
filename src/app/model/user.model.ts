export interface UserDataModel {
  idUsuario: string;
  nombres: string;
  apaterno: string;
  amaterno: string;
  correo: string;
  dni: string;
  fechaNacimiento: string;
  fechaRegistro?: Date;
  ubigeo: string;
  role: string;
}

export interface UbigeoDataModel {
  idUbigeo: number;
  departamento: string;
  provincia: string;
  distrito: string;
}

export interface RoleDataModel {
  idRol: number;
  nombre: string;
  estado: string;
}
