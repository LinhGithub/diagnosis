import React, { useState, useEffect } from "react";

import { InboxOutlined, AlertOutlined } from "@ant-design/icons";
import { Typography, Button } from "antd";
import { Select, Space, Card, Avatar, List, message } from "antd";

const { Paragraph } = Typography;

const Chat = () => {
  return (
    <div>
      <Typography.Title level={4}>Hỏi đáp với bác sĩ</Typography.Title>
      <Paragraph level={4}>Đang cập nhật!</Paragraph>
    </div>
  );
};

export default Chat;
