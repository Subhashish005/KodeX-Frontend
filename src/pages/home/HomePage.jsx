import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useNavigate } from 'react-router';

import styles from './HomePage.module.css';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.home_root}>
        <Header />
        <main className={styles.main}>
          <div className={styles.main_content}>
            <div className={styles.main_header}>
              Welcome to KodeX
              <br />
              A cloud-based IDE
            </div>
            <div className={styles.main_para}>
              Kodex offers a cloud-based IDE with integrated code-editor, terminal, and much more...
            </div>

            <button className={styles.playground_btn} onClick={() => navigate('/playground')}>
              ▶ Launch Playground
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};