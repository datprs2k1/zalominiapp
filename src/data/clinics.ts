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
  summerHours?: string;
  winterHours?: string;
}

export const clinics: Clinic[] = [
  {
    id: 'cam-khe',
    name: 'Bệnh viện đa khoa Hòa Bình – Hải Phòng',
    address: 'Phố Phạm Xuân Huân, khu đô thị mới phía đông, Phường Tân Hưng, Thành phố Hải Phòng',
    phone: '0976.091.115',
    facebookUrl: '#',
    zaloUrl: '#',
    emailUrl: 'bvhoabinh.cskh@gmail.com',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18m12!1m3!1d3724.123456789!25123456!3d21.123456!2m3!1!2f0!3f0!3m2!1i1024!2i768!4f13.11!1s0x3135ef12345A0xabcdef1234567890!2zUGjhu5FuZyBraOG620ZOG6WsgVGhp4buHbiDEkOG7WMg4buRYyBD4bqnbSBLaMOq!5!3m2svi!2s!4v171000000!5m2!1svi!2s',
    type: 'general',
    isMain: true,
    summerHours: 'Sáng 07:00 - 11:30, chiều 13:30-17:00',
    winterHours: 'Sáng 07:00 - 11:30, chiều 13:00-16:30',
  },
];

export const getClinicsByType = (type: 'general' | 'dental') => {
  return clinics.filter((clinic) => clinic.type === type);
};

export const getMainClinics = () => {
  return clinics.filter((clinic) => clinic.isMain);
};
