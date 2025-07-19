# User State Management Guide

This guide explains how to use the `userState` in your Zalo Mini App application.

## Overview

The `userState` is a Jotai atom that manages user information fetched from the Zalo Mini App SDK. It provides access to user data like name, avatar, and other profile information.

## Basic Usage

### 1. Import the userState

```typescript
import { userState } from '@/state';
import { useAtomValue } from 'jotai';
```

### 2. Use in a component

```typescript
function MyComponent() {
  const userPromise = useAtomValue(userState);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await userPromise;
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userPromise]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <p>Welcome, {user.userInfo.name}!</p>
      <img src={user.userInfo.avatar} alt="Avatar" />
    </div>
  );
}
```

## Using the UserProfile Component

For a pre-built component with loading and error states:

```typescript
import UserProfile from '@/components/user-profile';

function MyComponent() {
  return (
    <div>
      <h1>User Profile</h1>
      <UserProfile showAvatar={true} showName={true} />
    </div>
  );
}
```

## Utility Functions

### Format User Name

```typescript
import { formatUserName } from '@/utils/user';

const displayName = formatUserName(user); // Returns "Người dùng" if no name
```

### Get User Avatar with Fallback

```typescript
import { getUserAvatar } from '@/utils/user';

const avatarUrl = getUserAvatar(user, '/default-avatar.png');
```

### Check User Permissions

```typescript
import { hasUserPermission } from '@/utils/user';

const canRead = hasUserPermission(user, 'read');
```

## Error Handling

The `userState` automatically handles errors from the Zalo SDK. If the user denies permission to access their information, it will throw a `NotifiableError` with a user-friendly message.

```typescript
try {
  const user = await userPromise;
  // Use user data
} catch (error) {
  if (error instanceof NotifiableError) {
    // Show user-friendly error message
    toast.error(error.message);
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
}
```

## Refreshing User Data

To refresh user data (useful after profile updates):

```typescript
import { useSetAtom } from 'jotai';

function MyComponent() {
  const refreshUser = useSetAtom(userState);

  const handleRefresh = () => {
    refreshUser();
  };

  return (
    <button onClick={handleRefresh}>
      Refresh User Data
    </button>
  );
}
```

## Type Definitions

The user data structure is defined in `src/types.d.ts`:

```typescript
export interface User {
  userInfo: {
    name: string;
    avatar: string;
    id?: string;
    phone?: string;
  };
}
```

## Examples

See `src/examples/user-state-usage.tsx` for comprehensive examples of:

- Basic usage
- Using the UserProfile component
- Conditional rendering
- Refreshing user data
- Using user data in forms

## Best Practices

1. **Always handle loading states**: The userState returns a Promise, so always handle the loading state.

2. **Provide fallbacks**: Use utility functions like `formatUserName` and `getUserAvatar` to provide fallback values.

3. **Handle errors gracefully**: Catch and handle errors appropriately, especially permission denials.

4. **Use the UserProfile component**: For consistent UI, use the pre-built UserProfile component.

5. **Refresh when needed**: Use the refresh functionality when user data might have changed.

## Troubleshooting

### Common Issues

1. **Permission denied**: Make sure the user has granted permission to access their profile information.

2. **Loading forever**: Check if there's an error in the console and handle it appropriately.

3. **Type errors**: Make sure you're using the correct TypeScript types from `@/types`.

### Debug Tips

1. Check the browser console for error messages
2. Verify that the Zalo SDK is properly initialized
3. Test with different user permission scenarios
4. Use the error boundary component to catch and display errors

## Related Files

- `src/state.ts` - Main state definition
- `src/types.d.ts` - Type definitions
- `src/components/user-profile.tsx` - UserProfile component
- `src/utils/user.ts` - Utility functions
- `src/examples/user-state-usage.tsx` - Usage examples
