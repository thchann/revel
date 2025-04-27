import 'dotenv/config';

export default {
  expo: {
    name: "revel-frontend",
    slug: "revel-frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      config: {
        googleMapsApiKey: process.env.IOS_GOOGLE_MAPS_API_KEY || "",
      },
      supportsTablet: true,
      bundleIdentifier: "com.johnstoklas.revelfrontend",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.ANDROID_GOOGLE_MAPS_API_KEY || "",
        }
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    scheme: "revel-frontend",
    extra: {
      auth0Domain: process.env.AUTH0_DOMAIN,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
      eas: {
        projectId: "4f5bca70-d3f9-41a3-8f03-ded0a24b2f8d"
      }
    },
    plugins: [
      "expo-secure-store"
    ]
  }
};