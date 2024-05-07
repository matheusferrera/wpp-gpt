import mongoose, { Document, Schema } from 'mongoose';

export const templateSchema: Schema = new Schema({
    content: { type: Object, required: true, unique: false },
    count: { type: Number, required: true, unique: false, default: 0 },
    template: { type: Object, required: true, unique: true },
    userId: { type: String, required: true, unique: false  }
});

export interface ITemplate extends Document {
    content: object;
    count: number;
    template: object;
}

const TemplateModel = mongoose.model('Template', templateSchema);

export default TemplateModel;