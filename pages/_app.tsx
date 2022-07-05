import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../helpers/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SideBar from "../components/SideBar";
import { Toaster } from "react-hot-toast";
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [hideSideBar, setHideSideBar] = useState(false);
  useEffect(() => {
    if (router.asPath.includes("user")) {
      setHideSideBar(true);
    } else {
      setHideSideBar(false);
    }
  }, [router.asPath]);
  return (
    <AuthContextProvider>
      <Toaster />
      <div className="flex">
        {!hideSideBar && <SideBar />}
        <Component {...pageProps} />
      </div>
    </AuthContextProvider>
  );
}

export default MyApp;
