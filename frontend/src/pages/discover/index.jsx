import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";

import styles from "./index.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function Discoverpage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched, dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{ paddingInline: "0.6rem" }}>
          <h1>Discover</h1>

          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((user) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                    key={user._id}
                    className={styles.userCard}>
                    <img
                      src={`${BASE_URL}/${user.userId.profilePicture}`}
                      alt="profilePicture"></img>

                    <h1>{user.userId.name}</h1>

                    <p>{user.userId.username}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
