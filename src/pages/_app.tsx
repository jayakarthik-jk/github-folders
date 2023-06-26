import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { type FC } from "react";

import UserContext from "@/context/UserContext";
import Navbar from "@/components/common/Navbar";
import useDeviceType from "@/hooks/useDeviceType";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const deviceType = useDeviceType();

  return (
    <UserContext>
      <div className={`${deviceType === "mobile" ? "px-2" : "px-6"}`}>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </UserContext>
  );
};

export default App;
