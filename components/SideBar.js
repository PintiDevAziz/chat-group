import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AuthContext } from "../helpers/context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth, db } from "../helpers/firebase";
import NewChannelPopUp from "../components/NewChannelPopUp";
import { collection, onSnapshot } from "firebase/firestore";
import ChannelItem from "../components/ChannelItem";
import Loading from "../components/Loading";
const SideBar = () => {
  const { user, userLoading } = useContext(AuthContext);
  const [userModal, setUserModal] = useState(false);
  const [channelPopUp, setChannelPopUp] = useState(false);
  const [loading, setLoading] = useState();
  const [channels, setChannels] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setLoading(true);

    const colRef = collection(db, "channels");
    const unsubscirbe = onSnapshot(colRef, async (snap) => {
      await setChannels(
        snap.docs
          .map((doc) => doc.data())
          .filter((data) => data.members.includes(user?.email))
      );
      await setLoading(false);
    });
    return unsubscirbe;
  }, [user]);
  return (
    <>
      <NewChannelPopUp
        channelPopUp={channelPopUp}
        setChannelPopUp={setChannelPopUp}
      />
      <div className="h-screen font-mono bg-themeBlack py-4 px-6 w-72 text-white relative">
        <div className="w-full flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Channels</h2>
          <button
            className="bg-themeGray p-2 rounded-md hover:bg-themeGray/80"
            onClick={() => {
              setChannelPopUp(true);
            }}
          >
            <AiOutlinePlus size={19} />
          </button>
        </div>
        <label className="relative w-full flex items-center mb-6">
          <input
            type="text"
            className="bg-themeGray rounded outline-none peer px-2 pl-10 w-full h-10"
            placeholder="Search"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <AiOutlineSearch
            className="absolute left-2 peer-focus-within:text-white text-gray-400 transition-all"
            size={18}
          />
        </label>
        <div className="flex flex-col gap-y-3">
          {loading ? (
            <Loading />
          ) : (
            channels
              .filter((channel) =>
                channel.channelMeta.name.includes(search.toLowerCase())
              )
              .map((c) => <ChannelItem channelMeta={c.channelMeta} />)
          )}
        </div>
        {!userLoading && (
          <div className="absolute  bottom-0 py-3 bg-themeBlackDarker  left-0 flex items-center justify-around  w-72 ">
            <img
              className="rounded-lg w-10 h-10 object-cover"
              src={user.photoURL || "/noAvatar.jpg"}
              alt={user.displayName + "'s chat app avatar"}
            />
            <p className="text-gray-400 tracking-wider">{user.displayName}</p>
            <button className="relative ">
              <div
                className={`bg-themeGray ${
                  userModal ? "opacity-100 scale-100" : "opacity-0  scale-0"
                } rounded-md absolute bottom-14  transition-all  flex flex-col gap-y-2 right-0  w-40   p-3 box-content border-gray-700 border`}
              >
                <Link href={"/user/profile"}>
                  <a className="flex items-center gap-x-2   w-full   hover:bg-white/20  p-2 rounded-md  transition-all  ">
                    <FaUserCircle />
                    <p className="flex-shrink-0">My Profile</p>
                  </a>
                </Link>

                <button
                  onClick={() => {
                    signOut(auth);
                  }}
                  className="flex items-center gap-x-2  w-full text-red-500    hover:bg-red-300/20  p-2 rounded-md  transition-all  "
                >
                  <FiLogOut />
                  <p className="flex-shrink-0 ">LogOut</p>
                </button>
              </div>
              <button onClick={() => setUserModal(!userModal)}>
                <MdKeyboardArrowDown
                  size={21}
                  className={`transition-all ${
                    userModal ? " rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBar;
