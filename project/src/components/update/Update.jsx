import { useContext, useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AuthContext } from "../../context/authContext";
import moment from "moment";
import { UPLOAD_URL } from "../../config";

const Update = ({ setOpenUpdate, user, addActivity }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    username: user.username,
    name: user.name,  
    city: user.city,
    website: user.website,
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value}));
  };

  const { currentUser, updateUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        updateUser(user);
        // updateUser({ ...currentUser, ...texts });
        // Invalidate and refetch
        queryClient.invalidateQueries(["users"]);
        addActivity({label: "Updated profile", moment: moment(), link: `/profile/${currentUser.id}`})
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let coverUrl = user.coverPic
    let profileUrl = user.profilePic
    if (cover) {
      coverUrl = await upload(cover)
      coverUrl = coverUrl.imageUrl.split("/").pop() 
    }
    if (profile) {
      profileUrl = await upload(profile)
      profileUrl = profileUrl.imageUrl.split("/").pop() 
    }

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);

    return false;
  };

  const handleCoverChange = (e) => {
    e.preventDefault(); // Prevent default form submission for cover input
    setCover(e.target.files[0]);
  };
  
  const handleProfileChange = (e) => {
    e.preventDefault(); // Prevent default form submission for profile input
    setProfile(e.target.files[0]);
  };
  

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Your Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : UPLOAD_URL + user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={handleCoverChange}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : UPLOAD_URL + user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={handleProfileChange}
            />
          </div>
          <div className="name">
            <div className="name1">
              <label>First Name</label>
              <input
                type="text"
                value={texts.username}
                name="username"
                onChange={handleChange}
              />
            </div>
            <div className="name2">
              <label>Last Name</label>
              <input
                type="text"
                value={texts.name}
                name="name"
                onChange={handleChange}
              />
            </div>
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button type="submit">Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Update;