import React, { useEffect, useState } from "react";
import { Typography, Button, Modal, Form, Spin, Input } from "antd";
import { Col, Row } from "antd";

import { urlAPI } from "../settings/Config";

import {
  Space,
  Card,
  List,
  message,
  Popconfirm,
  Select,
  Pagination,
} from "antd";
import {
  AlertOutlined,
  EditOutlined,
  DeleteOutlined,
  FrownOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import axiosApi from "../configs/auth/axiosApi";

const { Paragraph } = Typography;
// const { Meta } = Card;
const { Search } = Input;

const { Option } = Select;

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};

function Rules() {
  const token = localStorage.getItem("token");
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [showEdit, setShowEdit] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [dataRules, setDataRules] = useState();
  const [nameSearch, setNameSearch] = useState("");

  // page
  const [totalItem, setTotalItem] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // get name property rules
  const getName = (id) => {
    var find = dataIllnesses.find((item) => item._id === id);
    return find?.name ? find?.name : "";
  };

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
      url: `illnesses?type=symptom&rule=both`,
    };

    axiosApi(requestOptions)
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
        headers: {
          "Content-Type": "application/json",
          x_authorization: token,
        },
        url: `rules/${ruleSelect._id}`,
        data: JSON.stringify({
          symptoms: values.symptoms,
          illnesses_id: values.illness,
        }),
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
      headers: {
        "Content-Type": "application/json",
        x_authorization: token,
      },
      url: `rules/${id}`,
    };

    axiosApi(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          message.success(data.msg);
          if (Array.isArray(dataRules) && dataRules.length) {
            let len = dataRules.length - 1;
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
        message.error("Kết nối thất bại");
      });
  };

  // insert rules
  const handleAddRules = (values) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        x_authorization: token,
      },
      url: `rules`,
      data: JSON.stringify({
        symptoms: values.symptoms,
        illnesses_id: values.illness,
      }),
    };

    axiosApi(requestOptions)
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

  const appendData = () => {
    const requestOptions = {
      method: "GET",
      url: `rules?page=${page}&page_size=${pageSize}&name=${nameSearch}`,
    };

    axiosApi(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          setDataRules(data.results);
          setTotalItem(data.total);
          if (page > 1 && data.results.length === 0) {
            setPage(1);
          }
        }
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  useEffect(() => {
    appendData();
  }, [isReload, page, nameSearch]);
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
      url: `illnesses`,
    };

    axiosApi(requestOptions)
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
      url: `illnesses?type=illness&rule=both`,
    };

    axiosApi(requestOptions)
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

  // search
  const onSearch = (value) => setNameSearch(value);

  // dowload file
  const handleDowloadFile = () => {
    const requestOptions = {
      method: "GET",
      url: `illnesses/download_file?type=rule`,
    };

    axiosApi(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          let file_name = data.file_name;
          if (file_name) {
            window.location.href = urlAPI + "storage/" + file_name;
          } else {
            message.error("Không tồn tại tệp.");
          }
        } else {
          message.error("Không tồn tại tệp.");
        }
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  return (
    <div>
      <Typography.Title level={4}>Quản lý danh sách luật</Typography.Title>
      <div className="md:flex">
        <div className="flex-1 p-2">
          <Card className="">
            <Typography.Title level={5}>Thêm mới</Typography.Title>
            <div>
              <Form
                {...layout}
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
        <div className="flex-1 p-2">
          <Card>
            <Row>
              <Col span={12}>
                <Typography.Title level={5}>Danh sách</Typography.Title>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={3} offset={6}>
                    <Button type="dashed">Thêm tệp</Button>
                  </Col>
                  <Col span={3} offset={6}>
                    <Button onClick={handleDowloadFile}>Xuất tệp</Button>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Search
              className="my-6 px-10"
              allowClear
              placeholder="Tìm kiếm..."
              onSearch={onSearch}
              enterButton
            />
            <div className="h-[55vh] overflow-y-auto scrollbar p-3">
              {dataRules !== undefined ? (
                dataRules.length ? (
                  <div>
                    <List>
                      {dataRules.map((item, index) => (
                        <List.Item key={item._id}>
                          <List.Item.Meta
                            title={
                              <div className="md:flex justify-between">
                                <div className="mb-4">
                                  <AlertOutlined className="mr-2" />
                                  {index + 1}. {stringSymptom(item.symptoms)}
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
              visible={showEdit}
              onOk={() => setShowEdit(false)}
              onCancel={() => setShowEdit(false)}
              footer={null}
              width={600}
              forceRender
            >
              <Form {...layout} form={formEdit} onFinish={handelUpdateIllness}>
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
      </div>
    </div>
  );
}

export default Rules;
