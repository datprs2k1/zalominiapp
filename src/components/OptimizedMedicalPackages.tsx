import React from 'react';

interface MedicalPackageProps {
  title: string;
  subtitle: string;
  features: string[];
  price: string;
  linkText?: string;
  linkUrl?: string;
}

const MedicalPackage: React.FC<MedicalPackageProps> = ({
  title,
  subtitle,
  features,
  price,
  linkText = 'Xem chi tiết',
  linkUrl = '#',
}) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-lg font-bold text-center mb-1">{title}</h3>
        <p className="text-center text-gray-600 mb-4">({subtitle})</p>

        <ul className="space-y-4 mb-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block rounded-full bg-blue-100 p-1 mr-2 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <p className="text-center text-xl font-bold text-red-500 mb-4">{price}</p>

        <div className="text-center">
          <a
            href={linkUrl}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
          >
            {linkText}
          </a>
        </div>
      </div>
    </article>
  );
};

export const OptimizedMedicalPackages: React.FC = () => {
  const packages: MedicalPackageProps[] = [
    {
      title: 'Gói khám nhi',
      subtitle: 'Trẻ dưới 6 tuổi',
      features: [
        'Đánh giá toàn diện thể trạng và bệnh lý trẻ em. Tư vấn khẩu phần ăn và sự phát triển của chiều cao, cân nặng',
        'Phát hiện sớm viêm mũi xoang, viêm amidan, nghe kém,...',
        'Phát hiện các bất thường ổ bụng',
      ],
      price: 'Chỉ từ 438.000đ',
      linkUrl: '/goi-kham-nhi',
    },
    {
      title: 'Khám học đường',
      subtitle: 'Cho trẻ 6 – 12 tuổi',
      features: [
        'Đánh giá toàn diện thể trạng và bệnh lý trẻ em. Sự phát triển khẩu phần ăn và tư vấn cải thiện chiều cao, cân nặng',
        'Phát hiện sớm viêm mũi xoang, viêm amidan, nghe kém,...',
        'Kiểm tra gan, mật, lách tụy,... và sự bất thường của nội tạng',
      ],
      price: 'Chỉ từ 438.000đ',
      linkUrl: '/kham-hoc-duong',
    },
    {
      title: 'Khám dậy thì sớm',
      subtitle: 'Bất thường về nội tiết tố',
      features: [
        'Đánh giá dậy thì sớm và sự phát triển thể chất chung của trẻ',
        'Định hướng chế độ ăn – hỗ trợ kiểm soát tăng trưởng và cân nặng phù hợp',
        'Phát hiện bất thường tuyến thượng thận, buồng trứng, tinh hoàn,... liên quan đến dậy thì sớm',
      ],
      price: 'Chỉ từ 722.000đ',
      linkUrl: '/kham-day-thi-som',
    },
  ];

  return (
    <section className="py-12 px-4 bg-blue-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">GÓI KHÁM NHI TỔNG QUÁT</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <MedicalPackage key={index} {...pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OptimizedMedicalPackages;
