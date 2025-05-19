"use client";

import styles from "../header/Header.module.css";
import { actionLogout } from "../../actions/loginAction";
import { showAlertDialog, showConfirmDialog } from "../utilities/ui";
import { ChangePasswordDialog } from "../user/ChangePasswordDialog";
import { MenuEventArgs } from "@syncfusion/ej2-react-navigations";
import { DropDownButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import Link from "next/link";
import { useState } from "react";
//import { signOut } from "../../auth";

export default function Header() {
  const [showDialogChangePassword, setShowDialogChangePassword] =
    useState(false);

  async function clickLogout() {
    try {
      const confirmLogout = await showConfirmDialog({
        cancelTextButton: "Cancelar",
        content: "¿Estás segura de que quieres cerrar sesión?  ",
        okTextButton: "Confirmar",
        showCloseIcon: true,
        title: "Atención",
      });
      if (confirmLogout) {
        actionLogout();
      }
    } catch (error) {
      console.error(error);

      showAlertDialog({
        title: "Error",
        content: "Ocurrio un error al cerrar sesión, vuelva a intentar.",
      });
    }
  }

  const menuItems = [
    {
      id: "change-password",
      text: "Modificar contraseña",
    },
    {
      id: "logout",
      text: "Cerrar sesion",
    },
  ];

  async function handleOnSelect({ item }: MenuEventArgs) {
    const id = item.id as string;
    if (id === "logout") {
      clickLogout();
    } else if (id === "change-password") {
      setShowDialogChangePassword(true);
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div>
          <Link href={"/"}>
            <div className={styles.logo}>
              <span>LSQA</span>
            </div>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href={"/profile"}>
            <span>Perfil</span>
          </Link>
          <Link href={"/certificates"}>
            <span>Certificaciones</span>
          </Link>
          <Link href={"/contacts"}>
            <span>Contactos</span>
          </Link>

          <DropDownButtonComponent
            items={menuItems}
            select={handleOnSelect}
            iconCss="e-icons e-user"
            cssClass="e-inherit e-appbar-menu e-caret-hide"
          />
          <>
            <div className="e-appbar-spacer"></div>
            {showDialogChangePassword && (
              <ChangePasswordDialog
                closeDialog={() => setShowDialogChangePassword(false)}
              />
            )}
          </>
        </nav>
      </div>
    </header>
  );
}
