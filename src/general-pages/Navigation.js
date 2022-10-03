import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  WechatOutlined,
  PieChartOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Image } from "antd";
import React, { useState } from "react";
import "../App.css";
import { useNavigate, useLocation } from "react-router-dom";

import myLogo from "../assets/images/unnamed.png";

const { Sider } = Layout;
const ListRoutes = ["overview", "diagnosis", "chat"];

function Navigation({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.replace("/", "");
  const [keyDefault, setKeyDefault] = useState(
    ListRoutes.includes(pathname) ? pathname : "overview"
  );

  const handleChangeTab = (option) => {
    setKeyDefault(option.key);
    navigate(option.key);
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="text-center m-2">
        <Image src={myLogo} alt="" width={50} preview={false}></Image>
      </div>
      <div className="border-t-2 border-indigo-200"></div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[keyDefault]}
        onClick={handleChangeTab}
        items={[
          {
            key: "overview",
            icon: <PieChartOutlined />,
            label: "Tổng quan",
          },
          {
            key: "diagnosis",
            icon: <MedicineBoxOutlined />,
            label: "Chẩn đoán bệnh",
          },
          {
            key: "chat",
            icon: <WechatOutlined />,
            label: "Hỏi đáp",
          },
        ]}
      />
      <div className="absolute bottom-0" style={{ width: "100%" }}>
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            style: { width: "100%" },
            onClick: () => setCollapsed(!collapsed),
          }
        )}
      </div>
    </Sider>
  );
}

export default Navigation;
