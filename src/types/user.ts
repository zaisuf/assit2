export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  location?: string;
  bio?: string;
  website?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  preferences: {
    emailNotifications: boolean;
    darkMode: boolean;
    language: string;
  }
}