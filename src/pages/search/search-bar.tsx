import { Button } from '@/components/button';
import SearchIcon from '@/components/icons/search';
import { HTMLProps, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({
  className,
  loading,
  ...props
}: HTMLProps<HTMLInputElement> & { loading?: boolean }) {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  return (
    <form
      className={`flex items-center justify-between rounded-xl bg-white relative p-2 space-x-2 shadow-sm border ${isActive ? 'border-emerald-500' : 'border-gray-200'} ${className ?? ''}`}
      onSubmit={(e) => {
        e.preventDefault();
        const keyword = new FormData(e.currentTarget).get('keyword') as string;
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`, {
          viewTransition: true,
        });
      }}
    >
      <div className="relative flex-1">
        <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Tìm bệnh, bác sĩ, thuốc..."
          className="placeholder:text-gray-400 text-sm pl-10 pr-4 py-3 flex-1 rounded-xl self-stretch outline-none border-none bg-transparent focus:ring-0 w-full"
          required
          name="keyword"
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          {...props}
        />
      </div>
      <Button
        className="rounded-xl !w-auto h-[42px] [&_.spinner]:w-4 [&_.spinner]:h-4 px-5 text-center text-sm text-white font-medium bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-sm"
        loading={loading}
        type="submit"
      >
        Tìm
      </Button>
    </form>
  );
}
