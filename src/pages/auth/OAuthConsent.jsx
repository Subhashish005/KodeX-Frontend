import { useAuth } from "../../utils/useAuth";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import styles from "./OAuthConsent.module.css";
import { Loading } from "../../components/Loading";

export const OAuthConsent = () => {
  const { auth } = useAuth();
  const disclaimerRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if(auth.oAuthAccessToken) navigate('/projects', {replace: true});

    setLoading(false);
  }, []);

  return (
    loading ?
    <Loading /> :

    <>
      <div
        className={styles.main_root}
      >
        <Header />

        <div
          className={styles.disclaimer}
          ref={disclaimerRef}
        >
          <h1><u>Google Drive Access Disclaimer</u></h1>
          <div style={{borderBottom: 'solid 1px grey', paddingBottom: '10px'}}>
            When you choose to sign in using Google, our application requests permission to access a limited portion of your Google Drive in order to provide core functionality of the cloud development environment.
          </div>

          <h2>
            Specifically, we request access with the scope:
          </h2>

          <div style={{borderBottom: 'solid 1px grey', paddingBottom: '10px'}}>
            <u>https://www.googleapis.com/auth/drive.file</u>
          </div>

          <h2>
            This means:
          </h2>

          <ul style={{borderBottom: 'solid 1px grey', paddingBottom: '10px'}}>
            <li>The app can create files and folders in your Google Drive that are used for your projects.</li>
            <li>The app can view, read, update, and delete only the files and folders that it creates or that you explicitly open with the app.</li>
            <li>The app cannot access, view, or modify other files in your Google Drive that were not created or opened through this application.</li>
          </ul>

          <h2>
            What we use this access for:
          </h2>

          <ul style={{borderBottom: 'solid 1px grey', paddingBottom: '10px'}}>
            <li>Creating a dedicated workspace folder for your projects</li>
            <li>Saving and syncing your project files</li>
            <li>Updating files when you edit them inside the cloud IDE</li>
            <li>Restoring your projects across devices</li>
          </ul>

          <h2>
            What we can NOT do:
          </h2>

          <ul style={{borderBottom: 'solid 1px grey', paddingBottom: '10px'}}>
            <li>We do not browse your personal Drive contents.</li>
            <li>We do not access files unrelated to this application.</li>
          </ul>

          <h2>
            Your control:
          </h2>

          <ul style={{borderBottom: 'solid 1px grey', paddingBottom: '10px'}}>
            <li>You can revoke access at any time from your Google Account permissions page.</li>
            <li>Revoking access will stop file syncing and project storage features from working.</li>
          </ul>

          <h3 style={{marginBottom: '20px'}}>
            By continuing with Google login, you acknowledge and allow the app to create and manage project files in your Google Drive for development and syncing purposes.
          </h3>

          <button
            className={styles.scroll_down_btn}
            onClick={() => {

              if(disclaimerRef.current)
              disclaimerRef.current.scrollTop = disclaimerRef.current.scrollHeight;
            }}
          >
            <ion-icon name="arrow-down-outline"></ion-icon>
          </button>
        </div>

        {/*
          TODO: closing window should not display any type of
          backend error message on it
        */}
        <div
          className={styles.note}
        >
          Note: please use the same gmail you used to sign up or the google login will fail!
        </div>

        <div
          className={styles.login_container}
        >
          <button
            className={styles.login_btn}

            onClick={() => {
              window.open(
                `http://localhost:8080/api/v1/oauth2/login/google?user_id=${auth.userId}`,
                'loginWindow',
                'width=1280,height=720'
              );

              // create a new or join an existing broadcast channel named 'auth_status'
              // and keep listening on it till we get the OAUTH_DONE message
              const authChannel = new BroadcastChannel('auth_status');

              authChannel.onmessage = (event) => {
                // the spawned child will send this and close itself
                if(event.data === 'OAUTH_DONE') {
                  // parent has to close channel as child is no more, sadge :(
                  authChannel.close();


                  // necessary as I'm not sending the access token
                  // with refresh token :(
                  window.location.reload();
                }
              }
            }}
          >
            Google Login
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
}
