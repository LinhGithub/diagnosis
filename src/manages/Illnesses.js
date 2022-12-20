import React, { useEffect, useState } from "react";
import { Typography, Button, Modal, Form, Input, Spin, Select } from "antd";
import { Space, Card, List, message, Popconfirm } from "antd";
import {
  AlertOutlined,
  EditOutlined,
  DeleteOutlined,
  FrownOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import { urlAPI } from "../material/Config";

import axios from "axios";

const { Paragraph } = Typography;
// const { Meta } = Card;
const { Option } = Select;

function Illnesses() {
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [showEdit, setShowEdit] = useState(false);
  const [isReload, setIsReload] = useState(false);

  // get illness
  const [dataIllnesses, setDataIllnesses] = useState();
  // -get item illness
  const [illnessesSelect, setIllnessesSelect] = useState();
  const handleGetItem = (item) => {
    setIllnessesSelect(item);
    formEdit.setFieldValue("name", item.name);
    formEdit.setFieldValue("rule", item.rule ? item.rule : "only");
    setShowEdit(true);
  };

  // -update illness
  const handelUpdateIllness = (values) => {
    if (illnessesSelect) {
      var data_json = {
        name: values.name,
        rule: values.rule,
      };

      const requestOptions = {
        method: "PUT",
        url: urlAPI + `/illnesses/${illnessesSelect._id}`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(data_json),
      };

      axios(requestOptions)
        .then((res) => {
          const data = res.data;
          if (data.code === 200) {
            message.success(data.msg);
            setIsReload(!isReload);
            setShowEdit(false);
          } else {
            message.warning(data.msg);
          }
        })
        .catch((error) => {
          message.error("Kết nối thất bại");
        });
    } else {
      message.error("Có lỗi xảy ra");
    }
  };

  // -delete illness
  const handleDeleteItem = (id) => {
    const requestOptions = {
      method: "DELETE",
      url: urlAPI + `/illnesses/${id}`,
    };

    axios(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          message.success(data.msg);
          setIsReload(!isReload);
        } else {
          message.warning(data.msg);
        }
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  useEffect(() => {
    if (formAdd) {
      formAdd.setFieldValue("name", "");
      formAdd.setFieldValue("rule", "only");
    }
  }, [isReload, formAdd]);

  // insert illness
  const handleAddIllness = (values) => {
    var data_json = {
      name: values.name,
      type: "illness",
      rule: values.rule,
    };

    const requestOptions = {
      method: "POST",
      url: urlAPI + `/illnesses`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data_json),
    };

    axios(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          message.success(data.msg);
          setIsReload(!isReload);
        } else {
          message.warning(data.msg);
        }
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  // -get all illness
  const appendData = () => {
    const requestOptions = {
      method: "GET",
      url: urlAPI + `/illnesses?type=illness`,
    };

    axios(requestOptions)
      .then((res) => {
        const data = res.data;
        setDataIllnesses(data.results);
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  useEffect(() => {
    appendData();
  }, [isReload]);
  // ===

  // config select rule
  const selectProps = {
    style: {
      width: "100%",
    },
    placeholder: "Chọn luật",
    maxTagCount: "responsive",
    notFoundContent: (
      <div className="text-center">
        <InboxOutlined
          style={{
            fontSize: "54px",
          }}
        />
        <Paragraph>Không có kết quả nào</Paragraph>
      </div>
    ),
  };
  // ===

  return (
    <div>
      <Typography.Title level={4}>Quản lý danh sách bệnh</Typography.Title>
      <div className="md:flex">
        <div className="flex-1 p-2">
          <Card>
            <Typography.Title level={5}>Danh sách</Typography.Title>
            <div className="h-[65vh] overflow-y-auto scrollbar p-3">
              {dataIllnesses !== undefined ? (
                dataIllnesses.length ? (
                  <List>
                    {dataIllnesses.map((item) => (
                      <List.Item key={item._id}>
                        <List.Item.Meta
                          title={
                            <div className="md:flex justify-between">
                              <div className="mb-4">
                                <AlertOutlined className="mr-2" />
                                {item.name}
                              </div>
                              <Space>
                                <Button
                                  shape="circle"
                                  icon={<EditOutlined />}
                                  onClick={() => handleGetItem(item)}
                                />

                                <Popconfirm
                                  placement="top"
                                  title="Bạn có chắc chắn muốn xóa?"
                                  onConfirm={() => handleDeleteItem(item._id)}
                                  okText="Đồng ý"
                                  cancelText="Không"
                                >
                                  <Button
                                    shape="circle"
                                    danger
                                    icon={<DeleteOutlined />}
                                  />
                                </Popconfirm>
                              </Space>
                            </div>
                          }
                        />
                      </List.Item>
                    ))}
                  </List>
                ) : (
                  <div className="text-center mt-5">
                    <Paragraph>Không có dữ liệu nào</Paragraph>
                    <FrownOutlined
                      style={{
                        fontSize: "30px",
                      }}
                    />
                  </div>
                )
              ) : (
                <div className="text-center mt-5">
                  <Spin size="large" />
                </div>
              )}
            </div>
            <Modal
              title="Sửa bệnh"
              visible={showEdit}
              onOk={() => setShowEdit(false)}
              onCancel={() => setShowEdit(false)}
              footer={null}
              forceRender
            >
              <Form form={formEdit} onFinish={handelUpdateIllness}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Không được để trống",
                    },
                  ]}
                  name="name"
                  label="Tên bệnh"
                >
                  <Input placeholder="Nhập tên bệnh" />
                </Form.Item>

                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Không được để trống",
                    },
                  ]}
                  name="rule"
                  label="Luật"
                >
                  <Select
                    {...selectProps}
                    optionFilterProp="children"
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    <Option value="only">Chỉ là bệnh</Option>
                    <Option value="both">Vừa là bệnh vừa là triệu chứng</Option>
                  </Select>
                </Form.Item>

                <Form.Item className="md:flex justify-end">
                  <Space>
                    <Button key="back" onClick={() => setShowEdit(false)}>
                      Đóng
                    </Button>

                    <Button key="submit" type="primary" htmlType="submit">
                      Cập nhật
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </Card>
        </div>
        <div className="flex-1 p-2">
          <Card className="">
            <Typography.Title level={5}>Thêm mới</Typography.Title>
            <div>
              <Form form={formAdd} onFinish={handleAddIllness}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Không được để trống",
                    },
                  ]}
                  name="name"
                  label="Tên bệnh"
                >
                  <Input placeholder="Nhập tên bệnh" />
                </Form.Item>

                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Không được để trống",
                    },
                  ]}
                  name="rule"
                  label="Luật"
                >
                  <Select
                    {...selectProps}
                    optionFilterProp="children"
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    <Option value="only">Chỉ là bệnh</Option>
                    <Option value="both">Vừa là bệnh vừa là triệu chứng</Option>
                  </Select>
                </Form.Item>

                <Form.Item className="md:flex justify-end">
                  <Button type="primary" htmlType="submit">
                    Thêm
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Illnesses;
