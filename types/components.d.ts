// types/components.d.ts
import { ImageSourcePropType } from 'react-native';

export type EventCardProps = {
  id: string;
  image?: ImageSourcePropType; // fallback image if no URL
  imageUrl?: string;            // actual backend image URL
  title: string;
  org: string;
  date: string;
  location: string;
  description: string;
  compact: boolean;
};

export type Event = EventCardProps; // ✅ Event is just an EventCardProps

export type Club = {
  id: string;
  name: string;
  members: string;
  image: ImageSourcePropType;
};

export type Friend = {
  id: string;
  name: string;
  username: string;
  avatar: ImageSourcePropType;
  type?: 'status' | 'invite';
  status: 'going' | 'pending' | 'unavailable';
  isFriend?: boolean; // for invite type
};

export type Party = {
  id: string;
  name: string;
  date: string;
  image: ImageSourcePropType;
};
