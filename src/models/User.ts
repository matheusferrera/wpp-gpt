import mongoose, { Document, Schema, Model } from 'mongoose';
import { messageSchema } from './Message';

const userSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    messages: [messageSchema], // Nested array of messages
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
