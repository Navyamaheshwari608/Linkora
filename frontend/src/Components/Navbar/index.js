import Image from "next/image";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { clientServer } from "@/config";
import { reset } from "@/config/redux/reducers/authReducer";

export default function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const res = await clientServer.patch("/user/logout");
      dispatch(reset());

      router.push("/");

      console.log(res.data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <Image
          className={styles.logo}
          onClick={() => router.push("/")}
          src="/images/Logo.png"
          alt="Linkora icon"
          width={200}
          height={60}
          style={{
            display: "block",
            width: "200px",
            height: "auto",
            margin: 0,
            padding: 0,
          }}
        />

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div style={{ display: "flex", gap: "1.2rem" }}>
              <p className={styles.heyPart}>
                Hey, {authState.user.userId.name}
              </p>

              <p
                onClick={() => {
                  router.push(`/profile`);
                }}
                style={{ fontWeight: "bold", cursor: "pointer" }}>
                Profile
              </p>

              <p
                onClick={logout}
                style={{ fontWeight: "bold", cursor: "pointer" }}>
                Logout
              </p>
            </div>
          )}

          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}>
              <p>Be a part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
