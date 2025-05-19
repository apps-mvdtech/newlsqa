import { Certificado, Etiquetas } from "../../services/domain";
import { useCompany } from "../../context/CompanyContext";
import styles from "../certificates/Certificates.module.css";
import { useEffect, useState } from "react";
import { showAlertDialog } from "../utilities/ui";

export function Certificate(cert: Certificado) {
  const { companyContext, getEtiquetas } = useCompany();
  const downloadEtiquetas = companyContext?.downloadEtiquetas;
  const [isOpen, setIsOpen] = useState(false);
  const [etiquetas, setEtiquetas] = useState<Etiquetas[]>([]);

  async function getDataEtiquetas() {
    try {
      const response = await getEtiquetas(cert.id);
      setEtiquetas(response);
      setIsOpen(!isOpen);
    } catch (error) {
      showAlertDialog({
        title: "Atención",
        content:
          "Ocurrio un error al obtener las etiquetas, vuelva a intentarlo. En caso de persistir el error comuniquese con el administrador",
      });
    }
  }

  return (
    <div className={styles.certificateItem}>
      <div key={cert.id} style={{ display: "flex" }}>
        <div className={styles.certificateImage}>
          {/* <img src={cert.logo} alt={`Logo ${cert.norm}`} /> */}
        </div>
        <div className={styles.certificateDetails}>
          <p>
            <strong>Norma:</strong> {cert.normaNombre}
          </p>
          <p>
            <strong>Nº Certificado:</strong> {cert.certificadoNumero}
          </p>
          <p>
            <strong>Estado:</strong> {cert.estCertNombre}
          </p>
          {cert.pin && (
            <p>
              <strong>Pin:</strong> {cert.pin}
            </p>
          )}
          <p>
            <strong>Fecha emisión:</strong>
            {cert.certificadoFecEmiUlt
              ? new Date(cert.certificadoFecEmiUlt).toLocaleString()
              : ""}
          </p>
          <p>
            <strong>Fecha vencimiento:</strong>
            {cert.certificadoFecVen
              ? new Date(cert.certificadoFecVen).toLocaleString()
              : ""}
          </p>
          <p>
            <strong>Certificado alcance:</strong>{" "}
            {cert.certificadoAlcance ? cert.certificadoAlcance : ""}
          </p>
          <div
            className={`${styles.separator} ${isOpen ? styles.open : ""}`}
            onClick={async () => await getDataEtiquetas()}
          >
            <span className={styles.viewText}>Documentación disponible</span>
            <span className={styles.arrow}>{">"}</span>
          </div>

          <ul className={styles.listEtiquetas}>
            {isOpen &&
              etiquetas.map((e) => {
                return (
                  <li key={e.id}>
                    <span style={{ fontSize: "12px" }}> {e.nombre}</span>
                    <span
                      className={`e-icons e-download ${styles.downloadButton}`}
                      onClick={() => {
                        downloadEtiquetas?.(e.id, e.nombre);
                      }}
                    ></span>
                    {/* <ButtonComponent
                      onClick={() => {
                        downloadEtiquetas(e.id, e.nombre);
                      }}
                    ></ButtonComponent> */}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
