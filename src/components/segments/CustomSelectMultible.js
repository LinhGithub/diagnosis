import React, { useState, useEffect } from "react";

import { InboxOutlined, AlertOutlined, CheckOutlined } from "@ant-design/icons";
import { Typography, Button } from "antd";
import { Select, Space, List, message } from "antd";

import axiosApi from "../../configs/auth/axiosApi";

const { Paragraph } = Typography;
const { Option } = Select;

const IconButton = ({ type }) => {
  if (type === 1) {
    return <CheckOutlined />;
  }
  return "";
};

function CustomSelectMultible({
  ids,
  symptomAll,
  setSymptomAll,
  setCheckDiagnosis,
  setNumberSelect,
  reFreshSelect,
  setReFreshSelect,
}) {
  const [selectSymptom, setSelectSymptom] = useState([]);
  const [dataSymptoms, setDataSymptoms] = useState([]);
  const [symptomName, setSymptomName] = useState([]);
  const [checked, setChecked] = useState(false);
  const [checkEnd, setCheckEnd] = useState(true);
  const [isClick, setIsClick] = useState({
    left: 0,
    right: 0,
  });

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
      method: "POST",
      url: `illnesses/ids`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ list_ids: ids }),
    };

    axiosApi(requestOptions)
      .then((res) => {
        const data = res.data;
        if (data.code === 200) {
          if (data.results.length) {
            setDataSymptoms(data.results);
          } else {
            handleSelectMore(1);
          }
        }
      })
      .catch((error) => {
        message.error("Kết nối thất bại");
      });
  };

  useEffect(() => {
    appendData();
  }, [reFreshSelect]);
  // ===

  // refresh
  useEffect(() => {
    if (reFreshSelect) {
      setIsClick({
        left: 0,
        right: 0,
      });
      setCheckEnd(true);
      setChecked(false);
      setSymptomName([]);
      setSelectSymptom([]);
      setReFreshSelect(false);
    }
  }, [reFreshSelect]);

  // handle click more
  const handleSelectMore = (type) => {
    if (dataSymptoms.length) {
      setCheckEnd(true);
      if (type === 1) {
        if (symptomAll.length === 0 && selectSymptom.length === 0) {
          message.warning("Vui lòng chọn triệu chứng mà bạn đang mắc phải.");
        } else {
          setCheckDiagnosis(false);
          setIsClick((prev) => ({ ...prev, right: 1 }));
          setChecked(true);
        }
      } else {
        setNumberSelect((prev) => [...prev, prev.length + 1]);
        setIsClick((prev) => ({ ...prev, left: 1 }));
        setChecked(true);
      }
    } else {
      setCheckDiagnosis(false);
      setIsClick((prev) => ({ ...prev, right: 1 }));
      setCheckEnd(false);
      setChecked(true);
    }
    setSymptomAll((prev) => [...prev, ...selectSymptom]);
  };

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

  return checkEnd ? (
    <div className="mb-4">
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        <Select
          disabled={checked}
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
      <div className="mt-5">
        <div
          className="overflow-y-auto scrollbar p-4"
          id="scrollableDiv"
          style={{
            width: "100%",
          }}
        >
          <List>
            {symptomName.map((item, index) => (
              <List.Item key={item.name}>
                <List.Item.Meta
                  title={
                    <div>
                      <AlertOutlined className="mr-2" />
                      {index + 1}. {item.name}
                    </div>
                  }
                />
              </List.Item>
            ))}
          </List>
        </div>
      </div>
      <div className="text-center">
        {selectSymptom.length ? (
          <Button
            className="mr-2"
            type="primary"
            onClick={() => handleSelectMore(0)}
            disabled={checked}
          >
            <IconButton type={isClick.left}></IconButton>
            Chọn các triệu chứng liên quan
          </Button>
        ) : (
          <></>
        )}
        <Button disabled={checked} onClick={() => handleSelectMore(1)}>
          <IconButton type={isClick.right}></IconButton>
          Bỏ qua
        </Button>
      </div>
    </div>
  ) : (
    <div className="mb-4 text-center">
      <Paragraph level={5} className="text-center align-middle">
        Hệ thống tạm thời đã hết dữ liệu. Vui lòng chẩn đoán theo triệu chứng đã
        chọn từ trước.
      </Paragraph>
    </div>
  );
}

export default CustomSelectMultible;
