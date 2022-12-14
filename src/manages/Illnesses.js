import React, { useEffect, useState } from "react";
import { Typography, Button, Modal, Form, Input, Spin, Select } from "antd";
import { Space, Card, List, message, Popconfirm, Pagination } from "antd";
import { Col, Row } from "antd";

import {
  AlertOutlined,
  EditOutlined,
  DeleteOutlined,
  FrownOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import axiosApi from "../configs/auth/axiosApi";
import { urlAPI } from "../settings/Config";

const { Search } = Input;
const { Paragraph } = Typography;
// const { Meta } = Card;
const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

function Illnesses() {
  const token = localStorage.getItem("token");
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [showEdit, setShowEdit] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [nameSearch, setNameSearch] = useState("");

  // page
  const [totalItem, setTotalItem] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // get illness
  const [dataIllnesses, setDataIllnesses] = useState();

  // get illness select
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
        url: `illnesses/${illnessesSelect._id}`,
        headers: {
          "Content-Type": "application/json",
          x_authorization: token,
        },
        data: JSON.stringify(data_json),
      };

      axiosApi(requestOptions)
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
          message.error("K???t n???i th???t b???i");
        });
    } else {
      message.error("C?? l???i x???y ra");
    }
  };

  // -delete illness
  const handleDeleteItem = (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        x_authorization: token,
      },
      url: `illnesses/${id}`,
    };

    axiosApi(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          message.success(data.msg);
          if (Array.isArray(dataIllnesses) && dataIllnesses.length) {
            let len = dataIllnesses.length - 1;
            if (len === 0) {
              if (page === 1) {
                setIsReload(!isReload);
              } else {
                setPage(1);
              }
            } else {
              setIsReload(!isReload);
            }
          }
        } else {
          message.warning(data.msg);
        }
      })
      .catch((error) => {
        message.error("K???t n???i th???t b???i");
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
      url: `illnesses`,
      headers: {
        "Content-Type": "application/json",
        x_authorization: token,
      },
      data: JSON.stringify(data_json),
    };

    axiosApi(requestOptions)
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
        message.error("K???t n???i th???t b???i");
      });
  };

  // -get all illness
  const appendData = () => {
    const requestOptions = {
      method: "GET",
      url: `illnesses?type=illness&page=${page}&page_size=${pageSize}&name=${nameSearch}`,
    };

    axiosApi(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          setDataIllnesses(data.results);
          setTotalItem(data.total);
          if (page > 1 && data.results.length === 0) {
            setPage(1);
          }
        }
      })
      .catch((error) => {
        message.error("K???t n???i th???t b???i");
      });
  };

  useEffect(() => {
    appendData();
  }, [isReload, page, nameSearch]);
  // ===

  // config select rule
  const selectProps = {
    style: {
      width: "100%",
    },
    placeholder: "Ch???n lu???t",
    maxTagCount: "responsive",
    notFoundContent: (
      <div className="text-center">
        <InboxOutlined
          style={{
            fontSize: "54px",
          }}
        />
        <Paragraph>Kh??ng c?? k???t qu??? n??o</Paragraph>
      </div>
    ),
  };
  // ===

  const onSearch = (value) => setNameSearch(value);

  // dowload file
  const handleDowloadFile = () => {
    const requestOptions = {
      method: "GET",
      url: `illnesses/download_file?type=illness`,
    };

    axiosApi(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          let file_name = data.file_name;
          if (file_name) {
            window.location.href = urlAPI + "storage/" + file_name;
          } else {
            message.error("Kh??ng t???n t???i t???p.");
          }
        } else {
          message.error("Kh??ng t???n t???i t???p.");
        }
      })
      .catch((error) => {
        message.error("K???t n???i th???t b???i");
      });
  };

  return (
    <div>
      <Typography.Title level={4}>Qu???n l?? danh s??ch b???nh</Typography.Title>
      <div className="md:flex">
        <div className="flex-1 p-2">
          <Card className="">
            <Typography.Title level={5}>Th??m m???i</Typography.Title>
            <div>
              <Form {...layout} form={formAdd} onFinish={handleAddIllness}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                  name="name"
                  label="T??n b???nh"
                >
                  <Input placeholder="Nh???p t??n b???nh" />
                </Form.Item>

                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                  name="rule"
                  label="Lu???t"
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
                    <Option value="only">Ch??? l?? b???nh</Option>
                    <Option value="both">V???a l?? b???nh v???a l?? tri???u ch???ng</Option>
                  </Select>
                </Form.Item>

                <Form.Item className="md:flex justify-end">
                  <Button type="primary" htmlType="submit">
                    Th??m
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
        <div className="flex-1 p-2">
          <Card>
            <Row>
              <Col span={12}>
                <Typography.Title level={5}>Danh s??ch</Typography.Title>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={3} offset={6}>
                    <Button type="dashed">Th??m t???p</Button>
                  </Col>
                  <Col span={3} offset={6}>
                    <Button onClick={handleDowloadFile}>Xu???t t???p</Button>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Search
              className="my-6 px-10"
              allowClear
              placeholder="T??m ki???m..."
              onSearch={onSearch}
              enterButton
            />
            <div className="h-[55vh] overflow-y-auto scrollbar p-3">
              {dataIllnesses !== undefined ? (
                dataIllnesses.length ? (
                  <div>
                    <List>
                      {dataIllnesses.map((item, index) => (
                        <List.Item key={item._id}>
                          <List.Item.Meta
                            title={
                              <div className="md:flex justify-between">
                                <div className="mb-4">
                                  <AlertOutlined className="mr-2" />
                                  {index + 1}. {item.name}
                                </div>
                                <Space>
                                  <Button
                                    shape="circle"
                                    icon={<EditOutlined />}
                                    onClick={() => handleGetItem(item)}
                                  />

                                  <Popconfirm
                                    placement="top"
                                    title="B???n c?? ch???c ch???n mu???n x??a?"
                                    onConfirm={() => handleDeleteItem(item._id)}
                                    okText="?????ng ??"
                                    cancelText="Kh??ng"
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
                    <div className="absolute bottom-0 left-0 right-0 mb-2 text-center">
                      <Pagination
                        simple={true}
                        total={totalItem}
                        defaultPageSize={pageSize}
                        onChange={(pageNumber) => setPage(pageNumber)}
                        defaultCurrent={1}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-5">
                    <Paragraph>Kh??ng c?? d??? li???u n??o</Paragraph>
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
              title="S???a b???nh"
              visible={showEdit}
              onOk={() => setShowEdit(false)}
              onCancel={() => setShowEdit(false)}
              footer={null}
              forceRender
            >
              <Form {...layout} form={formEdit} onFinish={handelUpdateIllness}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                  name="name"
                  label="T??n b???nh"
                >
                  <Input placeholder="Nh???p t??n b???nh" />
                </Form.Item>

                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                  name="rule"
                  label="Lu???t"
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
                    <Option value="only">Ch??? l?? b???nh</Option>
                    <Option value="both">V???a l?? b???nh v???a l?? tri???u ch???ng</Option>
                  </Select>
                </Form.Item>

                <Form.Item className="md:flex justify-end">
                  <Space>
                    <Button key="back" onClick={() => setShowEdit(false)}>
                      ????ng
                    </Button>

                    <Button key="submit" type="primary" htmlType="submit">
                      C???p nh???t
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Illnesses;
