import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prodigyapps.undercover',
  appName: 'undercover',
  webDir: 'apps/undercover/dist',
    ios: {
    contentInset: 'always'
  }
};

export default config;
