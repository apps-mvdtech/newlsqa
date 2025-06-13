import { Certificado, Etiquetas } from "../../services/domain";
import { useCompany } from "../../context/CompanyContext";
import styles from "../certificates/Certificates.module.css";
import { useState } from "react";
import { showAlertDialog } from "../utilities/ui";

export function Certificate(cert: Certificado) {
  const { downloadEtiquetas, getEtiquetas } = useCompany();
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
          "Ocurrió un error al obtener las etiquetas. Por favor, intente nuevamente. Si el problema persiste, comuníquese con el administrador.",
      });
    }
  }

  function hideBtn(id: string, show: boolean) {
    const btnDownload = document.getElementById(id);
    if (btnDownload) {
      if (show) {
        btnDownload.classList.add(styles.hideBtn);
      } else {
        btnDownload.classList.remove(styles.hideBtn);
      }
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
            <strong>Fecha emisión: </strong>
            {cert.certificadoFecEmiUlt
              ? new Date(cert.certificadoFecEmiUlt).toLocaleDateString()
              : ""}
          </p>
          <p>
            <strong>Fecha vencimiento: </strong>
            {cert.certificadoFecVen
              ? new Date(cert.certificadoFecVen).toLocaleDateString()
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
          {isOpen && etiquetas.length > 0 && (
            <ul className={styles.listEtiquetas}>
              {etiquetas.map((e) => {
                return (
                  <li key={e.id}>
                    <span style={{ fontSize: "12px" }}>{e.nombre}</span>
                    <span
                      id={`${e.id}`}
                      className={`e-icons e-download ${styles.downloadButton}`}
                      onClick={async () => {
                        hideBtn(`${e.id}`, true);
                        await downloadEtiquetas(e.id, e.nombre);
                        hideBtn(`${e.id}`, false);
                      }}
                    ></span>
                  </li>
                );
              })}
            </ul>
          )}
          {isOpen && etiquetas.length === 0 && (
            <span>No hay documentos disponibles</span>
          )}
        </div>
      </div>
    </div>
  );
}
