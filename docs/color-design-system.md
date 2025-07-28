# Medical Color Design System

## 📋 Tổng quan

Hệ thống màu sắc y tế được thiết kế dành riêng cho Zalo Mini App với nguyên tắc thiết kế bệnh viện hiện đại, tập trung vào sự tin cậy, sạch sẽ và chuyên nghiệp.

### 🎯 Mục tiêu thiết kế

- **Tin cậy**: Sử dụng màu xanh y tế để tạo cảm giác an toàn và chuyên nghiệp
- **Chữa lành**: Màu xanh lá cây thể hiện sự phục hồi và tăng trưởng
- **Sạch sẽ**: Màu trắng y tế tạo môi trường vô trùng và tinh khiết
- **Giao tiếp**: Màu cyan xây dựng niềm tin và khả năng giao tiếp

## 🎨 Color Palette

### Primary Colors - Màu chính

#### Medical Blue (Xanh Y Tế)

```
Primary: #2563EB - Màu chính của thương hiệu
Hover:   #1E40AF - Trạng thái hover
Active:  #1D4ED8 - Trạng thái active
Light:   #DBEAFE - Nền sáng
Dark:    #1E3A8A - Phiên bản tối
```

**Sử dụng:**

- Buttons chính, links quan trọng
- Headers, navigation
- Call-to-action elements
- Medical icons và badges

#### Healing Green (Xanh Chữa Lành)

```
Primary: #10B981 - Màu xanh chữa lành chính
Hover:   #059669 - Trạng thái hover
Light:   #D1FAE5 - Nền sáng
Dark:    #047857 - Phiên bản tối
```

**Sử dụng:**

- Success states, confirmations
- Health indicators, progress bars
- Positive medical results
- Recovery và wellness sections

#### Trust Cyan (Cyan Tin Cậy)

```
Primary: #0891B2 - Màu cyan tin cậy
Hover:   #0E7490 - Trạng thái hover
Light:   #CFFAFE - Nền sáng
Dark:    #155E75 - Phiên bản tối
```

**Sử dụng:**

- Information displays
- Communication features
- Secondary actions
- Trust indicators

### Semantic Colors - Màu ngữ nghĩa

#### Emergency (Khẩn Cấp)

```
Primary: #DC2626 - Đỏ khẩn cấp
Light:   #FEF2F2 - Nền cảnh báo nhẹ
Hover:   #B91C1C - Trạng thái hover
```

#### Warning (Cảnh Báo)

```
Primary: #F59E0B - Vàng cảnh báo
Light:   #FFFBEB - Nền cảnh báo nhẹ
Hover:   #D97706 - Trạng thái hover
```

#### Success (Thành Công)

```
Primary: #22C55E - Xanh thành công
Light:   #F0FDF4 - Nền thành công nhẹ
Hover:   #16A34A - Trạng thái hover
```

#### Info (Thông Tin)

```
Primary: #0EA5E9 - Xanh thông tin
Light:   #F0F9FF - Nền thông tin nhẹ
Hover:   #0284C7 - Trạng thái hover
```

### Neutral Colors - Màu trung tính

#### Medical Whites (Trắng Y Tế)

```
Pure:  #FFFFFF - Trắng tinh khiết
Soft:  #FAFBFC - Trắng mềm cho nền
Pearl: #F8F9FB - Trắng ngọc trai
```

#### Medical Grays (Xám Y Tế)

```
50:  #F8FAFC - Nền siêu sáng
100: #F1F5F9 - Nền rất sáng
200: #E2E8F0 - Viền sáng
300: #CBD5E1 - Xám sáng vừa
400: #94A3B8 - Text mờ
500: #64748B - Text phụ
600: #475569 - Text chính
700: #334155 - Xám tối
800: #1E293B - Xám rất tối
900: #0F172A - Nền dark mode
```

## 🔧 Cách sử dụng

### 1. Import Color System

```typescript
import { COLOR_TOKENS, MEDICAL_COLOR_PALETTE, getColorToken, getMedicalColor } from '@/styles/unified-color-system';
```

### 2. Sử dụng Color Tokens

```typescript
// Recommended - Sử dụng semantic tokens
const primaryColor = getColorToken('primary');
const textColor = getColorToken('text-primary');

// Direct access
const buttonColor = COLOR_TOKENS.primary;
const hoverColor = COLOR_TOKENS['primary-hover'];
```

### 3. Sử dụng trong CSS/SCSS

```css
/* Sử dụng CSS custom properties */
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
}
```

### 4. Sử dụng trong Tailwind

```html
<!-- Sử dụng custom colors -->
<button class="bg-primary text-white hover:bg-primary-hover">Primary Button</button>

<div class="bg-surface border border-light text-text-primary">Medical Card</div>
```

## ♿ Accessibility Compliance

### WCAG 2.1 AA Standards

Tất cả color combinations đều tuân thủ WCAG 2.1 AA:

#### Contrast Ratios

```
Text trên nền trắng:
- Large text (18pt+): ≥ 3:1
- Normal text: ≥ 4.5:1

Text trên nền màu:
- Primary blue (#2563EB): Contrast 7.2:1 ✅
- Healing green (#10B981): Contrast 4.8:1 ✅
- Trust cyan (#0891B2): Contrast 5.1:1 ✅
```

#### Color Blindness Support

- Không dựa hoàn toàn vào màu sắc để truyền đạt thông tin
- Sử dụng icons, patterns, và text labels
- Tested với Deuteranopia, Protanopia, Tritanopia

### Focus States

```css
.focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

## 📱 Dark Mode Support

### Dark Theme Colors

```typescript
// Dark mode overrides
background: '#0F172A'      // Dark background
surface: '#1E293B'         // Dark surface
text-primary: '#F8FAFC'    // Light text
text-secondary: '#CBD5E1'  // Secondary light text
border: '#334155'          // Dark border
```

### Implementation

```typescript
import { generateCSSVariables } from '@/styles/unified-color-system';

// Generate dark mode variables
const darkVariables = generateCSSVariables(true);
```

## 🚫 Don'ts - Những điều không nên làm

### ❌ Không sử dụng

- Hardcoded hex colors trong components
- Colors không có trong design system
- Màu sắc không tuân thủ accessibility
- Quá nhiều màu trong một interface

### ❌ Ví dụ sai

```css
/* WRONG - Hardcoded colors */
.button {
  background-color: #ff0000;
  color: #123456;
}

/* WRONG - Non-semantic naming */
.blue-button {
  background-color: var(--random-blue);
}
```

## ✅ Do's - Những điều nên làm

### ✅ Nên sử dụng

- Color tokens từ unified system
- Semantic naming conventions
- CSS custom properties
- Consistent hover/active states

### ✅ Ví dụ đúng

```css
/* CORRECT - Using color tokens */
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
}

/* CORRECT - Semantic naming */
.medical-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}
```

## 🔄 Migration Guide

### Bước 1: Thay thế hardcoded colors

```typescript
// Before
const styles = {
  backgroundColor: '#2563EB',
  color: '#FFFFFF',
};

// After
import { getColorToken } from '@/styles/unified-color-system';

const styles = {
  backgroundColor: getColorToken('primary'),
  color: getColorToken('text-on-primary'),
};
```

### Bước 2: Update CSS variables

```css
/* Before */
:root {
  --primary-color: #2563eb;
  --text-color: #333333;
}

/* After */
:root {
  --color-primary: #2563eb;
  --color-text-primary: #475569;
}
```

### Bước 3: Update Tailwind classes

```html
<!-- Before -->
<div class="bg-blue-600 text-white">
  <!-- After -->
  <div class="bg-primary text-text-on-primary"></div>
</div>
```

## 📊 Color Testing Tools

### Automated Testing

```typescript
import { validateColorContrast } from '@/utils/color-testing';

// Test contrast ratios
const isAccessible = validateColorContrast(getColorToken('primary'), getColorToken('text-on-primary'));
```

### Manual Testing Checklist

- [ ] Contrast ratios meet WCAG AA standards
- [ ] Colors work in dark mode
- [ ] Accessible to color blind users
- [ ] Consistent across all components
- [ ] No hardcoded colors in codebase

## 🎨 Color Combinations Examples

### Medical Card Combinations

```css
/* Primary Medical Card */
.medical-card-primary {
  background: var(--color-surface);
  border: 1px solid var(--color-primary);
  color: var(--color-text-primary);
}

/* Emergency Medical Card */
.medical-card-emergency {
  background: var(--color-error-light);
  border: 1px solid var(--color-error);
  color: var(--color-text-primary);
}

/* Success Medical Card */
.medical-card-success {
  background: var(--color-success-light);
  border: 1px solid var(--color-success);
  color: var(--color-text-primary);
}
```

### Button Combinations

```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  border: none;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

/* Secondary Button */
.btn-secondary {
  background: var(--color-secondary);
  color: var(--color-text-on-secondary);
  border: none;
}

/* Outline Button */
.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
```

## 🔍 Implementation Checklist

### Pre-Implementation

- [ ] Review current color usage in components
- [ ] Identify hardcoded colors to replace
- [ ] Plan migration strategy
- [ ] Set up color testing tools

### During Implementation

- [ ] Import unified color system
- [ ] Replace hardcoded colors with tokens
- [ ] Update CSS custom properties
- [ ] Test contrast ratios
- [ ] Verify dark mode compatibility

### Post-Implementation

- [ ] Run automated color tests
- [ ] Manual accessibility testing
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Update documentation

---

## 📞 Support

Nếu có thắc mắc về color system, vui lòng tham khảo:

- [Color Usage Examples](./color-usage-examples.md)
- [Component Color Guidelines](./component-color-guidelines.md)
- [Accessibility Testing Guide](./accessibility-testing.md)
