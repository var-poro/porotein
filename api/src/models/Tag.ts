import { Schema, model, Document } from 'mongoose';

interface ITag extends Document {
    name: string;
    description: string;
}

const tagSchema = new Schema<ITag>({
    name: { type: String, required: true },
    description: { type: String }
});

const Tag = model<ITag>('Tag', tagSchema);

export default Tag;