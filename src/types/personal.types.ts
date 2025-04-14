export interface SocialLink {
  id_social: number;
  platform: string;
  url: string;
  icon: string;
}

export interface PersonalInfo {
  id_personal: number;
  name: string;
  title: string;
  email: string;
  location: string;
  bio: string;
  socialLinks: SocialLink[];
}