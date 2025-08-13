"use client";

import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import {
  TextBoxComponent,
  ChangedEventArgs as TextBoxChangedEventArgs,
} from "@syncfusion/ej2-react-inputs";
//import { useRouter } from "next/navigation";
import { loginAction } from "../../actions/loginAction";
import { useState } from "react";
import { Spinner } from "../utilities/Spinner";
import styles from "./Login.module.css";
import { showAlertDialog } from "../utilities/ui";
import Image from "next/image";
import bridgeLogoOriginal from "../../public/bridgeLogoOriginal.png";

const Login = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [dataLogin, setDataLogin] = useState({
    userId: "",
    password: "",
  });

  async function login() {
    const msjValidate = validateDataUser(dataLogin);
    try {
      if (msjValidate === "") {
        const res = await loginAction(dataLogin);
        if (res) {
          window.location.href = "/profile";
        }
      } else {
        setShowSpinner(false);
        showAlertDialog({ title: "Atención", content: msjValidate });
      }
    } catch (error) {
      console.error(error);
      setShowSpinner(false);
      showAlertDialog({
        title: "Atención",
        content: "Usuario y/o contraseña incorrecta.",
      });
    }
  }

  function validateDataUser({
    userId,
    password,
  }: {
    userId: string;
    password: string;
  }) {
    if (userId === "" || password === "") {
      return "Debe ingresar Usuario y Contraseña.";
    }

    return "";
  }

  return (
    <div className={styles["page-container"]}>
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.img}>
            <Image
              src={bridgeLogoOriginal}
              alt="Bridge logo"
              width={200}
              height={60}
            />
          </div>
          <h3 className={styles.title}>Iniciar Sesión</h3>
          <div className={styles.form}>
            <TextBoxComponent
              placeholder="Usuario"
              name="rut"
              value={dataLogin.userId}
              onChange={(args: TextBoxChangedEventArgs) => {
                setDataLogin({ ...dataLogin, userId: args.value });
              }}
            />
            <TextBoxComponent
              placeholder="Contraseña"
              name="password"
              type="password"
              value={dataLogin.password}
              onChange={(args: TextBoxChangedEventArgs) => {
                setDataLogin({ ...dataLogin, password: args.value });
              }}
            />
          </div>
          <ButtonComponent
            className={styles.button}
            onClick={() => {
              setShowSpinner(true);
              login();
            }}
          >
            INICIAR
          </ButtonComponent>
          {showSpinner && <Spinner></Spinner>}
        </div>
      </div>
    </div>
  );
};

export default Login;
