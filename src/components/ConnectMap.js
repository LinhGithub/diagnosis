import React from "react";

import { Typography } from "antd";
import Map from "./Map";

function ConnectMap() {
  return (
    <div>
      <Typography.Title level={4}>Bản đồ</Typography.Title>
      <Map></Map>
    </div>
  );
}

export default ConnectMap;
