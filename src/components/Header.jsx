import { useNavigate } from 'react-router';
import { useAuth } from '../utils/useAuth.js';

import styles from './Header.module.css';
import { useEffect, useRef } from 'react';
import { useAxiosPrivate } from '../utils/useAxiosPrivate.js';

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

const UserGroup = ({ username }) => {
  const userDropdownRef = useRef(null);
  const axiosPrivateInstance = useAxiosPrivate();
  const navigate = useNavigate();

  const showUserDropdown = (e) => {
    e.stopPropagation();

    if (userDropdownRef.current) {
      userDropdownRef.current.setAttribute('style', 'display:flex;');
    }
  }

  const closeUserDropdown = (event) => {
    if (userDropdownRef.current && event.currentTarget === event.target) {
      return;
    }

    if (userDropdownRef.current) {
      userDropdownRef.current.removeAttribute('style');
    }
  }

  const userLogout = async () => {
    await axiosPrivateInstance.get(
      '/api/v1/auth/logout'
    )
      .then((res) => {
        if(res.status === 200) {
          navigate('/', { replace: true});
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    window.addEventListener('click', closeUserDropdown);

    return () => window.removeEventListener('click', closeUserDropdown);
  }, []);

  return (
    <div className={styles.user_container}
      onClick={showUserDropdown}
    >
      <div className={styles.user_img_container}>
        <img
          className={styles.user_img}
          src="/src/assets/default-pfp.png"
        />
      </div>
      <div className={styles.username_text}>
        {username}
      </div>

      {/* TODO: this onClick needs to be refactored */}
      <div
        className={styles.user_dropdown}
        ref={userDropdownRef}
        onClick={userLogout}
      >
        <span className={styles.user_dropdown_txt}>
          Logout
        </span>

        <span className={styles.user_dropdown_svg}>
          <ion-icon name="log-out-outline"></ion-icon>
        </span>
      </div>
    </div>
  );
}

export const Header = ({ dontShowCurrentGroup }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  let currentGroup = <AuthGroup />;

  if (auth.isLoggedIn) {
    currentGroup =
      <UserGroup
        username={auth.username}
      />;
  }

  return (
    <header className={styles.header_root}>
      <div className={styles.header_container}>
        <div
          className={styles.logo_container}
          onClick={() => {
            navigate('/', { replace: true });
          }}
        >
          <span className={styles.logo_text}>KodeX</span>
        </div>

        {!dontShowCurrentGroup && currentGroup}
      </div>
    </header>
  );
}