import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { useEffect, useState } from "react";
import { Certificado } from "../../services/domain";

import styles from "../certificates/Certificates.module.css";
import { useCompany } from "../../context/CompanyContext";
import { Certificate } from "./Certificate";
//import { useMainContext } from "../providers";

export default function Certificates() {
  const { getCertificados, getEtiquetas } = useCompany();
  const [certificates, setCertificates] = useState<Certificado[]>([]);
  const [certificatesView, setCertificatesView] = useState<Certificado[]>([]);
  const [numberCertificate, setNumberCertificate] = useState("");
  const [norm, setNorm] = useState("");

  useEffect(() => {
    getCertificates();
    //initData();
  }, []);

  async function getCertificates() {
    try {
      const response = await getCertificados();
      setCertificates(response);
      setCertificatesView(response);
      // const allCeritificatesTags = await getAllEtiquetas(response);
      // setCertificates(allCeritificatesTags);
      // setCertificatesView(allCeritificatesTags);
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllEtiquetas(certificados: Certificado[]) {
    const responses = await Promise.all(
      certificados.map(async (certificado) => ({
        ...certificado,
        //etiquetas: await getEtiquetas(certificado.id),
      }))
    );
    return responses;
  }

  async function getFilterCeritificates() {
    let filterCertificates = certificates;
    if (numberCertificate !== "") {
      filterCertificates = filterCertificates.filter((c) =>
        c.certificadoNumero.includes(numberCertificate)
      );
    }
    if (norm !== "") {
      filterCertificates = filterCertificates.filter((c) =>
        c.normaNombre.includes(norm)
      );
    }
    setCertificatesView(filterCertificates);
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.input}>
          <TextBoxComponent
            //className={styles.input}
            onChange={(args) => {
              setNumberCertificate(args.value);
            }}
            value={numberCertificate}
            placeholder="Nº Certificado"
          />
        </div>
        <div className={styles.input}>
          <TextBoxComponent
            onChange={(args) => {
              setNorm(args.value);
            }}
            value={norm}
            placeholder="Norma"
          />
        </div>
        <div className={styles.input}>
          <ButtonComponent
            className={styles.searchButton}
            onClick={() => {
              getFilterCeritificates();
            }}
          >
            BUSCAR
          </ButtonComponent>
        </div>
      </div>
      {certificates.length === 0 ? (
        <div style={{ margin: "0 5px" }}>
          <span>La empresa no cuenta con certificaciones</span>
        </div>
      ) : (
        <div className={styles.certificatesList}>
          {certificatesView.map((cert) => (
            <div key={cert.id}>
              <Certificate {...cert}></Certificate>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
