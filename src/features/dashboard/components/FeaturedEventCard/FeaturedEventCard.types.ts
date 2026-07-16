export interface FeaturedEventCardProps {
  badge: string;
  title: string;
  description: string;
  date: string;
  image: string;
  onDetails?: () => void;
}
