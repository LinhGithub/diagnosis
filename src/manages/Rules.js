import React, { useEffect, useState } from "react";
import { Typography, Button, Modal, Form, Spin } from "antd";
import { Space, Card, List, message, Popconfirm, Select } from "antd";
import {
  AlertOutlined,
  EditOutlined,
  DeleteOutlined,
  FrownOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import axios from "axios";

import { urlAPI } from "../material/Config";

const { Paragraph } = Typography;
// const { Meta } = Card;
const { Option } = Select;

function Rules() {
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [showEdit, setShowEdit] = useState(false);
  const [isReload, setIsReload] = useState(false);

  // get name property rules
  const getName = (id) => {
    var find = dataIllnesses.find((item) => item._id === id);
    return find?.name ? find?.name : "";
  };
  // ===

  // get string symptom
  const stringSymptom = (symptom) => {
    var listName = symptom.map((item) => getName(item));
    return listName.join(" ^ ");
  };
  // ===

  // get symptom by rule
  const [optionsSymptoms, setOptionsSymptoms] = useState([]);
  const appendOptionsSymptoms = () => {
    const requestOptions = {
      method: "GET",
      url: urlAPI + `/illnesses?type=symptom&rule=both`,
    };

    axios(requestOptions)
      .then((res) => {
        const data = res.data;
        setOptionsSymptoms(data.results);
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  useEffect(() => {
    appendOptionsSymptoms();
  }, []);
  // ===

  // get rules
  // -get item rules
  const [ruleSelect, setRuleSelect] = useState();
  const handleGetItem = (item) => {
    setRuleSelect(item);
    formEdit.setFieldValue("symptoms", item.symptoms);
    formEdit.setFieldValue("illness", item.illnesses_id);
    setShowEdit(true);
  };

  // -update rules
  const handelUpdateIllness = (values) => {
    if (ruleSelect) {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        url: urlAPI + `/rules/${ruleSelect._id}`,
        data: JSON.stringify({
          symptoms: values.symptoms,
          illnesses_id: values.illness,
        }),
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
      url: urlAPI + `/rules/${id}`,
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

  // insert rules
  const handleAddRules = (values) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      url: urlAPI + `/rules`,
      data: JSON.stringify({
        symptoms: values.symptoms,
        illnesses_id: values.illness,
      }),
    };

    axios(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          message.success(data.msg);
          formAdd.setFieldValue("illness", []);
          formAdd.setFieldValue("symptoms", []);
          setIsReload(!isReload);
        } else {
          message.warning(data.msg);
        }
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  // -get all rules
  const [dataRules, setDataRules] = useState();
  const appendData = () => {
    const requestOptions = {
      method: "GET",
      url: urlAPI + `/rules`,
    };

    axios(requestOptions)
      .then((res) => {
        const data = res.data;
        setDataRules(data.results);
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  useEffect(() => {
    appendData();
  }, [isReload]);
  // ===

  // config select symptom
  const [selectSymptom, setSelectSymptom] = useState([]);

  const selectProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    value: selectSymptom,
    onChange: (newValue) => {
      setSelectSymptom(newValue);
    },
    placeholder: "Chọn triệu chứng...",
    // maxTagCount: "responsive",
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

  // -get all illness
  const [dataIllnesses, setDataIllnesses] = useState([]);
  const appendDataIllness = () => {
    const requestOptions = {
      method: "GET",
      url: urlAPI + `/illnesses`,
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
    appendDataIllness();
  }, []);

  // -get illness by rule
  const [optionsIllness, setOptionsIllness] = useState([]);
  const appendOptionsIllness = () => {
    const requestOptions = {
      method: "GET",
      url: urlAPI + `/illnesses?type=illness&rule=both`,
    };

    axios(requestOptions)
      .then((res) => {
        const data = res.data;
        setOptionsIllness(data.results);
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  useEffect(() => {
    appendOptionsIllness();
  }, []);
  // ===

  // config select illnesses
  const [selectIllnesses, setSelectIllnesses] = useState([]);

  const selectPropsIllness = {
    style: {
      width: "100%",
    },
    value: selectIllnesses,
    onChange: (newValue) => {
      setSelectIllnesses(newValue);
    },
    placeholder: "Chọn bệnh...",
    // maxTagCount: "responsive",
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
      <Typography.Title level={4}>Quản lý danh sách luật</Typography.Title>
      <div className="md:flex">
        <div className="flex-1 p-2">
          <Card>
            <Typography.Title level={5}>Danh sách</Typography.Title>
            <div className="h-[65vh] overflow-y-auto scrollbar p-3">
              {dataRules !== undefined ? (
                dataRules.length ? (
                  <List>
                    {dataRules.map((item) => (
                      <List.Item key={item._id}>
                        <List.Item.Meta
                          title={
                            <div className="md:flex justify-between">
                              <div className="mb-4">
                                <AlertOutlined className="mr-2" />
                                {stringSymptom(item.symptoms)}
                                {" => "} {getName(item.illnesses_id)}
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
              title="Sửa luật"
              open={showEdit}
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
                  name="symptoms"
                  label="Lựa chọn triệu chứng"
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
                    {optionsSymptoms.map((item) => (
                      <Option key={item._id} value={item._id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Không được để trống",
                    },
                  ]}
                  name="illness"
                  label="Lựa chọn bệnh"
                >
                  <Select
                    {...selectPropsIllness}
                    showSearch
                    optionFilterProp="children"
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {optionsIllness.map((item) => (
                      <Option key={item._id} value={item._id}>
                        {item.name}
                      </Option>
                    ))}
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
              <Form
                form={formAdd}
                wrapperCol={{ offset: 1 }}
                onFinish={handleAddRules}
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Không được để trống",
                    },
                  ]}
                  name="symptoms"
                  label="Lựa chọn triệu chứng"
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
                    {optionsSymptoms.map((item) => (
                      <Option key={item._id} value={item._id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Không được để trống",
                    },
                  ]}
                  name="illness"
                  label="Lựa chọn bệnh"
                >
                  <Select
                    {...selectPropsIllness}
                    showSearch
                    optionFilterProp="children"
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {optionsIllness.map((item) => (
                      <Option key={item._id} value={item._id}>
                        {item.name}
                      </Option>
                    ))}
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

export default Rules;
