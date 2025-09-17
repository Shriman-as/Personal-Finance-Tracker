import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import LandingPage from "./LandingPage";

function Root() {
  const [showApp, setShowApp] = useState(false);
  return showApp ? <App /> : <LandingPage onGetStarted={() => setShowApp(true)} />;
}

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
