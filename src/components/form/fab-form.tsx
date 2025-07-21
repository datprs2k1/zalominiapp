import { ReactNode, useState } from 'react';
import { Button, ButtonProps } from '../button';

interface FabFormProps {
  fab: ButtonProps | ButtonProps[];
  children: ReactNode;
  onSubmit?: () => Promise<void>;
}

function FabForm({ fab, children, onSubmit }: FabFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">{children}</div>

      {fab && (
        <div className="flex-none sticky bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-white/90 border-t border-gray-100 shadow-sm px-5 py-4 flex justify-end gap-3">
          {(Array.isArray(fab) ? fab : [fab]).map((fabProps, i) => (
            <Button
              key={i}
              type="submit"
              loading={isLoading}
              className={`${fabProps.className || ''} py-2.5 px-6 rounded-lg text-sm font-medium transition-all hover:shadow-md`}
              {...fabProps}
            />
          ))}
        </div>
      )}
    </form>
  );
}

export default FabForm;
