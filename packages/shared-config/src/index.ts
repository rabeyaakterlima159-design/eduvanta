// ==============================================================================
// EDUVANTA BRAND DESIGN SYSTEM & PLATFORM CONSTANTS
// ==============================================================================

export const EDUVANTA_BRAND = {
  name: 'EDUVANTA',
  tagline: 'One Platform. Every Campus. Smarter Education.',
  subtagline: 'SMARTER CAMPUS • BRIGHTER FUTURE',
  colors: {
    primaryNavy: '#102A56',
    royalBlue: '#2563EB',
    electricBlue: '#3B82F6',
    goldAccent: '#F5B82E',
    background: '#F5F8FC',
    white: '#FFFFFF',
    text: '#17243A',
    mutedText: '#64748B',
    border: '#E2E8F0',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
    info: '#0284C7',
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
} as const;

export const DEFAULT_SDUI_THEME = {
  primaryColor: EDUVANTA_BRAND.colors.primaryNavy,
  secondaryColor: EDUVANTA_BRAND.colors.royalBlue,
  accentColor: EDUVANTA_BRAND.colors.goldAccent,
  backgroundColor: EDUVANTA_BRAND.colors.background,
  appBarTitle: 'EDUVANTA',
  logoUrl: null,
};

export const PAYMENT_GATEWAY_CONFIGS = {
  bkash: {
    name: 'bKash',
    logoUrl: '/images/gateways/bkash.png',
    sandboxUrl: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
    productionUrl: 'https://tokenized.pay.bka.sh/v1.2.0-beta',
    currency: 'BDT',
  },
  nagad: {
    name: 'Nagad',
    logoUrl: '/images/gateways/nagad.png',
    sandboxUrl: 'http://sandbox.mymdirect.com:8080/remote-payment-gateway-1.0/api/dfs',
    productionUrl: 'https://api.mynagad.com/api/dfs',
    currency: 'BDT',
  },
  sslcommerz: {
    name: 'SSLCommerz',
    logoUrl: '/images/gateways/sslcommerz.png',
    sandboxUrl: 'https://sandbox.sslcommerz.com',
    productionUrl: 'https://securepay.sslcommerz.com',
    currency: 'BDT',
  },
};
