import mongoose, { Document, Schema, Model } from 'mongoose';
import { clientSchema } from './Client';

const userSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: false },
    email: { type: String, required: false, unique: false },
    birthDate: { type: String, required: false, unique: false },
    clients: [clientSchema],
});

export interface IUser extends Document {
    userId: string;
    wppNumber: string;
    name: string;
    email?: string;
    birthDate?: string;
    clients?: Array<Object>;
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
