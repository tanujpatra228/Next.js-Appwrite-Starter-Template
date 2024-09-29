import mongoose, { Schema, Document } from "mongoose";

const UserSchema: Schema<UserType> = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
}, {
    timestamps: true,
});

export type UserType = Document & {
    name: string;
    email: string;
}

const User = mongoose.models.Users as mongoose.Model<UserType> || mongoose.model<UserType>('Users', UserSchema);
export default User;