# Modern Hospital Layout Wireframes
## Zalo Mini App Healthcare Platform

### 📐 Component Wireframe Specifications

This document provides detailed wireframes and layout specifications for the modern hospital aesthetic redesign of the Zalo Healthcare Mini App.

---

## 🏥 Header Component Wireframe

### Current vs. Modern Hospital Design

```
┌─────────────────────────────────────────────────────────────┐
│ MODERN HOSPITAL HEADER                                      │
├─────────────────────────────────────────────────────────────┤
│ ┌─────┐  Healthcare App        🔍 ⚙️ 👤                    │
│ │ 🏥+ │  Zalo Mini App         Search Settings Profile      │
│ └─────┘  Trusted Medical Care                               │
├─────────────────────────────────────────────────────────────┤
│ Semi-transparent background with medical gradient           │
│ Colors: #2563EB → #1E40AF gradient                        │
│ Height: 64px (mobile), 72px (tablet+)                     │
└─────────────────────────────────────────────────────────────┘
```

### Technical Specifications
- **Background**: Semi-transparent with medical gradient
- **Logo**: Hospital icon with medical cross
- **Typography**: Inter font, medical-grade readability
- **Accessibility**: ARIA labels, keyboard navigation
- **Animation**: Gentle fade-in with reduced-motion support

---

## 🏠 Home Page Dashboard Wireframe

### Modern Medical Facility Layout

```
┌─────────────────────────────────────────────────────────────┐
│ PATIENT DASHBOARD - MODERN HOSPITAL AESTHETIC              │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔍 Search medical services, doctors, departments...    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🏥 HERO SECTION - Premium Medical Services             │ │
│ │ "Your Health, Our Priority"                            │ │
│ │ [Book Appointment] [Emergency Care]                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ FEATURED MEDICAL SERVICES                               │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │ │
│ │ │ 🩺      │ │ 💊      │ │ 🧪      │ │ 📋      │        │ │
│ │ │Checkup  │ │Pharmacy │ │Lab Test │ │Records  │        │ │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ MEDICAL DEPARTMENTS                                     │ │
│ │ ┌─────────────────┐ ┌─────────────────┐                │ │
│ │ │ 🫀 Cardiology   │ │ 🧠 Neurology    │                │ │
│ │ │ Expert Care     │ │ Brain Health    │                │ │
│ │ └─────────────────┘ └─────────────────┘                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ HEALTH NEWS & UPDATES                                   │ │
│ │ 📰 Latest Medical Research                              │ │
│ │ 📰 Health Tips & Prevention                             │ │
│ │ 📰 Hospital Announcements                               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Design Specifications
- **Color Scheme**: Medical blues (#2563EB, #1E40AF), healing greens (#10B981, #059669)
- **Background**: Medical white (#FAFBFC) with subtle medical patterns
- **Cards**: Clean, elevated design with medical shadows
- **Icons**: Prominent medical iconography throughout
- **Spacing**: Hospital-grade precision spacing (24px sections, 16px cards)

---

## 📅 Appointment Booking Wireframe

### Modern Medical Booking Experience

```
┌─────────────────────────────────────────────────────────────┐
│ APPOINTMENT BOOKING - STEP 1                               │
├─────────────────────────────────────────────────────────────┤
│ ← Back    Book Medical Appointment              Step 1/3    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🏥 SELECT MEDICAL SERVICE                               │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ 🩺 General Consultation                             │ │ │
│ │ │ Comprehensive health checkup                        │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 👨‍⚕️ SELECT DOCTOR                                        │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Dr. Nguyen Van A                                    │ │ │
│ │ │ Internal Medicine Specialist                        │ │ │
│ │ │ ⭐⭐⭐⭐⭐ 4.9 (127 reviews)                           │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📅 SELECT DATE & TIME                                   │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ March 2024                                          │ │ │
│ │ │ Mo Tu We Th Fr Sa Su                                │ │ │
│ │ │     1  2  3  4  5  6                                │ │ │
│ │ │  7  8  9 [10] 11 12 13                              │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ Available Times:                                        │ │
│ │ [09:00] [10:30] [14:00] [15:30]                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    [Continue to Step 2]                 │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Booking Flow Specifications
- **Step Indicators**: Clear medical progress indicators
- **Form Design**: Hospital-grade form elements with medical context
- **Accessibility**: Enhanced keyboard navigation, screen reader support
- **Validation**: Real-time medical appointment validation
- **Animation**: Professional micro-animations with reduced-motion support

---

## 👨‍⚕️ Doctor Profile Wireframe

### Professional Medical Credentials Display

```
┌─────────────────────────────────────────────────────────────┐
│ DOCTOR PROFILE - MODERN MEDICAL LAYOUT                     │
├─────────────────────────────────────────────────────────────┤
│ ← Back    Dr. Nguyen Van A                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ┌─────────┐  Dr. Nguyen Van A                           │ │
│ │ │ 👨‍⚕️     │  Internal Medicine Specialist              │ │
│ │ │ Photo   │  🏥 Bach Mai Hospital                       │ │
│ │ │         │  📞 +84 123 456 789                         │ │
│ │ └─────────┘  ⭐⭐⭐⭐⭐ 4.9 (127 reviews)                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🎓 MEDICAL QUALIFICATIONS                               │ │
│ │ • MD - Hanoi Medical University (2010)                 │ │
│ │ • Residency - Internal Medicine (2014)                 │ │
│ │ • Board Certified - Internal Medicine                  │ │
│ │ • 10+ years clinical experience                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🩺 SPECIALIZATIONS                                      │ │
│ │ • Diabetes Management                                   │ │
│ │ • Hypertension Treatment                                │ │
│ │ • Preventive Care                                       │ │
│ │ • Health Screenings                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📅 AVAILABILITY                                         │ │
│ │ Monday - Friday: 8:00 AM - 5:00 PM                     │ │
│ │ Saturday: 8:00 AM - 12:00 PM                           │ │
│ │ Sunday: Closed                                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │              [Book Appointment]                         │ │
│ │              [Send Message]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Search Interface Wireframe

### Healthcare-Focused Search Experience

```
┌─────────────────────────────────────────────────────────────┐
│ MEDICAL SEARCH RESULTS                                      │
├─────────────────────────────────────────────────────────────┤
│ ← Back    Search Results                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔍 "cardiology"                              [Filter]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SEARCH FILTERS                                          │ │
│ │ [Doctors] [Services] [Departments] [All]               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 👨‍⚕️ DOCTORS (3 results)                                  │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Dr. Tran Van B - Cardiologist                       │ │ │
│ │ │ Heart specialist, 15+ years experience             │ │ │
│ │ │ ⭐⭐⭐⭐⭐ 4.8 (89 reviews)                           │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🏥 DEPARTMENTS (2 results)                              │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ 🫀 Cardiology Department                            │ │ │
│ │ │ Comprehensive heart care services                   │ │ │
│ │ │ 12 specialists available                            │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🩺 SERVICES (4 results)                                 │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Cardiac Consultation                                │ │ │
│ │ │ Complete heart health assessment                    │ │ │
│ │ │ 💰 500,000 VND                                      │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Footer Navigation Wireframe

### Medical Services Quick Access

```
┌─────────────────────────────────────────────────────────────┐
│ MODERN MEDICAL FOOTER NAVIGATION                            │
├─────────────────────────────────────────────────────────────┤
│ Glass morphism background with medical gradient             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │   🏠    │ │   🔍    │ │   📅    │ │   👤    │ │   ⚙️    │ │
│ │  Home   │ │ Search  │ │Booking  │ │Profile  │ │Settings │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│                                                             │
│ Colors: Medical blue accents, trust-building cyan          │
│ Height: 80px + safe area                                   │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Specifications
- **Icons**: Medical-themed icons with healthcare context
- **Accessibility**: Proper ARIA labels, keyboard navigation
- **Animation**: Gentle hover effects with reduced-motion support
- **Emergency Access**: Quick access to emergency services
- **Visual Feedback**: Clear active states with medical colors

---

## 🎨 Design System Integration

### Color Usage Guidelines
- **Primary Actions**: Medical Blue (#2563EB)
- **Success States**: Healing Green (#10B981)
- **Information**: Trust Cyan (#0891B2)
- **Backgrounds**: Medical White (#FAFBFC)
- **Text**: Professional gray hierarchy

### Typography Standards
- **Headers**: Inter font, medical-grade readability
- **Body Text**: Optimized for healthcare content
- **Medical Data**: Monospace for precision
- **Minimum Size**: 16px for accessibility

### Accessibility Requirements
- **Contrast**: WCAG 2.1 AA compliance (4.5:1 minimum)
- **Touch Targets**: 44px minimum, 52px for medical interfaces
- **Focus Indicators**: Clear medical-themed focus states
- **Screen Readers**: Comprehensive ARIA labels

---

*These wireframes provide the foundation for implementing a modern hospital aesthetic that builds trust, ensures accessibility, and delivers a premium medical facility experience.*
