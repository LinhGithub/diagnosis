import React, { useState } from "react";

import { SwapRightOutlined, ReloadOutlined } from "@ant-design/icons";
import { Typography, Button } from "antd";
import { Card, Avatar, message, Spin } from "antd";
import myLogo from "../assets/images/unnamed.png";

import axiosApi from "../configs/auth/axiosApi";

import CustomSelectMultible from "./segments/CustomSelectMultible";

const { Paragraph } = Typography;
const { Meta } = Card;

const listFeedback = {
  0: "Đó chỉ là những triệu chứng bình thường. Hãy chăm sóc bản thân nhiều hơn.",
  1: "Thật may, những triệu chứng của bạn không đang lo ngại. Hãy chăm sóc bản thân thật tốt.",
  2: "Triệu chứng của bạn chưa đủ để chẩn đoán. Hãy chăm sóc bản thân nhiều hơn.",
  3: "Bạn đang rất lo lắng với những triệu chứng mà bạn đang gặp phải. Đừng lo đó chỉ là nhưng dấu hiệu nhỏ, hãy để ý bản thân nhiều hơn",
};

const Diagnosis = () => {
  const [illnesses, setIllnesses] = useState();
  const [processStatus, setProcessStatus] = useState(true);
  const [symptomAll, setSymptomAll] = useState([]);
  const [checkDiagnosis, setCheckDiagnosis] = useState(true);
  const [numberSelect, setNumberSelect] = useState([1]);
  const [reFreshSelect, setReFreshSelect] = useState(false);

  // random feedback
  const RandomFeeback = () => {
    var number = Math.floor(Math.random() * 10);
    if (number >= 4) {
      number = 3;
    }
    return listFeedback[number];
  };
  // ===

  // handle diagnosis
  const handleDiagnosis = () => {
    if (symptomAll.length) {
      onChange(false);
      setProcessStatus(false);
      enterLoading(0);
      const requestOptions = {
        method: "POST",
        url: `diagnosis`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ symptoms: symptomAll }),
      };
      axiosApi(requestOptions)
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

  // refresh
  const handleRefresh = () => {
    setCheckDiagnosis(true);
    setIllnesses();
    setSymptomAll([]);
    setNumberSelect([1]);
    setReFreshSelect(true);
  };

  return (
    <div>
      <Typography.Title level={4}>Chẩn đoán bệnh</Typography.Title>
      <div className="md:flex flex-wrap">
        <div className="flex-1 p-2" span={12}>
          <Card className="mt-2" style={{ minHeight: "70vh" }}>
            <Typography.Title level={5}>Triệu chứng</Typography.Title>
            {numberSelect.map((item, index) => (
              <div key={item}>
                <CustomSelectMultible
                  ids={symptomAll}
                  symptomAll={symptomAll}
                  setSymptomAll={setSymptomAll}
                  setCheckDiagnosis={setCheckDiagnosis}
                  setNumberSelect={setNumberSelect}
                  reFreshSelect={reFreshSelect}
                  setReFreshSelect={setReFreshSelect}
                ></CustomSelectMultible>
                {index < numberSelect.length - 1 ? (
                  <Paragraph level={5} className="text-center align-middle">
                    <SwapRightOutlined /> Chọn thêm các triệu chứng liên quan:
                  </Paragraph>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </Card>
        </div>
        <div className="flex-1 p-2" span={12}>
          <Card className="mt-2" style={{ minHeight: "70vh" }}>
            <div className="text-center" span={24}>
              <Button
                type="primary"
                onClick={() => handleDiagnosis()}
                loading={loadings[0]}
                disabled={checkDiagnosis}
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
                          {illnesses.map((item, index) => (
                            <Paragraph key={item._id}>
                              {index + 1}. {item.name}
                            </Paragraph>
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
                            Chọn triệu chứng bệnh của bạn, và nhấn vào nút "Chẩn
                            đoán bệnh" để bác sĩ chuẩn đoán về bệnh của bạn nhé!
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

            <div className="text-center mt-5" span={24}>
              <Button type="primary" onClick={() => handleRefresh()}>
                <ReloadOutlined /> Làm mới
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
