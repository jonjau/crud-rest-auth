import mongoose, { Schema, Document } from "mongoose";

interface UserDoc extends Document {
  username: string;
  passwordHash: string;
  role: string;
}

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: any) => {
      // remove these when object is serialized
      delete ret._id;
      delete ret.passwordHash;
  }
});

const userModel = mongoose.model<UserDoc>("User", userSchema);

export { userModel as default, UserDoc };
