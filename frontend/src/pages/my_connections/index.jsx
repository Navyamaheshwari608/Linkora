import { BASE_URL } from "@/config";
import {
  acceptConnection,
  getMyConnectionRequests,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { useRouter } from "next/router";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyConnectionRequests());
  }, []);

  useEffect(() => {
    if (authState.connectionRequest.length !== 0) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}>
          <h4 style={{ paddingLeft: "1rem" }}>My Connections</h4>
          {authState.connectionRequest.length === 0 && (
            <h1 style={{ paddingLeft: "1rem" }}>
              No Connections Requests Pending
            </h1>
          )}

          {authState.connectionRequest.length !== 0 &&
            authState.connectionRequest
              .filter((connection) => connection.status_accepted === null)
              .map((user) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                    key={user._id}
                    className={styles.userCard}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                      }}>
                      <div className={styles.profilePicture}>
                        <img
                          src={`${BASE_URL}/${user.userId.profilePicture}`}
                          alt="Profile Picture"
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user.userId.name}</h3>
                        <p>{user.userId.username}</p>
                      </div>

                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await dispatch(
                            acceptConnection({
                              connectionId: user._id,
                              action: "accept",
                            }),
                          );
                          // router.reload();
                          await dispatch(getMyConnectionRequests());
                        }}
                        className={styles.connectedButton}>
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}

          <h4 style={{ paddingLeft: "1rem" }}>My Network</h4>
          {authState.connectionRequest
            .filter((connection) => connection.status_accepted !== null)
            .map((user) => {
              return (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${user.userId.username}`);
                  }}
                  key={user._id}
                  className={styles.userCard}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}>
                    <div className={styles.profilePicture}>
                      <img
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt="Profile Picture"
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
