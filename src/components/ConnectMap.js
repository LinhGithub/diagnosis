import React from "react";

import { Typography } from "antd";
import Map from "./Map";

function ConnectMap() {
  // const key = "AIzaSyDWTx7bREpM5B6JKdbzOvMW-RRlhkukmVE";
  // const key = "AIzaSyDNI_ZWPqvdS6r6gPVO50I4TlYkfkZdXh8";
  // const key = "AIzaSyDaOulQACiJzBfqumbsqg_-vKha8fCnL-s";
  const key = "AIzaSyDc7PnOq3Hxzq6dxeUVaY8WGLHIePl0swY";
  return (
    <div>
      <Typography.Title level={4}>Bản đồ</Typography.Title>
      <Map
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={
          <div
            style={{
              height: `80vh`,
              margin: `auto`,
              border: "2px solid black",
            }}
          />
        }
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}

export default ConnectMap;
