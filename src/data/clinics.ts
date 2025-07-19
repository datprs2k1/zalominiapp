export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  facebookUrl?: string;
  zaloUrl?: string;
  emailUrl?: string;
  mapEmbedUrl?: string;
  type: 'general' | 'dental';
  isMain?: boolean;
}

export const clinics: Clinic[] = [
  {
    id: 'cam-khe',
    name: 'PHÒNG KHÁM ĐA KHOA TÂM THIỆN ĐỨC – CẨM KHÊ',
    address: 'Số 158 đường Đông Phú – xã Cẩm Khê – tỉnh Phú Thọ',
    phone: '0868.115666',
    facebookUrl: '#',
    zaloUrl: '#',
    emailUrl: '#',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18m12!1m3!1d3724.123456789!25123456!3d21.123456!2m3!1!2f0!3f0!3m2!1i1024!2i768!4f13.11!1s0x3135ef12345A0xabcdef1234567890!2zUGjhu5FuZyBraOG620ZOG6WsgVGhp4buHbiDEkOG7WMg4buRYyBD4bqnbSBLaMOq!5!3m2svi!2s!4v171000000!5m2!1svi!2s',
    type: 'general',
    isMain: true,
  },
  {
    id: 'tam-nong',
    name: 'PHÒNG KHÁM ĐA KHOA TÂM THIỆN ĐỨC – TAM NÔNG',
    address: 'Số 119 khu 22 xã Vạn Xuân – tỉnh Phú Thọ.',
    phone: '0979.027258',
    facebookUrl: '#',
    zaloUrl: '#',
    emailUrl: '#',
    type: 'general',
    isMain: true,
  },
  {
    id: 'nha-khoa-hoang-anh',
    name: 'NHA KHOA HOÀNG ANH',
    address: 'SN 9 – Khu 24– xã Vạn Xuân – tỉnh Phú Thọ ( Đối diện Trung tâm y tế huyện Tam Nông )',
    phone: '0976.153973',
    facebookUrl: '#',
    zaloUrl: '#',
    emailUrl: '#',
    type: 'dental',
  },
  {
    id: 'nha-khoa-quoc-te',
    name: 'NHA KHOA QUỐC TẾ',
    address: 'Số 348 Lạc Long Quân, khu 10- xã Hạ Hoà – tỉnh Phú Thọ (gần siêu thị Winmart)',
    phone: '0399.324565',
    facebookUrl: '#',
    zaloUrl: '#',
    emailUrl: '#',
    type: 'dental',
  },
  {
    id: 'nha-khoa-quoc-te-cam-khe',
    name: 'NHA KHOA QUỐC TẾ – CẨM KHÊ',
    address: 'Số nhà 162 đường Hoa Khê – xã Cẩm Khê – tỉnh Phú Thọ ( đối diện bệnh viện Cẩm Khê )',
    phone: '0901.786686',
    facebookUrl: '#',
    zaloUrl: '#',
    emailUrl: '#',
    type: 'dental',
  },
];

export const getClinicsByType = (type: 'general' | 'dental') => {
  return clinics.filter((clinic) => clinic.type === type);
};

export const getMainClinics = () => {
  return clinics.filter((clinic) => clinic.isMain);
};
