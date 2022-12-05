import React from "react";

import { Typography } from "antd";
import Map from "./Map";

function ConnectMap() {
  const key = "yourKey";
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
