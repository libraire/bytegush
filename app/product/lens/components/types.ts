export interface Photo {
    title: string;
    imgurl: string;
    position: number;
  }
  
  export interface SocialMedia {
    name: string;
    url: string;
    iconUrl: string;
  }
  
  export interface User {
    name: string;
    avatar: string;
    caption: string;
    medias: SocialMedia[];
  }
  
  export interface UserData {
    user: User;
    photos: Photo[];
  }
  
  export interface GalleryUser {
    name: string;
    avatar: string;
    caption: string;
    title: string;
    imgurl: string;
  }
  
  
  export interface ImageKitToken {
    token: string;
    expires: number;
    signature: string;
    tag: string
  }