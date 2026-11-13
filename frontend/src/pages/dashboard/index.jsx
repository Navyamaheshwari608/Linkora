// import { BASE_URL } from "@/config";
// import DashboardLayout from "@/layout/DashboardLayout";
// import UserLayout from "@/layout/UserLayout";
// import { useRouter } from "next/router";
// import { useDispatch, useSelector } from "react-redux";
// import styles from "./index.module.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faComment,
//   faPlus,
//   faTrashCan,
// } from "@fortawesome/free-solid-svg-icons";
// import { useRef, useState } from "react";
// import {
//   createPost,
//   deletePost,
//   getAllComments,
//   getAllPosts,
//   incrementPostLike,
//   postComment,
// } from "@/config/redux/action/postAction";
// import { faThumbsUp } from "@fortawesome/free-solid-svg-icons/faThumbsUp";
// import { resetPostId } from "@/config/redux/reducers/postReducer";

// export default function Dashboard() {
//   // const dispatch = useDispatch();
//   const router = useRouter();
//   const authState = useSelector((state) => state.auth);
//   const postContent = useRef();
//   const postButton = useRef(null);
//   const commentRef = useRef();
//   const [fileContent, setFileContent] = useState();
//   const dispatch = useDispatch();
//   const postState = useSelector((state) => state.posts);

//   const handleUpload = async () => {
//     await dispatch(
//       createPost({ file: fileContent, body: postContent.current.value }),
//     );
//     postContent.current.value = "";
//     setFileContent("");
//     postButton.current.style.display = "none";
//     dispatch(getAllPosts());
//   };

//   return (
//     <UserLayout>
//       <DashboardLayout>
//         <div className={styles.scrollComponent}>
//           <div className={styles.createPostContainer}>
//             <img
//               className={styles.userProfile}
//               width={100}
//               src={`${BASE_URL}/${authState.user?.userId?.profilePicture || "default.jpg"}`}
//               alt="userIcon"
//             />

//             <textarea
//               className={styles.textAreaOfContent}
//               placeholder="What's in your mind?"
//               name=""
//               id=""
//               ref={postContent}
//               onChange={() => {
//                 postButton.current.style.display =
//                   postContent.current.value.trim().length > 0
//                     ? "block"
//                     : "none";
//               }}></textarea>

//             <label htmlFor="fileUpload">
//               <div className={styles.Fab}>
//                 <FontAwesomeIcon icon={faPlus} />
//               </div>
//             </label>
//             <input
//               onChange={(e) => setFileContent(e.target.files[0])}
//               type="file"
//               hidden
//               id="fileUpload"></input>
//             <div
//               ref={postButton}
//               className={styles.uploadButton}
//               style={{ display: "none" }}
//               onClick={handleUpload}>
//               Post
//             </div>
//           </div>

//           <div className={styles.postContainer}>
//             {postState.posts.map((post) => {
//               return (
//                 <div key={post.id} className={styles.singleCard}>
//                   <div className={styles.singleCard_profileContainer}>
//                     <img
//                       className={styles.userProfile}
//                       src={`${BASE_URL}/${post.userId.profilePicture}`}
//                       alt="postCreaterProfilePicture"></img>
//                     <div style={{ margin: "auto" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           width: "100%",
//                         }}>
//                         <p style={{ fontWeight: "bold" }}>{post.userId.name}</p>

//                         {post.userId?._id === authState.user?.userId?._id && (
//                           <FontAwesomeIcon
//                             style={{ color: "red", cursor: "pointer" }}
//                             onClick={async () => {
//                               await dispatch(deletePost(post._id));
//                               await dispatch(getAllPosts());
//                             }}
//                             icon={faTrashCan}
//                           />
//                         )}
//                       </div>
//                       <p style={{ color: "grey" }}>@{post.userId.username}</p>
//                       <p style={{ paddingTop: "1.3rem" }}>{post.body}</p>

//                       <div>
//                         <img
//                           className={styles.singleCard_image}
//                           src={`${BASE_URL}/${post.media}`}
//                         />
//                       </div>

//                       <div className={styles.optionsContainer}>
//                         <div
//                           onClick={async () => {
//                             await dispatch(incrementPostLike(post._id));
//                             await dispatch(getAllPosts());
//                           }}
//                           className={styles.singleOption_optionsContainer}>
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke-width="1.5"
//                             stroke="currentColor"
//                             class="size-6">
//                             <path
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                               d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
//                             />
//                           </svg>

//                           <p>{post.likes}</p>
//                         </div>

//                         <div
//                           onClick={() => {
//                             dispatch(getAllComments(post._id));
//                           }}
//                           className={styles.singleOption_optionsContainer}>
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke-width="1.5"
//                             stroke="currentColor"
//                             class="size-6">
//                             <path
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                               d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
//                             />
//                           </svg>
//                         </div>

//                         <div className={styles.singleOption_optionsContainer}>
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke-width="1.5"
//                             stroke="currentColor"
//                             class="size-6">
//                             <path
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                               d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {postState.postId !== "" && (
//           <div
//             onClick={() => {
//               dispatch(resetPostId());
//             }}
//             className={styles.commentsContainer}>
//             <div
//               onClick={(event) => {
//                 event.stopPropagation();
//               }}
//               className={styles.allCommentsContainer}>
//               {postState.comments.length === 0 && <h2>No Comments</h2>}

//               {postState.comments.length !== 0 && (
//                 <div>
//                   {postState.comments.map((postComment, index) => {
//                     return (
//                       <div
//                         className={styles.singleComment}
//                         key={postComment._id}>
//                         <div className={styles.singleComment_profileContainer}>
//                           <img
//                             height="23px"
//                             src={`${BASE_URL}/${postComment.userId.profilePicture}`}
//                           />

//                           <div>
//                             <p
//                               style={{
//                                 fontWeight: "bold",
//                                 fontSize: "1.2rem",
//                               }}>
//                               @{postComment.userId.username}
//                             </p>

//                             <p>{postComment.userId.name}</p>
//                           </div>
//                           <p>{postComment.body}</p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//               <div className={styles.postCommentContainer}>
//                 <input
//                   type="text"
//                   placeholder="Comment"
//                   className={styles}
//                   ref={commentRef}
//                 />

//                 <div
//                   onClick={async () => {
//                     await dispatch(
//                       postComment({
//                         post_id: postState.postId,
//                         body: commentRef.current.value,
//                       }),
//                     );
//                     await dispatch(getAllComments(postState.postId));
//                     commentRef.current.value = "";
//                   }}
//                   className={styles.postCommentContainer_commentBtn}>
//                   Comment
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </DashboardLayout>
//     </UserLayout>
//   );
// }

import { BASE_URL } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementPostLike,
  postComment,
} from "@/config/redux/action/postAction";
import { resetPostId } from "@/config/redux/reducers/postReducer";

export default function Dashboard() {
  // const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const postContent = useRef();
  const postButton = useRef(null);
  const commentRef = useRef();
  const [fileContent, setFileContent] = useState();
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.posts);

  const handleUpload = async () => {
    await dispatch(
      createPost({ file: fileContent, body: postContent.current.value }),
    );
    postContent.current.value = "";
    setFileContent("");
    postButton.current.style.display = "none";
    dispatch(getAllPosts());
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.createPostContainer}>
            <img
              className={styles.userProfile}
              width={100}
              src={`${BASE_URL}/${authState.user?.userId?.profilePicture || "default.jpg"}`}
              alt="userIcon"
            />

            <textarea
              className={styles.textAreaOfContent}
              placeholder="What's in your mind?"
              name=""
              id=""
              ref={postContent}
              onChange={() => {
                postButton.current.style.display =
                  postContent.current.value.trim().length > 0
                    ? "block"
                    : "none";
              }}></textarea>

            <label htmlFor="fileUpload">
              <div className={styles.Fab}>
                <FontAwesomeIcon icon={faPlus} />
              </div>
            </label>
            <input
              onChange={(e) => setFileContent(e.target.files[0])}
              type="file"
              hidden
              id="fileUpload"></input>
            <div
              ref={postButton}
              className={styles.uploadButton}
              style={{ display: "none" }}
              onClick={handleUpload}>
              Post
            </div>
          </div>

          <div className={styles.postContainer}>
            {postState.posts.map((post) => {
              return (
                <div key={post.id} className={styles.singleCard}>
                  <div className={styles.singleCard_profileContainer}>
                    <img
                      className={styles.userProfile}
                      src={`${BASE_URL}/${post.userId.profilePicture}`}
                      alt="postCreaterProfilePicture"></img>
                    <div style={{ margin: "auto" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}>
                        <p style={{ fontWeight: "bold" }}>{post.userId.name}</p>

                        {post.userId?._id === authState.user?.userId?._id && (
                          <FontAwesomeIcon
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={async () => {
                              await dispatch(deletePost(post._id));
                              await dispatch(getAllPosts());
                            }}
                            icon={faTrashCan}
                          />
                        )}
                      </div>
                      <p style={{ color: "grey" }}>@{post.userId.username}</p>
                      <p style={{ paddingTop: "1.3rem" }}>{post.body}</p>

                      <div>
                        <img
                          className={styles.singleCard_image}
                          src={`${BASE_URL}/${post.media}`}
                        />
                      </div>

                      <div className={styles.optionsContainer}>
                        <div
                          onClick={async () => {
                            await dispatch(incrementPostLike(post._id));
                            await dispatch(getAllPosts());
                          }}
                          className={styles.singleOption_optionsContainer}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-6">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                            />
                          </svg>

                          <p>{post.likes}</p>
                        </div>

                        <div
                          onClick={() => {
                            dispatch(getAllComments(post._id));
                          }}
                          className={styles.singleOption_optionsContainer}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-6">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                            />
                          </svg>
                        </div>

                        <div className={styles.singleOption_optionsContainer}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-6">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {postState.postId !== "" && (
          <div
            onClick={() => {
              dispatch(resetPostId());
            }}
            className={styles.commentsContainer}>
            <div
              onClick={(event) => {
                event.stopPropagation();
              }}
              className={styles.allCommentsContainer}>
              <div className={styles.commentsList}>
                {postState.comments.length === 0 && <h2>No Comments</h2>}

                {postState.comments.length !== 0 && (
                  <div>
                    {postState.comments.map((postComment, index) => {
                      return (
                        <div
                          className={styles.singleComment}
                          key={postComment._id}>
                          <div
                            className={styles.singleComment_profileContainer}>
                            <img
                              height="23px"
                              src={`${BASE_URL}/${postComment.userId.profilePicture}`}
                              alt="commenter profile"
                            />

                            <div>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "1.2rem",
                                }}>
                                @{postComment.userId.username}
                              </p>

                              <p>{postComment.userId.name}</p>
                            </div>

                            <p>{postComment.body}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={styles.postCommentContainer}>
                <input
                  type="text"
                  placeholder="Comment"
                  className={styles.commentInput}
                  ref={commentRef}
                />

                <div
                  onClick={async () => {
                    if (commentRef.current.value) {
                      await dispatch(
                        postComment({
                          post_id: postState.postId,
                          body: commentRef.current.value,
                        }),
                      );
                      await dispatch(getAllComments(postState.postId));
                      commentRef.current.value = "";
                    }
                  }}
                  className={styles.postCommentContainer_commentBtn}>
                  Comment
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
