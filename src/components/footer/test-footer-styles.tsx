/**
 * Footer Styles Test Component
 * Use this component to test and preview footer active states and blue color scheme
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BaseFooter } from './BaseFooter';
import { useDeviceInfo } from './hooks';
import { IOS_STYLES, ANDROID_STYLES, WEB_STYLES, DIMENSIONS } from './constants';
import { createNavigationItems } from './navigation-items';

const FooterStylesTest: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android' | 'web'>('ios');
  const [activeItemId, setActiveItemId] = useState<string>('home');
  const [showLabels, setShowLabels] = useState<boolean>(false); // Always false for pure icon-only design
  const deviceInfo = useDeviceInfo();

  const platformStyles = {
    ios: IOS_STYLES,
    android: ANDROID_STYLES,
    web: WEB_STYLES,
  }[selectedPlatform];

  const dimensions = {
    ios: { ...DIMENSIONS.ios, showLabels },
    android: { ...DIMENSIONS.android, showLabels },
    web: { ...DIMENSIONS.web, showLabels },
  }[selectedPlatform];

  const navigationItems = createNavigationItems(selectedPlatform).map((item) => ({
    ...item,
    // Override path to prevent navigation during testing
    path: '#',
  }));

  // Mock active item for testing
  // Test items with various text lengths to demonstrate size consistency
  const testItems = [
    { id: 'home', label: 'Home', path: '#', icon: navigationItems[0].icon, ariaLabel: 'Home page' },
    { id: 'services', label: 'Services', path: '#', icon: navigationItems[1].icon, ariaLabel: 'Services page' },
    {
      id: 'booking',
      label: 'Book Appointment',
      path: '#',
      icon: navigationItems[2].icon,
      ariaLabel: 'Book appointment page',
      badge: 3,
    },
    { id: 'doctor', label: 'Dr', path: '#', icon: navigationItems[3].icon, ariaLabel: 'Doctor profiles' },
    {
      id: 'about',
      label: 'About Us Information',
      path: '#',
      icon: navigationItems[4].icon,
      ariaLabel: 'About us page',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Footer Styles Test - Blue Theme</h1>

        {/* Platform Selector */}
        <div
          style={{
            marginBottom: '30px',
            textAlign: 'center',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          {(['ios', 'android', 'web'] as const).map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectedPlatform === platform ? '#007AFF' : '#e0e0e0',
                color: selectedPlatform === platform ? 'white' : '#333',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* iOS Blue Theme Design Info */}
        <div
          style={{
            marginBottom: '20px',
            textAlign: 'center',
            padding: '12px 20px',
            backgroundColor: '#f0f8ff',
            borderRadius: '8px',
            border: '1px solid #e6f3ff',
          }}
        >
          <span style={{ fontWeight: '600', color: 'rgb(0, 122, 255)' }}>iOS-Style Medical Interface</span>
          <br />
          <span style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Clean iOS design with blue theme, optimized for all platforms and screen sizes
          </span>
        </div>

        {/* Active Item Selector */}
        <div
          style={{
            marginBottom: '30px',
            textAlign: 'center',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ marginRight: '10px', fontWeight: '500' }}>Active Item:</span>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItemId(item.id)}
              style={{
                padding: '5px 15px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                backgroundColor: activeItemId === item.id ? '#007AFF' : 'white',
                color: activeItemId === item.id ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Style Information */}
        <div
          style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#333' }}>Current Platform: {selectedPlatform.toUpperCase()}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>Primary Color:</strong>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: platformStyles.colors.primary,
                  display: 'inline-block',
                  marginLeft: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                }}
              />
              <span style={{ marginLeft: '10px', fontSize: '12px', fontFamily: 'monospace' }}>
                {platformStyles.colors.primary}
              </span>
            </div>
            <div>
              <strong>Active Background:</strong>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: platformStyles.colors.active?.background || 'rgba(0, 122, 255, 0.1)',
                  display: 'inline-block',
                  marginLeft: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                }}
              />
            </div>
            <div>
              <strong>Button Size:</strong> {dimensions.buttonSize}px
            </div>
            <div>
              <strong>Footer Height:</strong> {dimensions.height}px
            </div>
          </div>
        </div>

        {/* Features List */}
        <div
          style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#333' }}>iOS-Optimized Features</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>🍎 iOS-style medical icons with clean design</li>
            <li>🔵 iOS blue active state (rgb(0, 122, 255))</li>
            <li>📱 iOS standard 49px touch targets</li>
            <li>🔍 25px icons optimized for iOS interface</li>
            <li>✨ Subtle iOS blue glow effects</li>
            <li>📱 Consistent iOS design across all platforms</li>
            <li>🎭 iOS-style scaling (1.08x) for active state</li>
            <li>🌟 Clean, iOS-focused aesthetic</li>
            <li>♿ iOS accessibility standards with ARIA labels</li>
            <li>🎨 iOS blue/gray color scheme</li>
            <li>⚡ iOS-optimized performance and animations</li>
            <li>🔧 iOS standard dimensions (83px height)</li>
          </ul>
        </div>
      </div>

      {/* Footer Preview */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <BaseFooter
          items={testItems}
          deviceInfo={deviceInfo}
          platformStyles={platformStyles}
          dimensions={dimensions}
          className={`${selectedPlatform}-footer-test`}
        />
      </div>
    </div>
  );
};

export default FooterStylesTest;
