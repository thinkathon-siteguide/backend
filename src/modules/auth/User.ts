import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  correctPassword(candidatePassword: string, userPassword?: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next: any) {
  if (!this.isModified('password')) return next();
  try {
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  } catch (err: any) {
    next(err);
  }
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword?: string
) {
    const pass = userPassword || this.password;
    if(!pass) return false;
    return await bcrypt.compare(candidatePassword, pass);
};

export const User = model<IUser>('User', userSchema);
