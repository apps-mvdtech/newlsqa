"use client";

import { useCompany } from "../../context/CompanyContext";
import { useEffect, useState, useRef } from "react";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { UploaderComponent } from "@syncfusion/ej2-react-inputs";
import {
  TextBoxComponent,
  NumericTextBoxComponent,
  ChangeEventArgs as TextBoxChangeEventArgs,
} from "@syncfusion/ej2-react-inputs";
import { showAlertDialog } from "../utilities/ui";
import styles from "../profile/ViewProfile.module.css";
import Image from "next/image";
import { Empresa } from "../../services/domain";
import { validateEmail } from "../utilities/ui";
import { Spinner } from "../utilities/Spinner";

export default function Profile() {
  const { getEmpresa, updateEmpresa, getLogo, uploadLogo } = useCompany();
  const [dataClient, setDataClient] = useState<Empresa | null>(null);
  const [modifiedData, setModifiedData] = useState<Empresa | null>(null);
  const [logo, setLogo] = useState(null);
  const [enabled, setEnabled] = useState(false);
  //const [error, setError] = useState("");
  const uploaderRef = useRef(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const data = await getEmpresa();
      const imgUrl = await getLogo();
      delete data.contactos;
      setLogo(imgUrl);
      setModifiedData(data);
      setDataClient(data);
    } catch (error) {
      console.error(error);

      showAlertDialog({
        title: "Error",
        content:
          "Ocurrio un error al obtener la informacion de la empresa, vuelva a intentar.",
      });
    }
  }

  function changeClient(name: string, value: TextBoxChangeEventArgs["value"]) {
    setModifiedData((prevData) => ({
      ...(prevData as Empresa),
      [`${name}`]: value,
    }));
  }

  function clickButton() {
    if (enabled) {
      changeEmpresa();
    } else {
      setEnabled(true);
    }
  }

  function validateProfile(data: Empresa) {
    const {
      empEmail,
      empRazonSocial,
      empNombreComercial,
      empDirPrincipal,
      empCiudadPrincipal,
    } = data;

    if (empEmail) {
      const mailOk = validateEmail(data.empEmail);
      if (!mailOk) {
        return "El mail ingresado no es correcto";
      }
    }

    if (
      empRazonSocial === "" ||
      empNombreComercial === "" ||
      empDirPrincipal === "" ||
      empCiudadPrincipal === ""
    ) {
      return "No se pueden guardar los cambios, existen campos obligatorios vacios";
    }

    return "";
  }

  async function changeEmpresa() {
    try {
      const msjValidate = validateProfile(modifiedData as Empresa);
      if (msjValidate === "") {
        if (uploaderRef.current.filesData.length > 0) {
          const file = uploaderRef.current.filesData[0].rawFile;
          await uploadLogo(file);
          const newLogo = await getLogo();

          setLogo(newLogo);
        }
        updateEmpresa(modifiedData);
        setEnabled(false);
      } else {
        showAlertDialog({
          title: "Atención",
          content: msjValidate,
        });
      }
    } catch (error) {
      console.error(error);

      showAlertDialog({
        content:
          "Se produjo un error, vuelva a intentarlo. En caso de persistir, comuníquese con el administrador.",
        title: "Error",
      });
    }
  }

  function clickCancel() {
    getData();
    setEnabled(false);
  }

  if (!dataClient) {
    return (
      <div>
        <Spinner></Spinner>
      </div>
    );
  }

  function onBeforeUpload(args): void {
    const sizeInBytes: number = args.filesData[0].size;
    const sizeMB = sizeInBytes / (1024 * 1024);
    if (sizeMB > 1) {
      args.cancel = true;
      showAlertDialog({
        title: "Atención",
        content: "La imagen es muy grande",
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.publicInfo}>
        <h2>Información Pública</h2>
        <div className={styles.publicInfoContent}>
          <div className={styles.logo}>
            {logo && (
              <Image
                src={`data:image/png;base64,${logo}`}
                alt="Company Logo"
                className={styles.image}
                width={100}
                height={100}
              />
            )}

            {enabled && (
              <div className="upload_wrapper">
                <UploaderComponent
                  ref={(scope) => {
                    uploaderRef.current = scope;
                  }}
                  type="file"
                  allowedExtensions=".jpg, .jpeg, .png, .svg"
                  selected={onBeforeUpload}
                  multiple={false}
                />
                <p className={styles.imgMsj}>
                  El tamaño de la imagen no debe superar 1MB
                </p>
              </div>
            )}
          </div>

          <div className={styles.infoDetails}>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Nombre fantasía </strong>
                <strong className={styles.required}>*</strong>
              </label>
              <TextBoxComponent
                enabled={enabled}
                value={modifiedData?.empNombreComercial}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empNombreComercial", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Razón Social </strong>
              </label>
              <TextBoxComponent
                enabled={false}
                value={modifiedData?.empRazonSocial}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empRazonSocial", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Rubro </strong>
              </label>
              <TextBoxComponent
                enabled={false}
                value={modifiedData?.empRubro}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empRubro", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Rut </strong>
              </label>
              <TextBoxComponent
                enabled={false}
                value={modifiedData?.empRuc}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empRuc", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Ejecutivo</strong>
              </label>
              <TextBoxComponent
                enabled={false}
                value={modifiedData?.colDuenoNombre}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Coordinador</strong>
              </label>
              <TextBoxComponent
                enabled={false}
                value={modifiedData?.colCoordinadorNombre}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Telefono :</strong>
              </label>
              <TextBoxComponent
                enabled={enabled}
                value={modifiedData?.empTelPrincipal}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empTelPrincipal", value);
                }}
              ></TextBoxComponent>
            </div>
            {/* <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>País</strong>
                <strong className={styles.required}>*</strong>
              </label>
              <DropDownListComponent
                dataSource={[
                  { PaisId: 1, PaisNombre: "Uruguay" },
                  { PaisId: 2, PaisNombre: "Argentina" },
                  { PaisId: 3, PaisNombre: "Brasil" },
                ]}
                fields={{ value: "PaisId", text: "PaisNombre" }}
                //value={modifiedData.paisEmpresaPaisId}
                enabled={enabled}
                select={(args) => {
                  changeClient("PaisEmpresaPaisId", args.value);
                }}
              ></DropDownListComponent>
            </div> */}
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Ciudad</strong>
                <strong className={styles.required}>*</strong>
              </label>
              <TextBoxComponent
                enabled={enabled}
                value={modifiedData?.empCiudadPrincipal}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empCiudadPrincipal", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Estado </strong>
              </label>
              <TextBoxComponent
                enabled={enabled}
                value={modifiedData?.empEstadoPrincipal}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empEstadoPrincipal", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>CP </strong>
              </label>
              <NumericTextBoxComponent
                format="###"
                enabled={enabled}
                value={modifiedData?.empCPPrincipal}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empCPPrincipal", value);
                }}
              ></NumericTextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Dirección</strong>
                <strong className={styles.required}>*</strong>
              </label>
              <TextBoxComponent
                enabled={enabled}
                value={modifiedData?.empDirPrincipal}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empDirPrincipal", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Email</strong>
              </label>
              <TextBoxComponent
                enabled={enabled}
                value={modifiedData?.empEmail}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empEmail", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Sitio web </strong>
              </label>
              <TextBoxComponent
                enabled={enabled}
                value={modifiedData?.empWebSite}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("empWebSite", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Persona de contacto</strong>
              </label>
              <TextBoxComponent
                enabled={enabled}
                value={modifiedData?.mainContactName}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("mainContactName", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>Teléfono de contacto</strong>
              </label>
              <TextBoxComponent
                enabled={enabled}
                value={modifiedData?.mainContactPhone}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("mainContactPhone", value);
                }}
              ></TextBoxComponent>
            </div>
            <div className={styles.containerLabel}>
              <label className={styles.label}>
                <strong>e-mail de contacto</strong>
              </label>
              <TextBoxComponent
                enabled={enabled}
                value={modifiedData?.mainContactEMail}
                onChange={({ value }: TextBoxChangeEventArgs) => {
                  changeClient("mainContactEMail", value);
                }}
              ></TextBoxComponent>
            </div>
          </div>
        </div>
        <div className={styles.contentButtons}>
          <ButtonComponent className={styles.editButton} onClick={clickButton}>
            {enabled ? "GUARDAR CAMBIOS" : "EDITAR INFORMACIÓN"}
          </ButtonComponent>
          {enabled && (
            <ButtonComponent
              className={styles.cancelButton}
              onClick={clickCancel}
            >
              CANCELAR
            </ButtonComponent>
          )}
        </div>
      </div>
    </div>
  );
}
