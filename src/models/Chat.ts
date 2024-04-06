import mongoose, { Document, Schema, Model } from 'mongoose';
import { messageSchema } from './Message';

const userSchema: Schema = new Schema({
    clientId: { type: String, required: true, unique: false },
    remoteId: { type: String, required: true, unique: false },
    messages: [messageSchema], // Nested array of messages
});

const ChatModel = mongoose.model('Chat', userSchema);

export default ChatModel;
