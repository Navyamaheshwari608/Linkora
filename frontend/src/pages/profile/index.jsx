import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getAboutUser } from "@/config/redux/action/authAction";

export default function UserProfile() {
  const router = useRouter();
  const postReducer = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await clientServer.get("/check-auth");

        if (!res.data.userPresent) {
          router.replace("/login");
          return;
        }
      } catch (error) {
        router.replace("/login");
      }
    };

    checkSession();
  }, [router, dispatch]);

  const authState = useSelector((state) => state.auth);
  const userProfile = authState.user;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameChanged, setNameChanged] = useState(false);
  const [pastWorkData, setPastWorkData] = useState(null);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });
  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAboutUser());
      await dispatch(getAllPosts());
    };

    fetchData();
  }, [dispatch]);

  const nameRef = useRef(null);
  const bioRef = useRef(null);

  useEffect(() => {
    if (userProfile?.userId?.name) {
      nameRef.current.value = userProfile.userId.name;
    }
  }, [userProfile]);

  const userPosts = (postReducer.posts || []).filter(
    (post) => post.userId?.username === userProfile?.userId?.username,
  );

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    dispatch(getAboutUser());
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      name: nameRef.current.value,
    });

    const response = await clientServer.post("/update_profile_data", {
      bio: bioRef.current.value,
      currentPost: userProfile.currentPost,
      pastWork: pastWorkData,
      education: userProfile.education,
    });

    dispatch(getAboutUser());
    setNameChanged(false);
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <label
              htmlFor="profilPictureUpload"
              className={styles.backDrop_overlay}>
              Edit
            </label>
            <input
              onChange={(e) => updateProfilePicture(e.target.files[0])}
              style={{ display: "none" }}
              type="file"
              id="profilPictureUpload"
            />
            <img
              src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`}
              alt="backdrop"></img>
          </div>

          <div className={styles.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
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
                  <input
                    className={styles.nameEdit}
                    type="text"
                    ref={nameRef}
                    name="name"
                    onChange={() => {
                      setNameChanged(true);
                    }}
                  />

                  <p style={{ color: "grey" }}>
                    @{userProfile?.userId?.username}
                  </p>
                </div>

                <div style={{ paddingBottom: "2rem" }}>
                  <textarea
                    className={styles.bio}
                    onChange={() => {
                      setNameChanged(true);
                    }}
                    ref={bioRef}
                    style={{ width: "100%" }}>
                    {userProfile?.bio}
                  </textarea>
                </div>

                <div className={styles.workHistory}>
                  <h4>Work History</h4>

                  <div className={styles.workHistoryContainer}>
                    {userProfile?.pastWork?.map((work, index) => {
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

                    <button
                      className={styles.addWorkButton}
                      onClick={() => {
                        setIsModalOpen(true);
                      }}>
                      Add Work
                    </button>

                    {isModalOpen && (
                      <div
                        onClick={() => {
                          setIsModalOpen(false);
                        }}
                        className={styles.commentsContainer}>
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                          className={styles.allCommentsContainer}>
                          <input
                            className={styles.inputField}
                            type="text"
                            name="company"
                            onChange={handleWorkInputChange}
                            placeholder="Enter Company"></input>

                          <input
                            className={styles.inputField}
                            type="text"
                            name="position"
                            onChange={handleWorkInputChange}
                            placeholder="Enter Position"></input>

                          <input
                            className={styles.inputField}
                            type="number"
                            name="years"
                            onChange={handleWorkInputChange}
                            placeholder="Years"></input>
                          <div
                            className={styles.updateProfileButton}
                            onClick={() => {
                              if (
                                !inputData.company.trim() ||
                                !inputData.position.trim() ||
                                !inputData.years.trim()
                              ) {
                                alert("Please fill all work experience fields");
                                return;
                              }

                              const updatedPastWork = [
                                ...(userProfile.pastWork || []),
                                inputData,
                              ];

                              setPastWorkData(updatedPastWork);
                              setIsModalOpen(false);
                              setNameChanged(true);

                              setInputData({
                                company: "",
                                position: "",
                                years: "",
                              });
                            }}>
                            Add Work
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {nameChanged && (
                  <div
                    className={styles.updateProfileButton}
                    onClick={() => {
                      updateProfileData();
                    }}>
                    Update Profile
                  </div>
                )}
              </div>

              <div style={{ flex: "0.3", paddingBottom: "6vh" }}>
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
