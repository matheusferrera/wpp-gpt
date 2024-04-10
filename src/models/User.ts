import mongoose, { Document, Schema, Model } from 'mongoose';
import { messageSchema } from './Message';

const userSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    clientId: { type: String, required: true, unique: false },
    messages: [messageSchema], // Nested array of messages
});

export interface IUser extends Document {
    userId: string;
    wppNumber: string;
    name: string;
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
