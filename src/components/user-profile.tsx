import { useAtomValue } from 'jotai';
import { userState } from '@/state';
import { useEffect, useState } from 'react';
import { User } from '@/types';

interface UserProfileProps {
  showAvatar?: boolean;
  showName?: boolean;
  className?: string;
}

export function UserProfile({ showAvatar = true, showName = true, className = '' }: UserProfileProps) {
  const userPromise = useAtomValue(userState);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await userPromise;
        console.log(userData);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải thông tin người dùng');
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userPromise]);

  if (loading) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {showAvatar && <div className="rounded-full h-10 w-10 bg-gray-200 animate-pulse" />}
        {showName && <div className="w-40 h-4 bg-gray-200 animate-pulse rounded" />}
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {showAvatar && (
          <div className="rounded-full h-10 w-10 bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-xs">!</span>
          </div>
        )}
        {showName && <div className="text-red-500 text-sm">Lỗi tải thông tin</div>}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showAvatar && (
        <img
          src={user.userInfo.avatar}
          alt={user.userInfo.name}
          className="rounded-full h-10 w-10 object-cover border border-white"
        />
      )}
      {showName && <div className="w-40 font-medium truncate">{user.userInfo.name}</div>}
    </div>
  );
}

export default UserProfile;
