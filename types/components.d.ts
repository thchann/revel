import { ImageSourcePropType } from 'react-native';

export type EventCardProps = {
    image: any; // you can refine this later (e.g. ImageSourcePropType)
    title: string;
    org: string;
    date: string;
    location: string;
    description: string;
    compact: boolean;
  };

export type Event = {
  id: string;
  image: ImageSourcePropType;
  title: string;
  org: string;
  date: string;
  location: string;
  description: string;
  compact: boolean;
};

export type Club = {
  id: string;
  name: string;
  members: string;
  image: ImageSourcePropType;
}

export type Friend = {
  id: string;
  name: string;
  username: string;
  avatar: ImageSourcePropType;
  type?: 'status' | 'invite';
  status: 'going' | 'pending' | 'unavailable';
}

export type Party = {
  id: string;
  name: string;
  date: string;
  image: ImageSourcePropType;
}

