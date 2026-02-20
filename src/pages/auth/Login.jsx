import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Footer } from '../../components/Footer';
import { customErrorPopup, customSuccessPopup } from '../../utils/customPopup.js';
import { Header } from '../../components/Header.jsx';
import { axiosPublicInstance } from '../../utils/getAxiosInstance.js';

import styles from './Login.module.css';
import { useAuth } from '../../utils/useAuth.js';
import { jwtDecode } from 'jwt-decode';

export function Login() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [passwordInputType, setPasswordInputType] = useState('password');
  const [passwordToggleImg, setPasswordToggleImg] = useState('src/assets/eye-slash.png');

  useEffect(() => {
    // TODO: put a loading spinner here sometime
    if(auth.isLoggedIn) navigate('/', {replace: true});

    const usernameInput = document.querySelector('#username');
    usernameInput.focus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateUserInput = () => {
    // basic validation before submitting it to backend

    const username = formData.username.trim();
    const password = formData.password.trim();

    if(isBlank(username)) {
      customErrorPopup('Username can\'t be empty!', 1000);

      return false;
    }

    if(/[!-\/:-@[-`{-~]/.test(username)) {
      customErrorPopup(`Username can't contain special character(s)!`, 1000);

      return false;
    }

    if(
      !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-\/:-@[-`{-~])[A-Za-z0-9!-\/:-@[-`{-~]{8,}$/.test(password))
    ) {
      // TODO: make this alert more expressive
      customErrorPopup('password is too weak!', 1000);

      return false;
    }

    return true;
  };

  const isBlank = (str) => {
    return (!str || /^\s*$/.test(str));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validateUserInput()) return;

    await axiosPublicInstance.post(
      '/api/v1/auth/login',
      formData
    )
      .then((response) => {
        if(response.status === 200) {
          const accessToken = response.data?.access_token;
          const decodeToken = jwtDecode(accessToken);
          const username = decodeToken.name;
          const userId = decodeToken.sub;


          setAuth((prev) => {
            return {
              ...prev,
              accessToken,
              isLoggedIn: true,
              username,
              userId
            };
          });

          customSuccessPopup('Login successful! welcome to KodeX', 1000);
          navigate('/', { replace: true });
        }
      })
      .catch((error) => {
        console.log(error);

        if(!error?.response) {
          customErrorPopup("server didn't respond! try login again after sometime", 2000);

          return;
        }

        switch(error?.response?.status) {
          case 401:
            customErrorPopup(error.response.data?.error_msg, 1000);
          break;

          default:
            customErrorPopup("welp, I messed up :/ and you shouldn't be seeing this");
          break;
        }
      });
  };

  const handlePasswordToggle = (event) => {
    if(passwordInputType === "password") {
      setPasswordInputType("text");
      setPasswordToggleImg("src/assets/eye-open.png");
    } else {
      setPasswordInputType("password");
      setPasswordToggleImg("src/assets/eye-slash.png");
    }
  }

  return (
    <>
      <div className={styles.login_root}>
        <Header
          dontShowCurrentGroup={true}
        />

        <div className={styles.login_container}>
          <div className={styles.login_card}>
            <div className={styles.login_header}>
              <div className={styles.login_logo}>KodeX</div>
              <h1>Welcome Back!</h1>
              <p>Enter your credentials to access your workspace</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.login_form}>
              <div className={styles.input_group}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete='given-name'
                  maxLength={32}
                  required
                />
              </div>

              <div className={styles.input_group}>
                <label htmlFor="password">Password</label>
                <span className={styles.password_group}>
                  <input
                    type={passwordInputType}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="off"
                    maxLength={32}
                    required
                  />
                  <div>
                    <img
                      src={passwordToggleImg}
                      className={styles.passwd_btn}
                      onClick={handlePasswordToggle}
                    />
                  </div>
              </span>
              </div>

              <button type="submit" className={styles.login_btn}>
                Login
              </button>
            </form>

            <div className={styles.login_footer}>
              <span>Don't have an account yet?</span>
              <div
                className={styles.sign_up_link}
                onClick={() => {
                  navigate('/signup', { replace: true });
                }}
              >
                Sign Up
              </div>

              <div
                className={styles.back_home}
                onClick={() => {
                  navigate('/', { replace: true });
                }}
              >
                Back to Home
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};