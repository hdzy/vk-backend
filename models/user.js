import mongoose from 'mongoose';


export const UserSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    friends: {
        type: Array,
        default: [],
    }
},
    {
        timestamps: true,
    }
)

export default mongoose.model('User', UserSchema);