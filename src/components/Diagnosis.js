import React, { useState, useEffect } from "react";

import { InboxOutlined, AlertOutlined } from "@ant-design/icons";
import { Typography, Button } from "antd";
import { Select, Space, Card, Avatar, List, message, Spin } from "antd";
import myLogo from "../assets/images/unnamed.png";

import axios from "axios";

import { urlAPI } from "../material/Config";

const { Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;

const listFeedback = {
  0: "Chúc mừng bạn, bạn chỉ có những triệu chứng đó thôi.",
  1: "Thật may, những triệu chứng của bạn không đang lo ngại. Hãy chăm sóc bản thân thật tốt.",
  2: "Triệu chứng của bạn chưa đủ để chẩn đoán, hoặc bạn chỉ có những dấu hiệu làm nền lên bệnh. Hãy chăm sóc bản thân nhiều hơn.",
  3: "Bạn đang rất lo lắng với những triệu chứng mà bạn đang gặp phải. Đừng lo đó chỉ là nhưng dấu hiệu nhỏ, hãy để ý bản thân nhiều hơn",
};

const Diagnosis = () => {
  const [selectSymptom, setSelectSymptom] = useState([]);
  const [dataSymptoms, setDataSymptoms] = useState([]);
  const [illnesses, setIllnesses] = useState();
  const [symptomName, setSymptomName] = useState([]);
  const [processStatus, setProcessStatus] = useState(true);

  // random feedback
  const RandomFeeback = () => {
    var number = Math.floor(Math.random() * 10);
    if (number >= 4) {
      number = 3;
    }
    return listFeedback[number];
  };
  // ===

  // get name symptom
  useEffect(() => {
    var symptomNameNew = dataSymptoms.filter((item) =>
      selectSymptom.includes(item._id)
    );
    setSymptomName(symptomNameNew);
  }, [selectSymptom, dataSymptoms]);
  // ===

  // get symptom
  const appendData = () => {
    const requestOptions = {
      method: "GET",
      url: urlAPI + `/illnesses?type=symptom&rule=both`,
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
  }, []);
  // ===

  // handle diagnosis
  const handleDiagnosis = () => {
    onChange(false);
    setProcessStatus(false);
    if (selectSymptom.length) {
      enterLoading(0);
      const requestOptions = {
        method: "POST",
        url: urlAPI + `/diagnosis`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ symptoms: selectSymptom }),
      };
      axios(requestOptions)
        .then((res) => {
          const data = res.data;
          setTimeout(() => {
            setIllnesses(data.results);
            setProcessStatus(true);
          }, 3000);
        })
        .catch((error) => {
          message.error("Kết nối thất bại");
          setProcessStatus(true);
        });
    } else {
      message.warning("Vui lòng chọn triệu chứng mà bạn đang mắc phải.");
    }
  };
  // ===

  // loading button
  const [loadings, setLoadings] = useState([]);
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    onChange(false);

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      onChange(true);
    }, 3000);
  };
  // ===

  // loading card
  const [loading, setLoading] = useState(true);

  const onChange = (checked) => {
    setLoading(!checked);
  };
  // ===

  const selectProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    value: selectSymptom,
    onChange: (newValue) => {
      onChange(false);
      setSelectSymptom(newValue);
    },
    placeholder: "Chọn triệu chứng...",
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

  return (
    <div>
      <Typography.Title level={4}>Chẩn đoán bệnh</Typography.Title>
      <div className="md:flex flex-wrap">
        <div className="flex-1 p-2" span={12}>
          <Card className="mt-2" style={{ minHeight: "70vh" }}>
            <div>
              <Typography.Title level={5}>Triệu chứng</Typography.Title>
              <Space
                direction="vertical"
                style={{
                  width: "100%",
                }}
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
                  {dataSymptoms.map((item) => (
                    <Option key={item._id} value={item._id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Space>
            </div>
            <div className="mt-5">
              <div
                className="overflow-y-auto scrollbar p-4"
                id="scrollableDiv"
                style={{
                  height: 350,
                  width: "100%",
                }}
              >
                <List>
                  {symptomName.map((item) => (
                    <List.Item key={item.name}>
                      <List.Item.Meta
                        title={
                          <div>
                            <AlertOutlined className="mr-2" />
                            {item.name}
                          </div>
                        }
                      />
                    </List.Item>
                  ))}
                </List>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex-1 p-2" span={12}>
          <Card className="mt-2" style={{ minHeight: "70vh" }}>
            <div className="text-center" span={24}>
              <Button
                type="primary"
                onClick={() => handleDiagnosis()}
                loading={loadings[0]}
                disabled={selectSymptom.length ? false : true}
              >
                Chẩn đoán bệnh
              </Button>
            </div>
            <div span={24}>
              <Card
                style={{
                  width: "100%",
                  marginTop: 16,
                }}
                // loading={loading}
              >
                <Meta avatar={<Avatar src={myLogo} />} title="Bác sĩ tư vấn" />
                {illnesses !== undefined ? (
                  <div className="mt-4">
                    {processStatus ? (
                      illnesses.length ? (
                        <div>
                          <Typography.Title level={5}>
                            Bạn có thể đang mắc các căn bệnh sau:
                          </Typography.Title>
                          {illnesses.map((item) => (
                            <Paragraph key={item._id}>{item.name}</Paragraph>
                          ))}
                        </div>
                      ) : !loading ? (
                        <div>
                          <Paragraph>
                            <RandomFeeback></RandomFeeback>
                          </Paragraph>
                        </div>
                      ) : (
                        <div>
                          <Paragraph>
                            Chọn triệu chứng bệnh của bạn, và nhấn vào nút
                            "Chuẩn đoán bệnh" để bác sĩ chuẩn đoán về bệnh của
                            bạn nhé!
                          </Paragraph>
                        </div>
                      )
                    ) : (
                      <div className="text-center mt-5">
                        <Spin size="large" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4">
                    <Paragraph>
                      Chọn triệu chứng bệnh của bạn, và nhấn vào nút "Chuẩn đoán
                      bệnh" để bác sĩ chuẩn đoán về bệnh của bạn nhé!
                    </Paragraph>
                  </div>
                )}
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
