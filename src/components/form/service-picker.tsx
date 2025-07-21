import { servicesState } from '@/state';
import { Service } from '@/types';
import { useAtomValue } from 'jotai';
import { Select } from 'zmp-ui';
import { SelectProps } from 'zmp-ui/select';

const { Option } = Select;

interface ServicePickerProps extends Omit<SelectProps, 'value' | 'onChange'> {
  value?: Service;
  onChange?: (value: Service) => void;
}

function ServicePicker({ value, onChange, ...props }: ServicePickerProps) {
  const services = useAtomValue(servicesState);

  return (
    <Select
      closeOnSelect
      value={value?.id?.toString()}
      onChange={(selectedId) => {
        const service = services.find((service) => service.id === Number(selectedId));
        if (service) {
          onChange?.(service);
        }
      }}
      {...props}
    >
      {services.map((service) => (
        <Option key={service.id} value={service.id.toString()} title={service.name} />
      ))}
    </Select>
  );
}

export default ServicePicker;
