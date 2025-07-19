import { userState } from '@/state';
import { User } from '@/types';

/**
 * Utility function to get user info with error handling
 */
export async function getUserInfo(): Promise<User> {
  try {
    // Note: This function should be used within a React component context
    // where userState can be properly accessed via useAtomValue
    throw new Error('getUserInfo should be used within a React component context');
  } catch (error) {
    console.error('Failed to get user info:', error);
    throw error;
  }
}

/**
 * Utility function to check if user has required permissions
 */
export function hasUserPermission(user: User, permission: string): boolean {
  // Add your permission logic here
  // For now, return true if user exists
  return !!user?.userInfo?.id;
}

/**
 * Utility function to format user display name
 */
export function formatUserName(user: User): string {
  if (!user?.userInfo?.name) {
    return 'Người dùng';
  }
  return user.userInfo.name;
}

/**
 * Utility function to get user avatar with fallback
 */
export function getUserAvatar(user: User, fallback?: string): string {
  if (!user?.userInfo?.avatar) {
    return fallback || '/default-avatar.png';
  }
  return user.userInfo.avatar;
}
