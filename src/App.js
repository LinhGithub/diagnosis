import React, { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";
import Navigation from "./general-pages/Navigation";
import { Layout } from "antd";

import { useLocation } from "react-router-dom";
// import socketIO from "socket.io-client";

// import { urlWeb } from "./material/Config";

// const socket = socketIO.connect(urlWeb);

const { Content } = Layout;

const App = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showNavigate, setShowNavigate] = useState(true);

  const navigateComponent = !showNavigate ? (
    <Navigation collapsed={collapsed} setCollapsed={setCollapsed}></Navigation>
  ) : (
    ""
  );

  const onRouteChanged = () => {
    const urlHidden = ["/illnesses", "/symptoms", '/rules'];
    if (urlHidden.includes(location.pathname)) {
      setShowNavigate(true);
    } else {
      setShowNavigate(false);
    }
  };

  useEffect(() => {
    onRouteChanged();
  },[]);

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="site-layout">
          {navigateComponent}
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            <AppRoutes></AppRoutes>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
