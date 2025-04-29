export type RootStackParamList = {
    Home: undefined;
    Search: undefined;
    Login: undefined;
    Welcome: undefined;
    Birthday: undefined;
    Username: undefined;
    Tabs: undefined;
    Manage: undefined;
    PartyPage: {
      id: string;
      title: string;
      org: string;
      date: string;
      location: string;
      description: string;
      image: any;
      imageUrl?: string;
    };
  };