import { useCompany } from "../../context/CompanyContext";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { UploaderComponent } from "@syncfusion/ej2-react-inputs";
import { useRef } from "react";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { showAlertDialog } from "../utilities/ui";
export function DialogForm({ closeDialog }: { closeDialog: () => void }) {
  const { downloadForm, uploadForm } = useCompany();
  const uploaderRef = useRef(null);
  const onBeforeOpen = (args) => {
    args.maxHeight = "initial";
  };

  function valideteDocument() {
    if (uploaderRef.current.filesData.length === 0) {
      showAlertDialog({
        title: "Atención",
        content: "No se a seleccionado un documento",
      });
      return false;
    }

    return true;
  }

  async function uploaderDocument() {
    const isValidate = valideteDocument();
    if (isValidate) {
      try {
        const file = uploaderRef.current.filesData[0].rawFile;
        await uploadForm(file);
        showAlertDialog({
          title: "Atención",
          content: "El formulario se actualizo correctamente",
        });
        closeDialog();
      } catch (error) {
        showAlertDialog({
          title: "Atención",
          content:
            "Ocurrio un error al subir el documento, vuelva a intertar. En caso de persistir comuniquese con el administrador.",
        });
      }
    }
  }

  return (
    <DialogComponent
      beforeOpen={onBeforeOpen}
      header="Formulario"
      isModal={true}
      width="550px"
      close={closeDialog}
      showCloseIcon={true}
    >
      <div>
        <UploaderComponent
          ref={uploaderRef}
          type="file"
          allowedExtensions=".xlsx, .xlsm, .xltx, .xltm, .xlsb, .xls"
          multiple={false}
        ></UploaderComponent>
        <div
          style={{
            margin: "10px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={downloadForm}
        >
          <span>Descargar Formulario</span>
          <span className="e-icons e-download"></span>
        </div>
        <ButtonComponent
          style={{
            width: "100%",
            marginTop: "50px",
            marginBottom: "10px",
            background: "#68c3c0",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
          }}
          onClick={uploaderDocument}
        >
          {"Actualizar formulario"}
        </ButtonComponent>
      </div>
    </DialogComponent>
  );
}
