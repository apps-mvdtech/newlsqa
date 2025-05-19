"use client";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { useState } from "react";
import { showAlertDialog } from "../utilities/ui";
import { useCompany } from "../../context/CompanyContext";

export function ChangePasswordDialog({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const { changePassword } = useCompany();
  const [globalConfiguration] = useState({
    MinimumPasswordCharacters: 14,
    MinimumPasswordSymbols: 1,
    MinimumPasswordNumbers: 1,
    MinimumPasswordLetters: 2,
    MinimumPasswordLowerCases: 1,
    MinimumPasswordUpperCases: 1,
  });

  const passwords = {
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  };

  function validationPasswords(passwordsData: {
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
  }) {
    const {
      MinimumPasswordCharacters,
      MinimumPasswordSymbols,
      MinimumPasswordNumbers,
      MinimumPasswordLetters,
      MinimumPasswordLowerCases,
      MinimumPasswordUpperCases,
    } = globalConfiguration;
    const { oldPassword, newPassword, repeatPassword } = passwordsData;
    if (oldPassword === "" || newPassword === "" || repeatPassword === "") {
      showAlertDialog({
        title: "Atención",
        content: "Todos los campos deben estar completos.",
      });
      return false;
    }
    if (newPassword.length < MinimumPasswordCharacters) {
      showAlertDialog({
        title: "Atención",
        content: `La contraseña debe contener al menos ${MinimumPasswordCharacters} caracteres`,
      });
      return false;
    }
    if (newPassword !== repeatPassword) {
      showAlertDialog({
        title: "Atención",
        content:
          "La nueva contraseña y la confirmación no son iguales. Por favor, inténtalo de nuevo.",
      });
      return false;
    }

    const countLetters = (newPassword.match(/[a-zA-Z]/g) || []).length;
    if (countLetters < MinimumPasswordLetters) {
      showAlertDialog({
        title: "Atención",
        content: `La contraseña debe contener al menos ${MinimumPasswordLetters} letra(s).`,
      });
      return false;
    }

    const countUpperCase = (newPassword.match(/[A-Z]/g) || []).length;
    const countLowerCase = (newPassword.match(/[a-z]/g) || []).length;
    const countNumbers = (newPassword.match(/\d/g) || []).length;
    const countSymbols = (newPassword.match(/[\W_]/g) || []).length;

    if (
      MinimumPasswordCharacters !== 0 &&
      (countUpperCase < MinimumPasswordUpperCases ||
        countLowerCase < MinimumPasswordLowerCases ||
        countNumbers < MinimumPasswordNumbers ||
        countSymbols < MinimumPasswordSymbols)
    ) {
      let msj = `La contraseña debe contener al menos <br>`;
      if (MinimumPasswordUpperCases > 0) {
        msj += `${MinimumPasswordUpperCases} letra(s) mayúscula(s)<br>`;
      }
      if (MinimumPasswordLowerCases > 0) {
        msj += `${MinimumPasswordLowerCases} letra(s) minúscula(s)<br>`;
      }
      if (MinimumPasswordNumbers) {
        msj += `${MinimumPasswordNumbers} 
            número(s)<br>`;
      }
      if (MinimumPasswordSymbols) {
        msj += `${MinimumPasswordSymbols} 
            símbolo(s)<br>`;
      }

      showAlertDialog({
        title: "Atención",
        content: msj,
      });

      return false;
    }

    return true;
  }

  async function platformChangePassword(data: {
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
  }) {
    const { oldPassword, newPassword } = data;
    try {
      const response = await changePassword({ oldPassword, newPassword });

      if (response.ok) {
        closeDialog();
        showAlertDialog({
          title: "Atención",
          content: "Contraseña modificada",
        });
      } else {
        const msj = await response.text();
        showAlertDialog({ title: "Error", content: msj });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function changepassword() {
    const isValid = validationPasswords(passwords);
    if (isValid) {
      await platformChangePassword(passwords);
    }
  }

  const content = () => {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div>
          <label>Contraseña anterior</label>
          <div className="e-input-group">
            <input
              id="oldPassword"
              className="e-input"
              type={"password"}
              placeholder="Ingresar contraseña"
              onChange={(args) => {
                passwords.oldPassword = args.target.value;
              }}
            />
            <span
              className="e-input-group-icon e-icons e-eye"
              onMouseDown={() => {
                document
                  .getElementById("oldPassword")
                  ?.setAttribute("type", "text");
              }}
              onMouseUp={() => {
                document
                  .getElementById("oldPassword")
                  ?.setAttribute("type", "password");
              }}
            ></span>
          </div>
          <label>Nueva contraseña</label>
          <div className="e-input-group">
            <input
              id="newPassword"
              className="e-input"
              type={"password"}
              placeholder="Ingresar contraseña"
              onChange={(args) => {
                passwords.newPassword = args.target.value;
              }}
            />
            <span
              className="e-input-group-icon e-icons e-eye"
              onMouseDown={() => {
                document
                  .getElementById("newPassword")
                  ?.setAttribute("type", "text");
              }}
              onMouseUp={() => {
                document
                  .getElementById("newPassword")
                  ?.setAttribute("type", "password");
              }}
            ></span>
          </div>
          <label>Repetir contraseña</label>
          <div className="e-input-group">
            <input
              id="repeatPassword"
              className="e-input"
              type={"password"}
              placeholder="Ingresar contraseña"
              onChange={(args) => {
                passwords.repeatPassword = args.target.value;
              }}
            />
            <span
              className="e-input-group-icon e-icons e-eye"
              onMouseDown={() => {
                document
                  .getElementById("repeatPassword")
                  ?.setAttribute("type", "text");
              }}
              onMouseUp={() => {
                document
                  .getElementById("repeatPassword")
                  ?.setAttribute("type", "password");
              }}
            ></span>
          </div>
        </div>
        <ButtonComponent
          style={{
            width: "100%",
            marginTop: "15%",
            background: "#68c3c0",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
          }}
          onClick={changepassword}
        >
          Confirmar cambio
        </ButtonComponent>
      </div>
    );
  };

  const onBeforeOpen = (args) => {
    args.maxHeight = "initial";
  };

  if (!globalConfiguration) {
    return;
  }
  return (
    <DialogComponent
      beforeOpen={onBeforeOpen}
      header="Modificar contraseña"
      isModal={true}
      width="500px"
      height="350px"
      close={closeDialog}
      showCloseIcon={true}
      content={content}
    ></DialogComponent>
  );
}
