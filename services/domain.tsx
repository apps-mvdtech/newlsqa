export interface Empresa {
  empId: number;
  empRazonSocial: string;
  empNombreComercial: string;
  empDirPrincipal: string;
  empCiudadPrincipal: string;
  empEstadoPrincipal: string;
  empCPPrincipal: string;
  empWebSite: string;
  empEmail: string;
  empLogo: string;
  empRuc: string;
  empRubro: string;
  empFechaActualizacion: string;
  empTelPrincipal: string;
  empLongitud: number;
  empLatitud: number;
  empNumeroMiembros: number;
  empNumeroCampos: number;
  colDuenoNombre: string;
  colCoordinadorNombre: string;
  mainContactName: string;
  mainContactPhone: string;
  mainContactEMail: string;
}

export interface Pais {
  PaisId: number;
  PaisNombre: number;
}

export interface Colaborador {
  ColId: number;
  ColNombres: string;
  ColApellidos: string;
}

export interface EmpresaContacto {
  EmpId: number;
  EmpContId: number;
  EmpContNom: string;
  EmpContTel?: string;
  EmpContTelInt?: string;
  EmpContEMail?: string;
  EmpContCargo?: string;
}

export interface Contacto {
  empId: number;
  empContId: number;
  empContNom: string;
  empContTel: string;
  empContTelInt: number;
  empContEMail: string;
  empContCargo: string;
}

export interface Certificado {
  id: number;
  empId: number;
  certificadoNumero: string;
  normaNombre: string;
  estCertNombre: string;
  pin: string;
  pinVisibleParaCliente: boolean;
  etiquetas: Etiquetas[];
  certificadoAlcance: string;
  certificadoFecEmiUlt: string;
  certificadoFecVen: string;
}

export interface Etiquetas {
  id: number;
  empId: number;
  certificadoId: number;
  nombre: string;
}

export interface ServerRepository {
  getEmpresa: () => Empresa;
  getEmpresasContactos: () => [];
  changePassword: ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) => void;
  getCertificados: () => [];
  updateEmpresa: () => Empresa;
}
