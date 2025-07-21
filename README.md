# HTML Content Processor với Tailwind CSS

Hệ thống này cho phép chuyển đổi nội dung HTML từ WordPress (hoặc các nguồn khác) sang định dạng tương thích với Tailwind CSS, loại bỏ các thuộc tính style inline và thêm vào các class phù hợp của Tailwind.

## Tính năng chính

- Loại bỏ tất cả các thuộc tính style và class gốc không cần thiết
- Chuyển đổi các phần tử HTML sang các lớp Tailwind CSS phù hợp
- Bảo toàn cấu trúc và chức năng của các phần tử form
- Tự động định dạng các thành phần phổ biến (headings, tables, lists, images, etc.)
- Hỗ trợ xử lý responsive cho cấu trúc grid
- Giao diện trực quan để xem từng bước trong quá trình xử lý

## Các thành phần

### 1. Hàm `normalizeHtml`

Hàm chính xử lý việc chuyển đổi HTML sang định dạng Tailwind CSS:

```typescript
// src/utils/normalHTML.tsx
export const normalizeHtml = (html: string): string => {
  // Logic xử lý và áp dụng các class Tailwind
  // ...
};
```

### 2. Component `HtmlContentDisplay`

Component để hiển thị nội dung HTML đã được xử lý:

```typescript
// src/components/HtmlContentDisplay.tsx
import React from 'react';
import { normalizeHtml } from '../utils/normalHTML';

interface HtmlContentDisplayProps {
  htmlContent: string;
  className?: string;
}

export const HtmlContentDisplay: React.FC<HtmlContentDisplayProps> = ({ htmlContent, className = '' }) => {
  // Logic xử lý và hiển thị HTML
  // ...
};
```

### 3. Các hàm tiện ích

Các hàm hỗ trợ xử lý HTML từ các nguồn khác nhau:

```typescript
// src/utils/htmlProcessingHelpers.ts
export const extractRawHtml = (html: string): string => {
  // Logic trích xuất HTML thuần từ WordPress hoặc các nguồn khác
  // ...
};

export const addTailwindStructure = (html: string): string => {
  // Logic thêm cấu trúc Tailwind CSS
  // ...
};
```

### 4. Component `ContentProcessor`

Giao diện người dùng để xử lý và hiển thị nội dung:

```typescript
// src/components/ContentProcessor.tsx
import React, { useState } from 'react';
import { HtmlContentDisplay } from './HtmlContentDisplay';
import { extractRawHtml, addTailwindStructure } from '../utils/htmlProcessingHelpers';
import { normalizeHtml } from '../utils/normalHTML';

export const ContentProcessor: React.FC = () => {
  // Logic xử lý và hiển thị UI
  // ...
};
```

## Cách sử dụng

### Trực tiếp với hàm `normalizeHtml`

```typescript
import { normalizeHtml } from './utils/normalHTML';

// Sử dụng trong component của bạn
const MyComponent = ({ htmlContent }) => {
  const normalizedHtml = normalizeHtml(htmlContent);

  return (
    <div dangerouslySetInnerHTML={{ __html: normalizedHtml }} />
  );
};
```

### Sử dụng component `HtmlContentDisplay`

```typescript
import { HtmlContentDisplay } from './components/HtmlContentDisplay';

// Sử dụng trong component của bạn
const MyComponent = ({ htmlContent }) => {
  return (
    <div className="my-content">
      <HtmlContentDisplay htmlContent={htmlContent} className="additional-class" />
    </div>
  );
};
```

### Sử dụng giao diện `ContentProcessor`

1. Import và sử dụng component ContentProcessor trong ứng dụng của bạn
2. Dán nội dung HTML vào ô text
3. Nhấn "Xử lý nội dung" để chuyển đổi
4. Xem kết quả và các bước trung gian trong quá trình xử lý

```typescript
import { ContentProcessor } from './components/ContentProcessor';

const App = () => {
  return (
    <div className="app">
      <ContentProcessor />
    </div>
  );
};
```

## Tùy chỉnh

Bạn có thể tùy chỉnh các lớp Tailwind CSS được áp dụng cho từng phần tử bằng cách chỉnh sửa hàm `normalizeHtml` trong file `src/utils/normalHTML.tsx`.

## Yêu cầu

- React 16.8+ (cho các hooks)
- Tailwind CSS đã được cấu hình trong dự án
- Chỉ hoạt động ở phía client (cần DOMParser)

## Lưu ý

- Luôn kiểm tra kết quả và điều chỉnh các lớp CSS nếu cần thiết
- Một số cấu trúc HTML phức tạp có thể cần được xử lý thêm
- Sử dụng `dangerouslySetInnerHTML` cẩn thận và đảm bảo HTML đã được sanitize
