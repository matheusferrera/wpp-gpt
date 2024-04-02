import mongoose, { Document, Schema, Model } from 'mongoose';

const clientSchema: Schema = new Schema({
    clientId: { type: String, required: true, unique: true },
    name: { type: String, required: false, unique: false },
});

const ClientModel = mongoose.model('Client', clientSchema);

export default ClientModel;
