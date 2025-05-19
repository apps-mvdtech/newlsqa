import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footerPage}>
      <div className={styles.container}>
        <p className={styles.text}>
          © {currentYear} Todos los derechos reservados.
        </p>
        <nav className={styles.nav}>
          <a href="/about" className={styles.link}>
            Acerca de
          </a>
          <a href="/contact" className={styles.link}>
            Contacto
          </a>
          <a href="/privacy" className={styles.link}>
            Política de Privacidad
          </a>
        </nav>
      </div>
    </footer>
  );
}
