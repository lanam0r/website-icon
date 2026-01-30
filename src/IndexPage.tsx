import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const IconExplorer = dynamic<{}>(
  () =>
    import("./components/IconExplorer").then(
      (m) => (m as unknown as { default: React.ComponentType<{}> }).default,
    ),
  { loading: () => <div>Loading...</div>, ssr: false },
);

const IndexPage: React.FC = () => (
  <>
    <Head>
      <title>Icons</title>
      <meta name="robots" content="noindex,nofollow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
      <IconExplorer />
    </div>
  </>
);

export default IndexPage;
