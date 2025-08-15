//userimagecount.ts

import mongoose from 'mongoose';

interface IUserImageCount {
  userId: string;
  generatedImages: number;
}

const UserImageCountSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  generatedImages: { type: Number, required: true, default: 0 },
});

export const UserImageCount = mongoose.models.UserImageCount || mongoose.model<IUserImageCount>('UserImageCount', UserImageCountSchema);