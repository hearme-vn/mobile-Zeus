import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.labsofthings.hearme',
  appName: 'hearme',
  webDir: 'dist',
  server: {
    iosScheme: 'https',
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
        presentationOptions: ['badge', 'sound', 'alert']
    }
  }  
};

export default config;
