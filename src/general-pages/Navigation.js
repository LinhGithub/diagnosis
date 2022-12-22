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
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Layout, Menu, Image, Modal } from "antd";
import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import { isAuth } from "../settings/utils";

import myLogo from "../assets/images/unnamed.png";

const { confirm } = Modal;

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
  const cookies = new Cookies();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.replace("/", "");
  const [keyDefault, setKeyDefault] = useState(
    ListRoutes.includes(pathname) ? pathname : "overview"
  );

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
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      hidden: true,
    },
    {
      key: "map",
      icon: <EnvironmentOutlined />,
      label: "Bản đồ",
      hidden: false,
    },
    {
      key: "signin",
      icon: <LoginOutlined />,
      label: "Sign In",
      hidden: false,
    },
    {
      key: "signout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      hidden: true,
    },
  ]);

  const mockupSignin = () => {
    var tabs = [];
    if (isAuth()) {
      var url = location.pathname.split("/");
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
    }
    setOptionsTab(tabs);
  };

  useEffect(() => {
    mockupSignin();
    setKeyDefault(pathname);
  }, [pathname]);

  const handleChangeTab = (option) => {
    if (option.key === "signout") {
      confirm({
        title: "Bạn chắc chắn muốn đăng xuất?",
        icon: <ExclamationCircleFilled />,
        content: "Bạn sẽ phải đăng nhập lại để sử dụng.",
        okText: "Đăng xuất",
        cancelText: "Hủy",
        onOk() {
          localStorage.clear();
          cookies.remove("refreshToken");
          mockupSignin();
          setKeyDefault("signin");
          navigate("/signin");
        },
        onCancel() {},
      });
    } else {
      if (isAuth()) {
        setKeyDefault(option.key);
        navigate(option.key);
      } else {
        if (
          ![
            "/overview",
            "/diagnosis",
            "/chat",
            "/signin",
            "/signout",
            "/profile",
            "/map",
          ].includes("/" + option.key)
        ) {
          navigate("/overview");
          setKeyDefault("overview");
        } else {
          navigate(option.key);
          setKeyDefault(option.key);
        }
      }
    }
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
