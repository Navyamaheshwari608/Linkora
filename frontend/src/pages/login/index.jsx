import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { useEffect, useRef, useState } from "react";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { reset } from "@/config/redux/reducers/authReducer";
import { clientServer } from "@/config";

function LoginComponent() {
  const router = useRouter();
  // useEffect(()=>{

  // })
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (authState.isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [authState.isLoggedIn, router]);

  const nameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const pswdRef = useRef();

  const dispatch = useDispatch();

  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    console.log("registering...");

    dispatch(
      registerUser({
        name: nameRef.current.value,
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: pswdRef.current.value,
      }),
    );
  };

  const handleLogin = () => {
    console.log("login...");
    dispatch(
      loginUser({
        email: emailRef.current.value,
        password: pswdRef.current.value,
      }),
    );
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {isRegistered ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>
            <div className={styles.inputContainers}>
              <div className={styles.inputRow}>
                {!isRegistered && (
                  <input
                    className={styles.inputField}
                    type="text"
                    ref={usernameRef}
                    placeholder="Username"></input>
                )}
                {!isRegistered && (
                  <input
                    className={styles.inputField}
                    type="text"
                    ref={nameRef}
                    placeholder="Name"></input>
                )}
              </div>

              <input
                className={styles.inputField}
                type="text"
                ref={emailRef}
                placeholder="Email"></input>

              <input
                className={styles.inputField}
                type="password"
                ref={pswdRef}
                placeholder="Password"></input>

              {!isRegistered && (
                <div
                  className={styles.buttonWithOutline}
                  onClick={handleRegister}>
                  Sign Up
                </div>
              )}

              {isRegistered && (
                <div className={styles.buttonWithOutline} onClick={handleLogin}>
                  Sign In
                </div>
              )}
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            <h1 style={{ marginTop: 0 }}>Welcome to Linkora</h1>
            <p>
              {!isRegistered
                ? "Already Have an Account?"
                : "Don't have an account?"}
            </p>
            <div
              style={{
                color: "black",
                width: "20%",
                background: "none",
                textDecoration: "underline",
              }}
              className={styles.buttonWithOutline}
              onClick={() => {
                dispatch(reset());
                setIsRegistered(!isRegistered);
              }}>
              {!isRegistered ? "Sign In" : "Sign Up"}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
