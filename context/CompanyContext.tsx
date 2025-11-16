// src/context/UserContext.js
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { Empresa, ServerRepository, Contacto } from "../services/domain";
import { showAlertDialog } from "../components/utilities/ui";
// Crear el contexto
const CompanyContext = createContext<CompanyContextInterface | null>(null);

// Crear un hook personalizado para acceder al contexto
export interface CompanyContextInterface {
  getEmpresa: () => Promise<Empresa>;
  updateEmpresa: (recordEmpresa: Empresa) => Promise<any>;
  getEmpresasContactos: () => Promise<Empresa>;
  updateEmpresaContactos: (recordContacto: Contacto) => Promise<any>;
  createContacto: (recordContacto: Contacto) => Promise<any>;
  deleteContacto: (empContId: number) => Promise<boolean>;
  changePassword: (params: {
    oldPassword: string;
    newPassword: string;
  }) => Promise<Response>;
  getCertificados: () => Promise<any>;
  getEtiquetas: (certId: number) => Promise<any>;
  downloadEtiquetas: (
    etiquetaId: number,
    etiquetaNombre: string
  ) => Promise<void>;
  getLogo: () => Promise<string | null>;
  uploadLogo: (file: File) => Promise<void>;
  downloadForm: () => Promise<boolean | null>;
  uploadForm: (file: File) => Promise<void>;
}

export const useCompany = () => {
  return useContext(CompanyContext);
};

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  useEffect(() => {}, [session]);

  //#region Empresa
  async function getEmpresa() {
    const { identity, accessToken } = session?.user ?? {};

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/Empresas`,
        {
          method: "GET",
          cache: "no-cache",
          headers,
        }
      );
      if (!response.ok) {
        //const error = await this.processServerError(response);
        throw new Error("Ocurrio un error");
      }

      const empresa = await response.json();
      return empresa;
    } catch (error) {
      throw error;
    }
  }

  async function updateEmpresa(recordEmpresa: Empresa) {
    const { accessToken } = session?.user ?? {};

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const body = JSON.stringify(recordEmpresa);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/Empresas`,
      {
        method: "PATCH",
        cache: "no-cache",
        headers,
        body,
      }
    );

    if (!response.ok) {
      throw new Error("Ocurrio un error");
    }

    return response.json();
  }
  //#endregion

  //#region contactos
  async function getEmpresasContactos() {
    const { identity, accessToken } = session?.user ?? {};

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/EmpresasContactos`,
        {
          method: "GET",
          cache: "no-cache",
          headers,
        }
      );
      if (!response.ok) {
        //const error = await this.processServerError(response);
        throw new Error("Ocurrio un error");
      }

      const empresa: Empresa = await response.json();
      return empresa;
    } catch (error) {
      throw error;
    }
  }
  async function updateEmpresaContactos(recordContacto: Contacto) {
    const { accessToken } = session?.user ?? {};

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const body = JSON.stringify(recordContacto);
    const empContId = recordContacto.empContId;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/EmpresasContactos/${empContId}`,
      {
        method: "PATCH",
        cache: "no-cache",
        headers,
        body,
      }
    );

    if (!response.ok) {
      throw new Error("Ocurrio un error");
    }

    return response.json();
  }
  async function deleteContacto(empContId: number) {
    const { accessToken } = session?.user ?? {};

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/EmpresasContactos/${empContId}`,
      {
        method: "DELETE",
        cache: "no-cache",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Ocurrio un error");
    }
    return true;
  }
  async function createContacto(recordContacto: Contacto) {
    const { accessToken } = session?.user ?? {};

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const body = JSON.stringify(recordContacto);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/EmpresasContactos`,
      {
        method: "POST",
        cache: "no-cache",
        headers,
        body,
      }
    );

    if (!response.ok) {
      throw new Error("Ocurrio un error");
    }

    return response.json();
  }
  //#endregion

  async function changePassword({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) {
    const { accessToken } = session?.user ?? {};

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/ChangePassword`,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      }
    );

    return response;
  }

  //#region Certificados
  async function getCertificados() {
    const { accessToken } = session?.user ?? {};

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/Certificados`,
        {
          method: "GET",
          cache: "no-cache",
          headers,
        }
      );
      if (!response.ok) {
        throw new Error("Ocurrio un error");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async function getEtiquetas(certId: number) {
    const { accessToken } = session?.user ?? {};

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/etiquetas/${certId}`,
        {
          method: "GET",
          cache: "no-cache",
          headers,
        }
      );
      if (!response.ok) {
        throw new Error("Ocurrio un error");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async function downloadEtiquetas(etiquetaId: number, etiquetaNombre: string) {
    const { accessToken } = session?.user ?? {};

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/etiquetas/Download/${etiquetaId}`,
        {
          method: "GET",
          cache: "no-cache",
          headers,
        }
      );
      if (!response.ok) {
        throw new Error("Ocurrio un error");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = etiquetaNombre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showAlertDialog({
        title: "Atención",
        content:
          "Ocurrió un error al descargar la etiqueta. Por favor, intente nuevamente. Si el problema persiste, comuníquese con el administrador.",
      });
      throw error;
    }
  }

  //#endregion

  async function getLogo() {
    const { accessToken } = session?.user ?? {};

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/Empresas/DownloadLogo`,
        {
          method: "GET",
          cache: "no-cache",
          headers,
        }
      );
      if (!response.ok) {
        return null;
      }
      const byteArray = await response.arrayBuffer();
      const binary = String.fromCharCode(...new Uint8Array(byteArray));
      return btoa(binary);
    } catch (error) {
      console.error("Error en getLogo:", error);
      return null;
    }
  }

  async function uploadLogo(file) {
    const { accessToken } = session?.user ?? {};
    const formData = new FormData();
    formData.append("file", file, file.name);

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/Empresas/UploadLogo`,
        {
          method: "POST",
          cache: "no-cache",
          headers,
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Ocurrio un error");
      }

      //return response.json();
    } catch (error) {
      throw error;
    }
  }

  async function downloadForm() {
    try {
      const link = document.createElement("a");
      link.href = "/api/downloadFormulario";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (err) {
      return null;
    }
  }

  async function uploadForm(file) {
    const { accessToken } = session?.user ?? {};
    const formData = new FormData();
    formData.append("file", file, file.name);

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/Empresas/uploadFormulario`,
        {
          method: "POST",
          cache: "no-cache",
          headers,
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Ocurrio un error");
      }

      //return response.json();
    } catch (error) {
      throw error;
    }
  }

  const context = {
    getEmpresa,
    updateEmpresa,
    getEmpresasContactos,
    updateEmpresaContactos,
    createContacto,
    deleteContacto,
    changePassword,
    getCertificados,
    getEtiquetas,
    downloadEtiquetas,
    getLogo,
    uploadLogo,
    downloadForm,
    uploadForm,
  };

  return (
    <CompanyContext.Provider value={context}>
      {children}
    </CompanyContext.Provider>
  );
};
