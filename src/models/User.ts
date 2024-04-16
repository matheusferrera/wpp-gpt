import mongoose, { Document, Schema, Model } from 'mongoose';
import { clientSchema } from './Client';
import { templateSchema } from './Template';

const userSchema: Schema = new Schema({
    name: { type: String, required: true, unique: false },
    email: { type: String, required: false, unique: false },
    birthDate: { type: String, required: false, unique: false },
    clients: [clientSchema],
    templates: [templateSchema],
});

export interface IUser extends Document {
    name: string;
    email?: string;
    birthDate?: string;
    clients?: Array<Object>;
    templates?: Array<Object>;
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
