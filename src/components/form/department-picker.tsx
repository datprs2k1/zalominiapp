import { departmentsAtom, getDepartments, getPosts, postsAtomFamily } from '@/services/post';
import { Department } from '@/types';
import { decodeHTML } from '@/utils/decodeHTML';
import { useAtomValue } from 'jotai';
import { Select } from 'zmp-ui';
import { SelectProps } from 'zmp-ui/select';

const { Option, OtpGroup } = Select;

interface DepartmentPickerProps extends Omit<SelectProps, 'value' | 'onChange'> {
  value?: Department;
  onChange?: (value: Department) => void;
}

const POST_ATOM_PARAMS = { per_page: 100 };

function DepartmentPicker({ value, onChange, ...props }: DepartmentPickerProps) {
  // const groups = useAtomValue(departmentGroupsState); // Không cần nữa
  const departmentsData: any = useAtomValue(departmentsAtom(POST_ATOM_PARAMS));
  const departments = departmentsData || [];

  return (
    <Select
      closeOnSelect
      value={value?.id?.toString()}
      onChange={(selectedId) => {
        const dep = departments.find((dep) => dep.id === Number(selectedId));
        if (dep) {
          onChange?.(dep);
        }
      }}
      {...props}
    >
      {departments.map((dep) => (
        <Option key={dep.id} value={dep.id.toString()} title={decodeHTML(dep.title.rendered)} />
      ))}
    </Select>
  );
}

export default DepartmentPicker;
