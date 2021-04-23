import mongoose, { Schema, Document } from "mongoose";
import { RefreshToken } from ".";
import Role from "./role";

interface UserDoc extends Document {
  ownsToken: (token: any) => boolean;
  username: string;
  passwordHash: string;
  role: Role;
}

const schema = new Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: Role, required: true },
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc: Document, ret: any) => {
      // remove these when object is serialized
      delete ret._id;
      delete ret.passwordHash;
  }
});

schema.virtual("ownsToken").get(async function (this: UserDoc, token: any) {
  const ownTokens = await RefreshToken.find({
    user: this._id,
  });
  return !!ownTokens.find((tokn: any) => tokn.token === token);
});

const userModel = mongoose.model<UserDoc>("User", schema);

export { userModel as default, UserDoc };
