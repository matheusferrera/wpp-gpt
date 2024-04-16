import mongoose, { Document, Schema, Model } from 'mongoose';

const contactSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: false },
    wppNumber: { type: String, required: true, unique: false },
    name: { type: String, required: false, unique: false },
});

export interface IContact extends Document {
    userId: string;
    wppNumber: string;
    name: string;
}

const ContactModel = mongoose.model('Contact', contactSchema);

export default ContactModel;
