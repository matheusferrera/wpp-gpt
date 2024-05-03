import mongoose, { Document, Schema } from 'mongoose';

export const templateSchema: Schema = new Schema({
    text: { type: String, required: true, unique: true },
    count: { type: Number, required: true, unique: false, default: 0 },
    template: { type: Object, required: true, unique: false },
});

export interface ITemplate extends Document {
    text: string;
    count: number;
    template: object;
}

const TemplateModel = mongoose.model('Template', templateSchema);

export default TemplateModel;