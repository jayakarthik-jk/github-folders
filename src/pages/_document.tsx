import { Html, Head, Main, NextScript } from "next/document";
import { type FC } from "react";
import NextTopLoader from "nextjs-toploader";

const Document: FC = () => {
  return (
    <Html lang="en">
      <Head />
      <body>
        <NextTopLoader />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
