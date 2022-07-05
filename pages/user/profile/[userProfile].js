import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../helpers/context/AuthContext";
import Loading from "../../../components/Loading";
import { auth, db } from "../../../helpers/firebase";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { storage } from "../../../helpers/firebase";
import { AiOutlineEdit } from "react-icons/ai";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
const UserProfile = () => {
  const router = useRouter();
  const [profileUser, setProfileUser] = useState(null);
  const [channelsJoined, setChannelsJoined] = useState(null);
  const { user } = useContext(AuthContext);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [mode, setMode] = useState("view");
  useEffect(() => {
    if (router.query.userProfile) {
      const docRef = doc(db, "users", router.query.userProfile);
      const cColRef = collection(db, "channels");
      const q = query(
        cColRef,
        where("members", "array-contains", router.query.userProfile)
      );
      onSnapshot(docRef, (snap) => {
        setProfileUser(snap.data());
      });
      onSnapshot(q, (snap) => {
        setChannelsJoined(snap.docs.map((d) => d.data()));
      });

      console.log(router.query);
    }
  }, [router.query]);
  const updateAvatar = async (e) => {
    const docRef = doc(db, "users", router.query.userProfile);

    const avatarRef = ref(
      storage,
      `gs://chat-group-7c45c.appspot.com/userAvatars/${user.email}-avatar`
    );
    await deleteObject(avatarRef).then((data) => console.log(data));

    await setDoc(docRef, { photoUrl: null }, { merge: true });
    const myPromise = uploadBytes(avatarRef, e.target.files[0]);
    toast.promise(myPromise, {
      loading: "Avatar Updating",
      success: "Avatar Updated",
      error: "Error when fetching",
    });
    myPromise.then((img) => {
      getDownloadURL(avatarRef).then((url) => {
        if (url) {
          setDoc(
            docRef,
            {
              photoUrl: url,
            },
            { merge: true }
          );
        }
      });
    });
  };
  const updateName = (e) => {
    if (e.key === "Enter") {
      const docRef = doc(db, "users", router.query.userProfile);

      const namePromise = setDoc(
        docRef,
        {
          name: nameInput,
        },
        { merge: true }
      );
      updateProfile(auth.currentUser, { displayName: nameInput });
      toast.promise(namePromise, {
        loading: "Name Updating",
        success: "Name Updated",
        error: "Error when fetching",
      });
      setNameInput("");
    }
  };
  const updateBio = (e) => {
    const docRef = doc(db, "users", router.query.userProfile);

    if (e.key === "Enter") {
      const bioPromise = setDoc(docRef, { bio: bioInput }, { merge: true });
      toast.promise(bioPromise, {
        loading: "Bio Updating",
        success: "Bio Updated",
        error: "Error when fetching",
      });
      setBioInput();
    }
  };
  return (
    <div className="flex p-24  w-full h-screen bg-themeGray">
      {profileUser === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loading size={400} />
        </div>
      ) : user.uid === profileUser.id ? (
        <div className="flex  w-full h-full flex-col gap-y-6">
          <button
            onClick={() => {
              if (mode == "view") {
                setMode("edit");
                toast.success(`Mode edit`);
              } else {
                setMode("view");
                toast.success(`Mode view`);
              }
            }}
            className=" absolute top-10 right-10 text-gray-400 hover:text-white text-3xl"
          >
            <AiOutlineEdit />
          </button>
          <h1 className="mx-auto text-white capitalize text-3xl">
            Your Profile
          </h1>
          <div className="rounded-md w-full h-32 bg-themeBlack p-4 flex items-center">
            <label className="flex cursor-pointer group relative items-center justify-center mr-5 flex-shrink-0">
              <img
                src={profileUser.photoUrl || "/noavatar.jpg"}
                alt=""
                className="w-20 h-20 object-cover rounded-full"
              />
              {mode == "edit" && (
                <div className="group-hover:scale-100 w-full h-full flex items-center justify-center  -translate-y-1/2 -translate-x-1/2 rounded-full scale-0 transition-transform absolute top-1/2 left-1/2 bg-themeBlack/80 z-10">
                  <MdOutlineAddAPhoto className="text-white text-3xl" />
                </div>
              )}
              <input
                accept="image/*"
                type="file"
                className="hidden"
                onChange={updateAvatar}
              />
            </label>
            <div className="flex flex-col gap-y-1">
              <h2 className="text-white group cursor-pointer text-xl  capitalize flex items-center  font-semibold">
                {mode == "edit" ? (
                  <input
                    onKeyDown={updateName}
                    type="text"
                    onChange={(e) => setNameInput(e.target.value)}
                    value={nameInput}
                    className="bg-transparent mb-1 cursor-pointer outline-none border-b "
                    placeholder={profileUser.name}
                  />
                ) : (
                  profileUser.name
                )}
              </h2>
              <div
                onClick={() => {
                  copy(profileUser.id);
                  toast.success("Copied Succesful", {
                    icon: <HiOutlineClipboardCopy />,
                  });
                }}
                className="text-gray-400 flex items-start gap-x-1 group cursor-pointer"
              >
                <p>{profileUser.id}</p>
                <button className="text-xl scale-0 group-hover:scale-100 transition-transform">
                  <HiOutlineClipboardCopy />
                </button>
              </div>
            </div>
            <div className="bg-gray-500 h-full w-[2px] mx-4"></div>
            <div className="text-gray-300  w-full h-full py-2">
              {mode == "edit" ? (
                <textarea
                  onChange={(e) => setBioInput(e.target.value)}
                  onKeyDown={updateBio}
                  value={bioInput}
                  placeholder={profileUser.bio || "No Bio Yet"}
                  className="w-full bg-transparent resize-none border-b h-full outline-none"
                />
              ) : (
                profileUser.bio
              )}
            </div>
          </div>
          <h1 className="mx-auto text-white capitalize text-3xl">
            Groups {profileUser.name} Joined
          </h1>
          <div className="bg-themeBlack rounded-md p-4 flex flex-col gap-y-4">
            <div className="bg-themeGray w-full px-10 py-4 rounded-md text-white flex justify-around">
              <h2 className="text-lg capitalize">Group Name</h2>
              <h2 className="text-lg capitalize">Group Members</h2>
              <h2 className="text-lg capitalize">Group Id</h2>
              <h2 className="text-lg capitalize">Group Admin</h2>
            </div>
            {channelsJoined === null ? (
              <div>Still didn't join any group</div>
            ) : (
              channelsJoined.map((channel, indeks) => (
                <div
                  key={indeks}
                  className="bg-themeGray w-full   py-4 rounded-md flex justify-around text-white px-10"
                >
                  <h2 className="text-lg capitalize w-1/4 flex items-center  justify-center">
                    {channel.channelMeta.name}
                  </h2>
                  <h2 className="text-lg capitalize w-1/4 flex items-center  justify-center">
                    {channel.members.length}
                  </h2>
                  <h2
                    onClick={() => {
                      copy(channel.channelMeta.id);
                      toast.success("Channel Id Copied Succesfuly", {
                        icon: <HiOutlineClipboardCopy />,
                      });
                    }}
                    className="text-lg capitalize w-1/4 flex group cursor-pointer  gap-x-1 items-center justify-center"
                  >
                    <p> {channel.channelMeta.id}</p>
                    <p className="scale-0 group-hover:scale-100">
                      <HiOutlineClipboardCopy />
                    </p>
                  </h2>
                  <h2 className="text-lg capitalize w-1/4 flex  items-center justify-center">
                    {channel.channelMeta.admin.name}
                  </h2>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="flex  w-full h-full flex-col gap-y-6">
          <h1 className="mx-auto text-white capitalize text-3xl">
            About {profileUser.name}
          </h1>
          <div className="rounded-md w-full h-32 bg-themeBlack p-4 flex items-center">
            <img
              src={profileUser.photoUrl}
              alt=""
              className="w-20 object-scale-down  mr-4  h-20 rounded-full"
            />
            <div className="flex flex-col gap-y-1">
              <h2 className="text-white text-xl capitalize font-semibold">
                {profileUser.name}
              </h2>
              <div
                onClick={() => {
                  copy(profileUser.id);
                  toast.success("Copied Succesful", {
                    icon: <HiOutlineClipboardCopy />,
                  });
                }}
                className="text-gray-400 flex items-start gap-x-1 group cursor-pointer"
              >
                <p>{profileUser.id}</p>
                <button className="text-xl scale-0 group-hover:scale-100 transition-transform">
                  <HiOutlineClipboardCopy />
                </button>
              </div>
            </div>
            <div className="bg-gray-500 h-full w-[2px] mx-4"></div>
            <div className="text-gray-300">{profileUser.bio}</div>
          </div>
          <h1 className="mx-auto text-white capitalize text-3xl">
            Groups {profileUser.name} Joined
          </h1>
          <div className="bg-themeBlack rounded-md p-4 flex flex-col gap-y-4">
            <div className="bg-themeGray w-full px-10 py-4 rounded-md text-white flex justify-around">
              <h2 className="text-lg capitalize">Group Name</h2>
              <h2 className="text-lg capitalize">Group Members</h2>
              <h2 className="text-lg capitalize">Group Id</h2>
              <h2 className="text-lg capitalize">Group Admin</h2>
            </div>
            {channelsJoined === null ? (
              <div>Still didn't join any group</div>
            ) : (
              channelsJoined.map((channel, indeks) => (
                <div
                  key={indeks}
                  className="bg-themeGray w-full   py-4 rounded-md flex justify-around text-white px-10"
                >
                  <h2 className="text-lg capitalize w-1/4 flex items-center  justify-center">
                    {channel.channelMeta.name}
                  </h2>
                  <h2 className="text-lg capitalize w-1/4 flex items-center  justify-center">
                    {channel.members.length}
                  </h2>
                  <h2
                    onClick={() => {
                      copy(channel.channelMeta.id);
                      toast.success("Channel Id Copied Succesfuly", {
                        icon: <HiOutlineClipboardCopy />,
                      });
                    }}
                    className="text-lg capitalize w-1/4 flex group cursor-pointer  gap-x-1 items-center justify-center"
                  >
                    <p> {channel.channelMeta.id}</p>
                    <p className="scale-0 group-hover:scale-100">
                      <HiOutlineClipboardCopy />
                    </p>
                  </h2>
                  <h2 className="text-lg capitalize w-1/4 flex  items-center justify-center">
                    {channel.channelMeta.admin.name}
                  </h2>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
