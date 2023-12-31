import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import { UPLOAD_URL } from "../../config";

const Comments = ({ postId , addActivity, post}) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  //Display image
  const { isLoading: pLoading, data: profileData } = useQuery(["user"], () =>
  makeRequest.get("/users/find/" + currentUser.id).then((res)=> {
      return res.data;
  })
  )

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    if (desc !== "") {
      mutation.mutate({ desc, postId });
      addActivity({label: "Commented on " + post.username + " " + post.name + "'s post", moment: moment(), link: `/profile/${post.userId}`})
    } 
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        {pLoading? <></> : <img src={UPLOAD_URL + profileData.profilePic} alt="" /> }
        <input
          type="text"
          placeholder="Write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment, index) => (
            <div className="comment" key={index}>
              <img src={UPLOAD_URL + comment.profilePic} alt="" />
              <div className="info">
                <span>{comment.username} {comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;