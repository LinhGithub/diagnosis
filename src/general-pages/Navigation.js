import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  WechatOutlined,
  PieChartOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
  ProjectOutlined,
  WalletOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Image } from "antd";
import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate, useLocation } from "react-router-dom";

import myLogo from "../assets/images/unnamed.png";

const { Sider } = Layout;
const ListRoutes = [
  "overview",
  "diagnosis",
  "chat",
  "symptoms",
  "illnesses",
  "rules",
  "signin",
  "signout",
  "profile",
  "map",
];

function Navigation({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.replace("/", "");
  const [keyDefault, setKeyDefault] = useState(
    ListRoutes.includes(pathname) ? pathname : "overview"
  );

  const [checkLogin, setCheckLogin] = useState(localStorage.getItem("token"));
  const [optionsTab, setOptionsTab] = useState([
    {
      key: "overview",
      icon: <PieChartOutlined />,
      label: "Tổng quan",
      hidden: false,
    },
    {
      key: "diagnosis",
      icon: <MedicineBoxOutlined />,
      label: "Chẩn đoán bệnh",
      hidden: false,
    },
    {
      key: "chat",
      icon: <WechatOutlined />,
      label: "Hỏi đáp",
      hidden: false,
    },
    {
      key: "symptoms",
      icon: <ProfileOutlined />,
      label: "Quản lý triệu chứng",
      hidden: true,
    },
    {
      key: "illnesses",
      icon: <ProjectOutlined />,
      label: "Quản lý bệnh",
      hidden: true,
    },
    {
      key: "rules",
      icon: <WalletOutlined />,
      label: "Quản lý luật",
      hidden: true,
    },
    {
      key: "signin",
      icon: <LoginOutlined />,
      label: "Sign In",
      hidden: false,
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      hidden: true,
    },
    {
      key: "signout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      hidden: true,
    },
    {
      key: "map",
      icon: <EnvironmentOutlined />,
      label: "Bản đồ",
      hidden: false,
    },
  ]);

  const mockupSignin = () => {
    var tabs = [];
    if (checkLogin) {
      var url = location.pathname.split("/");
      var index = optionsTab.findIndex(({ key }) => key === "chat");
      if (index) {
        tabs = optionsTab.map((item) => {
          if (
            ["illnesses", "rules", "symptoms", "signout", "profile"].includes(
              item.key
            )
          ) {
            item.hidden = false;
          }
          if (["signin"].includes(item.key)) {
            item.hidden = true;
          }
          return item;
        });
      }
      if (url[1] === "signin") {
        navigate("profile");
        setKeyDefault("profile");
      } else {
        navigate(url[1]);
        setKeyDefault(url[1]);
      }
    } else {
      tabs = optionsTab.map((item) => {
        if (
          ["illnesses", "rules", "symptoms", "signout", "profile"].includes(
            item.key
          )
        ) {
          item.hidden = true;
        }
        if (["signin"].includes(item.key)) {
          item.hidden = false;
        }
        return item;
      });
      setKeyDefault("overview");
      navigate("overview");
    }
    setOptionsTab(tabs);
  };

  useEffect(() => {
    mockupSignin();
  }, [checkLogin]);

  const handleChangeTab = (option) => {
    var checkToken = checkLogin;
    if (option.key === "signout") {
      localStorage.removeItem("token");
      checkToken = undefined;
      setCheckLogin();
    } else if (option.key === "signin") {
      var token = "12345";
      localStorage.setItem("token", token);
      checkToken = token;
    }

    if (checkToken) {
      setKeyDefault(option.key);
      navigate(option.key);
    } else {
      if (
        ![
          "overview",
          "diagnosis",
          "chat",
          "signin",
          "signout",
          "profile",
          "map",
        ].includes(option.key)
      ) {
        setKeyDefault("overview");
        navigate("overview");
      } else {
        setKeyDefault(option.key);
        navigate(option.key);
      }
    }
    setCheckLogin(checkToken);
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
        selectedKeys={[keyDefault]}
        onClick={handleChangeTab}
        items={optionsTab.filter((item) => item.hidden === false)}
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
