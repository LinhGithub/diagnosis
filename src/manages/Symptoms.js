import React, { useEffect, useState } from "react";
import { Typography, Button, Modal, Form, Input,Select } from "antd";
import { Space, Card, List, message, Popconfirm, Spin } from "antd";
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

function Symptoms() {
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [showEdit, setShowEdit] = useState(false);
  const [isReload, setIsReload] = useState(false);

  // get symptom
  const [dataSymptoms, setDataSymptoms] = useState();
  // -get item symptom
  const [symptomSelect, setSymptomSelect] = useState();
  const handleGetItem = (item) => {
    setSymptomSelect(item);
    formEdit.setFieldValue("name", item.name);
    formEdit.setFieldValue("rule", item.rule ? item.rule : "only");
    setShowEdit(true);
  };

  // -update symptom
  const handelUpdateSymptom = (values) => {
    if (symptomSelect) {
      var bodyFormData = new FormData();
      bodyFormData.append("name", values.name);
      bodyFormData.append("rule", values.rule);

      const requestOptions = {
        method: "PUT",
        url: urlAPI + `/illnesses/${symptomSelect._id}`,
        data: bodyFormData,
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

  // -delete symptom
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
    formAdd.setFieldValue("name", "");
    formAdd.setFieldValue("rule", "only");
  }, [isReload, formAdd]);

  // insert symptom
  const handleAddSymptom = (values) => {
    var bodyFormData = new FormData();
    bodyFormData.append("name", values.name);
    bodyFormData.append("type", "symptom");
    bodyFormData.append("rule", values.rule);

    const requestOptions = {
      method: "POST",
      url: urlAPI + `/illnesses`,
      data: bodyFormData,
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

  // -get all symptom
  const appendData = () => {
    const requestOptions = {
      method: "GET",
      url: urlAPI + `/illnesses?type=symptom`,
    };

    axios(requestOptions)
      .then((res) => {
        const data = res.data;
        setDataSymptoms(data.results);
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
      <Typography.Title level={4}>
        Quản lý danh sách triệu chứng
      </Typography.Title>
      <div className="md:flex">
        <div className="flex-1 p-2">
          <Card>
            <Typography.Title level={5}>Danh sách</Typography.Title>
            <div className="h-[65vh] overflow-y-auto scrollbar p-3">
              {dataSymptoms !== undefined ? (
                dataSymptoms.length ? (
                  <List>
                    {dataSymptoms.map((item) => (
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
              title="Sửa triệu chứng"
              visible={showEdit}
              onOk={() => setShowEdit(false)}
              onCancel={() => setShowEdit(false)}
              footer={null}
            >
              <Form form={formEdit} onFinish={handelUpdateSymptom}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Không được để trống",
                    },
                  ]}
                  name="name"
                  label="Tên triệu chứng"
                >
                  <Input placeholder="Nhập tên triệu chứng" />
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
                    <Option value="only">Chỉ là triệu chứng</Option>
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
              <Form form={formAdd} onFinish={handleAddSymptom}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Không được để trống",
                    },
                  ]}
                  name="name"
                  label="Tên triệu chứng"
                >
                  <Input placeholder="Nhập tên triệu chứng" />
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
                    <Option value="only">Chỉ là triệu chứng</Option>
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

export default Symptoms;
