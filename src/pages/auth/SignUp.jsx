import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Footer } from "../../components/Footer";
import { customErrorPopup, customSuccessPopup } from '../../utils/customPopup.js';
import { Header } from "../../components/Header.jsx";

import styles from "./SignUp.module.css";
import { axiosPublicInstance } from "../../utils/getAxiosInstance.js";
import { useAuth } from "../../utils/useAuth.js";

export function SignUp() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [formData, setFormData] =
  useState(
    { username: '', email: '', password: '', role: '' }
  );

  const [confirmPasswd, setConfirmPasswd] = useState('');

  // pretty interesting stuff here, custom hook to store data in local storage
  // const [formData, setFormData] = useLocalStorage('formData', { username: '', email: '', password: '', role: '' });

  const [passwordInputType, setPasswordInputType] = useState('password');
  const [passwordToggleImg, setPasswordToggleImg] = useState('src/assets/eye-slash.png');
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState('password');
  const [confirmPasswordToggleImg, setConfirmPasswordToggleImg] = useState('src/assets/eye-slash.png');

  useEffect(() => {
    const usernameInput = document.querySelector('#username');

    if(auth.isLoggedIn) navigate('/', {replace: true});

    usernameInput.focus();
  }, []);

  const handleChange = (e) => {
    (e.target.name === 'Teacher' || e.target.name === 'Student') ?
    setFormData({ ...formData, role: e.target.name.toUpperCase() }) :
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isBlank = (str) => {
    return (!str || /^\s*$/.test(str));
  };

  const validateUserInput = () => {
    // basic validation before submitting it to backend

    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();
    const role = formData.role;

    if(isBlank(role)) {
      customErrorPopup('Please select a role!', 1000);

      return false;
    }

    if(isBlank(username)) {
      customErrorPopup('Username can\'t be empty!', 1000);

      return false;
    }

    if(/[!-\/:-@[-`{-~]/.test(username)) {
      customErrorPopup(`Username can't contain special character(s)!`, 1000);

      return false;
    }

    if(isBlank(email)) {
      customErrorPopup('Email can\'t be empty!', 1000);

      return false;
    }

    if(!(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email))) {
      customErrorPopup('Provided Email address is not valid!', 1000);

      return false;
    }

    if(
      !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-\/:-@[-`{-~])[A-Za-z0-9!-\/:-@[-`{-~]{8,}$/.test(password))
    ) {
      customErrorPopup('password is too weak!', 1000);

      return false;
    }

    if(confirmPasswd !== password) {
      customErrorPopup(`Passwords don't match!`, 1000);

      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validateUserInput()) return;

    // handle backend submission
    await axiosPublicInstance.post(
      '/api/v1/auth/signup',
      formData
    )
      .then((response) => {
        if(response.status === 200) {
          customSuccessPopup("Signed up successfully! please Login", 1000);
          navigate("/login", { replace: true });
        }
      })
      .catch((error) => {
        console.log(error);

        if(!error.response) {
          customErrorPopup("server didn't respond! try sign up again after sometime", 2000);

          return;
        }

        switch (error.status) {
          case 403:
            customErrorPopup('Error while signing up! please try again after sometime', 1500);
          break;

          case 409:
            customErrorPopup(error.response.data?.error_msg?.split(':')[0], 1000);
          break;

          default:
            customErrorPopup("welp, I messed up :/ and you shouldn't be seeing this");
          break;
        }
      });
  };

  const handlePasswordToggle = (event) => {
    if(event.target.id === "password") {
      if(passwordInputType === "password") {
        setPasswordInputType("text");
        setPasswordToggleImg("src/assets/eye-open.png");
      } else {
        setPasswordInputType("password");
        setPasswordToggleImg("src/assets/eye-slash.png");
      }
    } else {
      if(confirmPasswordInputType === "password") {
        setConfirmPasswordInputType("text");
        setConfirmPasswordToggleImg("src/assets/eye-open.png");
      } else {
        setConfirmPasswordInputType("password");
        setConfirmPasswordToggleImg("src/assets/eye-slash.png");
      }
    }
  };

  return (
    <>
      <div className={styles.signup_root}>
        <Header
          dontShowCurrentGroup={true}
        />

        <div className={styles.signup_container}>

          <div className={styles.signup_card}>
            <div className={styles.signup_header}>
              <div className={styles.signup_logo}>KodeX</div>
              <p>Please fill Your details to create an account</p>
            </div>

            {/* TIP: username and password fields can be made into components
            to be shared with login */}

            <form onSubmit={handleSubmit} className={styles.signup_form}>
              <div className={styles.input_group}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  maxLength={32}
                  required
                />
              </div>

              <div className={styles.input_group}>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  maxLength={128}
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
                      id="password"
                    />
                  </div>
                </span>
              </div>

              <div className={styles.input_group}>
                <label htmlFor="confirm_password">Confirm Password</label>
                <span className={styles.password_group}>
                  <input
                    type={confirmPasswordInputType}
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Repeat Password"
                    value={confirmPasswd}
                    onChange={(e) => setConfirmPasswd(e.target.value)}
                    autoComplete="off"
                    maxLength={32}
                    required
                  />
                  <div>
                    <img
                      src={confirmPasswordToggleImg}
                      className={styles.passwd_btn}
                      onClick={handlePasswordToggle}
                    />
                  </div>
                </span>
              </div>

              <div className={styles.input_group}>
                  <p className={styles.role_label}>You want to sign up as a...</p>
                  <div className={styles.role_group}>
                    <label
                      className={styles.role_label}
                      htmlFor="Teacher"
                    >
                      Teacher
                    </label>
                    <input
                      type="checkbox"
                      id="Teacher"
                      name="Teacher"
                      value={formData.role}
                      checked={formData.role === "TEACHER"}
                      onChange={handleChange}
                    />
                    <label
                      className={styles.role_label}
                      htmlFor="Student"
                    >
                      Student
                    </label>
                    <input
                      type="checkbox"
                      id="Student"
                      name="Student"
                      value={formData.role}
                      checked={formData.role === "STUDENT"}
                      onChange={handleChange}
                    />
                  </div>
              </div>

              <button type="submit" className={styles.signup_btn}>
                Sign Up
              </button>
            </form>

            <div className={styles.signup_footer}>
              <span>Already got an account? </span>
              <div
                className={styles.login_link}
                onClick={() => {
                  navigate('/login', { replace: true });
                }}
              >
                Login
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