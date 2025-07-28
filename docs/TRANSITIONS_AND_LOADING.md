# Page Transitions & Loading States

Hệ thống animation chuyển trang và trạng thái loading được tối ưu hóa cho ứng dụng y tế.

## 🚀 Tính năng chính

### Page Transitions
- **Smooth Page Transitions**: Hiệu ứng chuyển trang mượt mà với Framer Motion
- **Smart Direction Detection**: Tự động phát hiện hướng navigation (forward/backward)
- **Multiple Transition Types**: 
  - Default: Fade + scale cho trang thông thường
  - Slide: Trượt ngang cho trang chi tiết
  - Medical: Fade + blur cho trang y tế

### Loading States
- **Medical-themed Spinners**: Loading spinner với thiết kế y tế
- **Progressive Loading**: Hiển thị nội dung từng phần
- **Skeleton Loading**: Placeholder animation cho nội dung
- **Loading Overlays**: Overlay toàn màn hình với backdrop blur

### Performance Optimizations
- **Accessibility Support**: Tôn trọng `prefers-reduced-motion`
- **Mobile Optimized**: Tối ưu cho thiết bị di động
- **Memory Efficient**: Cleanup tự động cho animations

## 📁 Cấu trúc Files

```
src/
├── components/
│   ├── page-transition.tsx      # Component chuyển trang chính
│   ├── loading-states.tsx       # Các component loading
│   └── page.tsx                 # Page wrapper với transitions
├── hooks/
│   └── use-route-transition.ts  # Hooks quản lý transitions
├── styles/
│   └── transitions.css          # CSS cho animations
└── pages/
    └── demo/
        └── transitions.tsx      # Demo page
```

## 🎯 Cách sử dụng

### 1. Page Transitions (Tự động)
Page transitions được áp dụng tự động cho tất cả routes thông qua `PageTransition` component trong `page.tsx`.

### 2. Loading Components

#### LoadingSpinner
```tsx
import { LoadingSpinner } from '@/components/loading-states';

// Basic usage
<LoadingSpinner />

// With options
<LoadingSpinner 
  size="lg" 
  variant="medical" 
  message="Đang tải dữ liệu..." 
/>
```

#### LoadingOverlay
```tsx
import { LoadingOverlay } from '@/components/loading-states';

<LoadingOverlay 
  isVisible={isLoading}
  message="Đang xử lý yêu cầu..."
  variant="blur"
/>
```

#### Skeleton Loading
```tsx
import { Skeleton } from '@/components/loading-states';

<Skeleton variant="text" lines={3} />
<Skeleton variant="card" />
<Skeleton variant="avatar" />
```

#### Progressive Loader
```tsx
import { ProgressiveLoader } from '@/components/loading-states';

<ProgressiveLoader
  items={data}
  isLoading={loading}
  renderItem={(item) => <ItemComponent item={item} />}
  skeletonCount={5}
/>
```

### 3. Route Transition Hooks

#### useRouteTransition
```tsx
import { useRouteTransition } from '@/hooks/use-route-transition';

const {
  isTransitioning,
  direction,
  previousPath,
  currentPath
} = useRouteTransition();
```

#### useTransitionLoading
```tsx
import { useTransitionLoading } from '@/hooks/use-route-transition';

const { 
  isLoading, 
  startLoading, 
  stopLoading 
} = useTransitionLoading();

// Usage
const handleAction = () => {
  startLoading('Đang xử lý...', 1000);
  // Perform action
  // Loading will stop automatically after 1000ms
};
```

#### usePageLoading
```tsx
import { usePageLoading } from '@/hooks/use-route-transition';

const pageLoading = usePageLoading('myPage');

// Set loading state
pageLoading.setLoading('section1', true);

// Check loading state
if (pageLoading.isLoading('section1')) {
  // Show loading UI
}
```

## 🎨 Transition Types

### 1. Default Transition
- **Sử dụng**: Trang thông thường (home, about, etc.)
- **Hiệu ứng**: Fade + scale nhẹ
- **Thời gian**: 400ms

### 2. Slide Transition
- **Sử dụng**: Trang chi tiết (service/:id, department/:id)
- **Hiệu ứng**: Trượt ngang theo hướng navigation
- **Thời gian**: 300ms

### 3. Medical Transition
- **Sử dụng**: Trang y tế (booking, schedule, ask)
- **Hiệu ứng**: Fade + blur
- **Thời gian**: 350ms

## 🔧 Customization

### Thêm Transition Type mới
```tsx
// Trong page-transition.tsx
const newVariants = {
  initial: { /* initial state */ },
  in: { /* animate in */ },
  out: { /* animate out */ }
};

// Thêm vào getTransitionType function
function getTransitionType(pathname: string): 'slide' | 'medical' | 'new' | 'default' {
  if (pathname.includes('/new-section/')) {
    return 'new';
  }
  // ...
}
```

### Custom Loading Message
```tsx
// Trong router.tsx
<LazyPageWrapper loadingMessage="Custom loading message...">
  <YourPage />
</LazyPageWrapper>
```

## 📱 Mobile Optimization

- **Touch-friendly**: Animations tối ưu cho touch interactions
- **Performance**: Sử dụng `transform` và `opacity` cho GPU acceleration
- **Battery-friendly**: Tự động giảm animations khi `prefers-reduced-motion`

## ♿ Accessibility

- **Reduced Motion**: Tự động disable animations khi user prefer reduced motion
- **Focus Management**: Maintain focus states during transitions
- **Screen Reader**: Loading states có proper ARIA labels
- **High Contrast**: Support cho high contrast mode

## 🧪 Demo & Testing

Truy cập `/demo/transitions` (chỉ trong development mode) để xem demo đầy đủ các tính năng:

- Page transition examples
- Loading state variations
- Interactive demos
- Performance monitoring

## 🚀 Performance Tips

1. **Lazy Loading**: Sử dụng `LazyPageWrapper` cho code splitting
2. **Skeleton Loading**: Hiển thị skeleton thay vì loading spinner cho UX tốt hơn
3. **Progressive Loading**: Load nội dung từng phần thay vì chờ tất cả
4. **Memory Management**: Cleanup timers và animations khi component unmount

## 🐛 Troubleshooting

### Animation không hoạt động
- Kiểm tra `prefers-reduced-motion` setting
- Verify Framer Motion được import đúng
- Check console cho errors

### Loading state không update
- Ensure proper cleanup trong useEffect
- Check loading state management logic
- Verify component re-renders

### Performance issues
- Reduce animation duration
- Use `will-change` CSS property sparingly
- Monitor memory usage với dev tools

## 📚 Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
