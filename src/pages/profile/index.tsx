import ArrowRightIcon from '@/components/icons/arrow-right';
import { doctorsState } from '@/state';
import { useAtomValue } from 'jotai';
import prescription from '@/static/services/prescription.svg';
import calendar from '@/static/services/calendar.svg';
import clipboard from '@/static/services/clipboard.svg';
import heart from '@/static/services/heart.svg';
import Section from '@/components/section';
import { Action } from './action';
import { VisitedDoctor } from './visited-doctor';
import { Container, Card, Grid } from '@/components/ui';
import { cn } from '@/utils/cn';

function ProfilePage() {
  const [d1, d2] = useAtomValue(doctorsState);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Container maxWidth="md" padding="md">
        <Card className="mb-6">
          <Grid columns={3} gap="md">
            {[
              ['Điểm thưởng', 14],
              ['Phiếu giảm giá', 2],
              ['Buổi khám', 3],
            ].map(([key, value]) => (
              <div key={key} className="flex flex-col space-y-1.5 text-center">
                <div className="text-xl font-bold text-medical-600">{value}</div>
                <div className="text-neutral-500 text-medical-label">{key}</div>
              </div>
            ))}
          </Grid>
        </Card>
      </Container>
      <div className="flex-1 flex flex-col bg-white py-8 space-y-9 overflow-y-auto">
        <Container maxWidth="md" padding="md">
          <Section title="Dịch vụ y tế" spacing="md">
            <Grid columns={4} gap="md">
              {[
                { icon: prescription, label: 'Toa thuốc' },
                { icon: calendar, label: 'Lịch hẹn' },
                { icon: clipboard, label: 'Lịch sử' },
                { icon: heart, label: 'Gia đình' },
              ].map(({ icon, label }) => (
                <Card key={label} variant="hover" className="flex flex-col items-center gap-3 text-center p-4">
                  <div className="w-12 h-12 bg-medical-50 rounded-medical flex items-center justify-center">
                    <img src={icon} className="h-8 w-8" />
                  </div>
                  <div className="text-medical-label font-medium text-neutral-700">{label}</div>
                </Card>
              ))}
            </Grid>
          </Section>
          <Section title="Bác sĩ đã khám" spacing="md">
            <Grid columns={2} gap="md">
              <VisitedDoctor doctor={d1} />
              <VisitedDoctor doctor={d2} />
            </Grid>
          </Section>
          <Section title="Khác" spacing="md">
            <div className="space-y-2">
              <Action
                label="Hóa đơn của tôi"
                badge={3}
                icon={<ArrowRightIcon className="h-3.5 w-3.5" />}
                to="/invoices"
              />
              <Action label="Gửi phản ảnh dịch vụ" icon={<ArrowRightIcon className="h-3.5 w-3.5" />} to="/feedback" />
              <Action
                label="Thông tin bệnh viện"
                icon={<ArrowRightIcon className="h-3.5 w-3.5" />}
                to="/hospital-info"
              />
            </div>
          </Section>
        </Container>
      </div>
    </div>
  );
}

export default ProfilePage;
