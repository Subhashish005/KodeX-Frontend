import { useNavigate } from 'react-router';
import { useAuth } from '../utils/useAuth.js';

import styles from './Header.module.css';

const AuthGroup = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.auth_container}>
      <button className={styles.login_btn} onClick={() => navigate('/login')}>
        Login
      </button>
      <button className={styles.signup_btn} onClick={() => navigate('/signup')}>
        Sign Up
      </button>
    </div>
  );
}

const UserGroup = ({username}) => {
  return (
    <div className={styles.user_container}>
      <div className={styles.user_img_container}>
        <img
          className={styles.user_img}
          src="/src/assets/default-pfp.png"
        />
      </div>
      <div className={styles.username_text}>
        {username}
      </div>
    </div>
  );
}

export const Header = ({dontShowCurrentGroup}) => {
  const { auth } = useAuth();

  let currentGroup = <AuthGroup />;

  if(auth.isLoggedIn) {
    currentGroup =
      <UserGroup
        username={auth.username}
      />;
  }

  return (
    <header className={styles.header_root}>
      <div className={styles.header_container}>
        <div className={styles.logo_container}>
          <span className={styles.logo_text}>KodeX</span>
        </div>

        {!dontShowCurrentGroup && currentGroup}
      </div>
    </header>
  );
}