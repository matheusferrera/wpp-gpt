import mongoose, { Document, Schema, Model } from 'mongoose';

const userSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: false },
    wppNumber: { type: String, required: true, unique: false },
    email: { type: String, required: false, unique: false },
    birthDate: { type: String, required: false, unique: false },
});

export interface IUser extends Document {
    userId: string;
    wppNumber: string;
    name: string;
    email?: string;
    birthDate?: string;
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
