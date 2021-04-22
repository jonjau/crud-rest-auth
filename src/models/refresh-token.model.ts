import mongoose, { Schema, Document } from "mongoose";

interface RefreshTokenDoc extends Document {
  user: Schema.Types.ObjectId;
  token: string;
  expires: Date;
  created: Date;
  createdByIp: string;
  revoked: Date;
  revokedByIp: string;
  replacedByToken: string;

  isExpired: boolean;
  isActive: boolean;
}

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  token: String,
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
});

schema.virtual("isExpired").get(function (this: RefreshTokenDoc) {
  return new Date() >= this.expires;
});

schema.virtual("isActive").get(function (this: RefreshTokenDoc) {
  return !this.revoked && !this.isExpired;
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_doc: Document, ret: any) {
    // remove these when object is serialized
    delete ret._id;
    delete ret.id;
    delete ret.user;
  },
});

const refreshTokenModel = mongoose.model<RefreshTokenDoc>(
  "RefreshToken",
  schema
);

export { refreshTokenModel as default, RefreshTokenDoc};
