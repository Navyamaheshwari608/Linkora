import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHouse, faSistrix } from "@fortawesome/free-solid-svg-icons";
import {
  faUserGroup,
  faHouse,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { clientServer } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await clientServer.get("/check-auth");

        if (!res.data.userPresent) {
          router.replace("/login");
          return;
        }

        dispatch(getAllUsers());
        dispatch(getAboutUser());
        dispatch(getAllPosts());
      } catch (error) {
        router.replace("/login");
      }
    };

    checkSession();
  }, [router, dispatch]);

  return (
    <div className="container">
      <div className={styles.homeContainer}>
        <div className={styles.homeContainer_leftBar}>
          <div
            onClick={() => {
              router.push("/dashboard");
            }}
            className={styles.sideBarOption}>
            <FontAwesomeIcon icon={faHouse} />
            <p>Scroll</p>
          </div>
          <div
            onClick={() => {
              router.push("/discover");
            }}
            className={styles.sideBarOption}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <p>Discover</p>
          </div>

          <div
            onClick={() => {
              router.push("/my_connections");
            }}
            className={styles.sideBarOption}>
            <FontAwesomeIcon icon={faUserGroup} />
            <p>My Connections</p>
          </div>
        </div>

        <div className={styles.homeContainer_feedContainer}>
          {authState.user.length !== 0 ? children : <h3>Loading...</h3>}
        </div>

        <div className={styles.homeContainer_extraContainer}>
          <h3>Top Profiles</h3>
          {authState.all_profiles_fetched &&
            authState.all_users.map((profile) => {
              return (
                <div
                  key={profile._id}
                  className={styles.extraContainer_profile}>
                  <p>{profile.userId.name}</p>
                </div>
              );
            })}
        </div>

        <div className={styles.mobileNavBar}>
          <div
            onClick={() => {
              router.push("/dashboard");
            }}
            className={styles.singleNavBarItemHolder_mobileView}>
            <FontAwesomeIcon icon={faHouse} />
          </div>
          <div
            onClick={() => {
              router.push("/discover");
            }}
            className={styles.singleNavBarItemHolder_mobileView}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
          <div
            onClick={() => {
              router.push("/my_connections");
            }}
            className={styles.singleNavBarItemHolder_mobileView}>
            <FontAwesomeIcon icon={faUserGroup} />
          </div>
        </div>
      </div>
    </div>
  );
}
