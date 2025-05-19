"use client";
import {
  ColumnDirective,
  ColumnsDirective,
  Edit,
  Filter,
  GridComponent,
  Inject,
  Search,
  Sort,
  Toolbar,
  ActionEventArgs,
} from "@syncfusion/ej2-react-grids";
import { useCompany } from "../../context/CompanyContext";
import { Contacto } from "../../services/domain";

import { useRef, useEffect, useState } from "react";
import { showAlertDialog } from "../utilities/ui";
import ContactDialog from "./ContactDialog";

export default function Contacts() {
  const {
    getEmpresasContactos,
    updateEmpresaContactos,
    createContacto,
    deleteContacto,
  } = useCompany();
  const gridRef = useRef(null);
  const [data, setData] = useState<Contacto[]>([]);
  const [refreshGrid, setRefreshGrid] = useState(true);

  useEffect(() => {
    if (refreshGrid) {
      initialData();
      setRefreshGrid(false);
    }
  }, [refreshGrid]);

  async function initialData() {
    try {
      const response = await getEmpresasContactos();
      setData(response);
    } catch (error) {
      console.log(error);
    }
  }

  function actionComplete(args: ActionEventArgs) {
    const { requestType, dialog } = args;
    if (requestType === "add") {
      dialog.header = "Agregar nuevo contacto";
    } else if (requestType === "beginEdit") {
      dialog.header = "Editar contacto";
    }

    if (["add", "beginEdit"].includes(requestType)) {
      dialog.element.style.maxHeight = "initial";
      dialog.width = "50%";
      dialog.height = "50%";
    }
  }

  async function actionBegin(args: ActionEventArgs) {
    const { requestType, data, action } = args;
    try {
      if (requestType === "save") {
        if (action === "edit") {
          const response = await updateEmpresaContactos(data);
          if (response) {
            setRefreshGrid(true);
          }
        }
        if (action === "add") {
          const response = await createContacto(data);
          if (response) {
            setRefreshGrid(true);
          }
        }
      }
      if (requestType === "delete") {
        const response = await deleteContacto(data[0].empContId);
        if (response) {
          setRefreshGrid(true);
        }
      }
    } catch (error) {
      console.error(error);

      showAlertDialog({
        title: "Error",
        content:
          "Ocurrio un error al actualizar el contacto, vuelva a intertar. En caso de persistir comuniquese con el administrador.",
      });
    }
  }

  return (
    <div style={{ margin: "10px" }}>
      <GridComponent
        ref={(scope) => {
          gridRef.current = scope;
        }}
        allowTextWrap={false}
        allowSorting={true}
        allowFiltering={true}
        filterSettings={{ type: "Excel", ignoreAccent: true }}
        dataSource={data}
        toolbar={["Add", "Edit", "Delete"]}
        actionComplete={actionComplete}
        actionBegin={actionBegin}
        editSettings={{
          mode: "Dialog",
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          template: (props) => {
            return <ContactDialog props={props}></ContactDialog>;
          },
        }}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="empContId"
            isPrimaryKey={true}
            visible={false}
          />
          <ColumnDirective
            field="empContNom"
            headerText="Nombre y Apellido"
            width="100"
            type="string"
          />
          <ColumnDirective
            field="empContTel"
            headerText="Telefono"
            width="100"
            type="string"
          />
          <ColumnDirective
            field="empContTelInt"
            headerText="Telefono interno"
            width="100"
            type="string"
          />
          <ColumnDirective
            field="empContEMail"
            headerText="Email"
            width="100"
            type="string"
          />
          <ColumnDirective
            field="empContCargo"
            headerText="Cargo"
            width="100"
            type="string"
          />
        </ColumnsDirective>
        <Inject services={[Filter, Search, Sort, Toolbar, Edit]} />
      </GridComponent>
    </div>
  );
} /*]);

/*
const ImageViewer = ({ byteArray }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (byteArray) {
      const blob = new Blob([byteArray], { type: "image/png" }); // Cambia el tipo según la imagen
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    }
  }, [byteArray]);

  return <img src={imageUrl} alt="Imagen desde bytes" />;
};

// Ejemplo de uso
const byteArray = new Uint8Array([/* datos de la imagen en bytes */
/*export default function App() {
  return <ImageViewer byteArray={byteArray} />;
}

*/
