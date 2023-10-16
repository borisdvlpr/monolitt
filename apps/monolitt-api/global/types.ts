import { Types } from 'mongoose';

export interface UserInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    verificationCode: string;
    passwordResetCode: string | null;
    verified: boolean;
  }
  
export interface UserDocument extends UserInput {
    createdAt: Date;
    updatedAt: Date;
    validatePassword(candidatePassword: string): Promise<Boolean>;
    toJSON(): Promise<UserInput>;
}

export interface SessionDocument {
    user: Types.ObjectId;
    valid: Boolean;
    createdAt: Date;
    updatedAt: Date;
}
