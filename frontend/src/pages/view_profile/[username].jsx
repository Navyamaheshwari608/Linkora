import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionsRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const [IsUserInConnection, setIsUserInConnection] = useState(false);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest());
    await dispatch(getMyConnectionRequests());
  };
  useEffect(() => {
    getUsersPost();
  }, []);

  useEffect(() => {
    let filteredPosts = postReducer.posts.filter(
      (post) => post.userId.username === router.query.username,
    );
    setUserPosts(filteredPosts);
  }, [postReducer.posts]);

  useEffect(() => {
    const userId = userProfile.userId._id;

    const connection = authState.connections.find(
      (user) => user.connectionId._id === userId,
    );

    const request = authState.connectionRequest.find(
      (user) => user.userId._id === userId,
    );

    const isConnected =
      connection?.status_accepted === true || request?.status_accepted === true;

    setIsConnectionNull(!isConnected);
    setIsUserInConnection(connection || request);
  }, [
    authState.connections,
    authState.connectionRequest,
    userProfile.userId._id,
  ]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="backdrop"></img>
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.flexShape} style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
              <div
                style={{
                  flex: "0.7",
                  lineHeight: "2rem",
                }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                  }}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}>
                  {IsUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await dispatch(sendConnectionRequest(userProfile));
                      }}
                      className={styles.connectBtn}>
                      Connect
                    </button>
                  )}

                  <div
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId._id}`,
                      );
                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank",
                      );
                    }}
                    style={{ cursor: "pointer" }}>
                    <svg
                      style={{ width: "1.2rem" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                <div style={{ paddingBottom: "2rem" }}>
                  <p>{userProfile.bio}</p>
                </div>

                <div className={styles.workHistory}>
                  <h4>Work History</h4>

                  <div className={styles.workHistoryContainer}>
                    {userProfile.pastWork.map((work, index) => {
                      return (
                        <div key={index} className={styles.workHistoryCard}>
                          <p
                            style={{
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.8rem",
                            }}>
                            {work.company} - {work.position}
                          </p>

                          <p>{work.years} years</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ flex: "0.3" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img
                              src={`${BASE_URL}/${post.media}`}
                              alt="postPicture"></img>
                          ) : (
                            <div
                              style={{
                                width: "3.4rem",
                                height: "3.4rem",
                              }}></div>
                          )}
                          <p>{post.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    },
  );

  return { props: { userProfile: request.data.profile } };
}
