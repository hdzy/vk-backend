import mongoose from 'mongoose';


export const PostSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            required: true
        },

        tags: {
            type: Array,
            default: []
        },

        viewsCount: {
            type: Number,
            default: 0
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        imageUrl: String,
    },
    {
        timestamps: true
    })

export default mongoose.model('Post', PostSchema);