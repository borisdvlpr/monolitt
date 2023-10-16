import mongoose, { Schema } from 'mongoose';
import { UserInput, UserDocument } from '../../global/types';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import { omit } from 'lodash';

export const privateFields = ['password', '__v', 'verificationCode', 'passwordResetCode', 'verified'];

const userSchema = new Schema<UserInput>({
	email: { type: String, lowercase: true, required: true, unique: true, index: true},
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	verificationCode: { type: String, default: () => nanoid() },
	passwordResetCode: { type: Schema.Types.Mixed, default: null },
	verified: { type: Boolean, default: false }
},
{
	timestamps: true,
});

userSchema.pre('save', async function (next) {
	if(!this.isModified('password')) {
		return next();
	}
  
	const hash = await argon2.hash(this.password);
	this.password = hash;
  
	return;
});

userSchema.methods.validatePassword = async function (candidatePassword: string) {
	try {
		return await argon2.verify(this.password, candidatePassword);

	} catch(e: any) {
		return false;
	}
};

userSchema.methods.toJSON = function() {
	const user = this.toObject();
	omit(user, privateFields);

	return user;
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
