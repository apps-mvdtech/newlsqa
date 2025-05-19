import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";

interface ContactDialogProps {
  empContNom?: string;
  empContTel?: string;
  empContTelInt?: string;
  empContEMail?: string;
  empContCargo?: string;
}

function ContactDialog({ props }: { props: ContactDialogProps }) {
  /*
  Encargado de la certificación
Encargado por facturación 
Desarrollo de personas / RRHH
Posible de escribir cualquier cargo
  */

  const OPTIONS = [
    "Encargado de la certificación",
    "Encargado por facturación",
    "Desarrollo de personas / RRHH",
  ];

  return (
    <div>
      <div>
        <label htmlFor="empContNom">Nombre y Apellido</label>
        <TextBoxComponent
          id="empContNom"
          name="empContNom"
          value={props?.empContNom}
        ></TextBoxComponent>
      </div>
      <div>
        <label htmlFor="empContTel">Telefono</label>
        <TextBoxComponent
          id="empContTel"
          name="empContTel"
          value={props?.empContTel}
        ></TextBoxComponent>
      </div>
      <div>
        <label htmlFor="empContTelInt">Telefono interno</label>
        <TextBoxComponent
          id="empContTelInt"
          name="empContTelInt"
          value={props?.empContTelInt}
        ></TextBoxComponent>
      </div>
      <div>
        <label htmlFor="empContEMail">Email</label>
        <TextBoxComponent
          id="empContEMail"
          name="empContEMail"
          value={props?.empContEMail}
        ></TextBoxComponent>
      </div>
      <div>
        <label htmlFor="empContCargo">Cargo</label>
        <ComboBoxComponent
          id="empContCargo"
          name="empContCargo"
          //fields={{ value: "CompanyId", text: "CompanyName" }}
          dataSource={OPTIONS}
          value={props?.empContCargo}
          autofill={true}
          allowFiltering={false}
        ></ComboBoxComponent>
      </div>
    </div>
  );
}
export default ContactDialog;
