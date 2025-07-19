import CallIcon from '@/components/icons/call';
import ShipIcon from '@/components/icons/ship';
import RemoteDiagnosisItem from '@/components/remote-diagnosis-item';
import Section from '@/components/section';

export default function RemoteDiagnosis() {
  return (
    <Section className="pt-3" title="Dịch vụ khẩn cấp" isCard>
      <div className="grid grid-cols-2 gap-3">
        <RemoteDiagnosisItem icon={<CallIcon />} title="Cấp cứu" subtitle="BS gọi lại" />
        <RemoteDiagnosisItem icon={<ShipIcon />} title="Giao thuốc" subtitle="Tận nhà" />
      </div>
    </Section>
  );
}
