import React from "react";
import { Button, Form, Input, Card, message } from "antd";
import axios from "axios";
import { urlAPI } from "../settings/Config";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Signin() {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const onFinish = async (values) => {
    var data_json = {
      username: values.username,
      password: values.password,
    };

    const requestOptions = {
      method: "POST",
      url: urlAPI + `login`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data_json),
    };

    axios(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          localStorage.setItem("token", data?.accessToken);
          localStorage.setItem("role", data?.role);
          cookies.set("refreshToken", data?.refreshToken, { path: "/" });
          navigate("/profile");
        } else {
          message.error(data.msg);
        }
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  return (
    <div className="grid justify-items-center mt-20">
      <Card style={{ width: 500 }}>
        <Form
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            username: "",
            password: "",
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Tài khoản"
            name="username"
            rules={[
              {
                required: true,
                message: "Vui lòng điền tài khoản!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng điền mật khẩu!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Signin;
