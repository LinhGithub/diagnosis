import React from "react";
import { Typography, Card } from "antd";
import imageSick from "../assets/images/sick-kid.jpg";
import imageStrong from "../assets/images/cartoon-strong-brain-clipart.png";

const { Paragraph } = Typography;
const { Meta } = Card;

const Overview = () => {
  return (
    <div>
      <Typography.Title level={4}>Vấn đề</Typography.Title>
      <Paragraph>
        Hiện nay, có rất nhiều người ngại đi khám bệnh để phát hiện ra những căn
        bệnh mà mình đang mắc phải nên việc phát hiện sớm căn bệnh để sớm chữa
        trị thật là khó.
      </Paragraph>
      <Typography.Title level={4}>Gải pháp</Typography.Title>
      <Paragraph>
        Vì vậy, để giải pháp vẫn đề nhức nhối ở trên. Website "Ứng dụng chẩn
        đoán bệnh" được làm ra để thuận tiện cho việc phát hiện bệnh dễ dàng hơn
        mà không cần đến bệnh viện vừa đông, vừa lâu.
      </Paragraph>
      <div className="flex flex-wrap justify-around mt-10">
        <div className="mb-5">
          <Card
            hoverable
            style={{
              width: 240,
            }}
            cover={<img alt="example" src={imageSick} />}
          >
            <Meta title="Bị bệnh" description="Khi hệ miến dịch kém" />
          </Card>
        </div>
        <div className="mb-5">
          <Card
            hoverable
            style={{
              width: 240,
            }}
            cover={<img alt="example" src={imageStrong} />}
          >
            <Meta title="Khỏe mạnh" description="Khi hệ miễn dịch tốt" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;
