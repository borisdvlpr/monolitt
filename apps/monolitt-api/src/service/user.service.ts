import UserModel from '../model/user.model';
import { UserDocument } from '../../global/types';

// Function used to create a User
// Recieves an input of type Partial<User> (which means that we are going to select any properties
// ... from the User's interface to create the new user)
export function createUser(input: Partial<UserDocument>) {
	return UserModel.create(input);
}

export function findUserById(id: string) {
	return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
	return UserModel.findOne({email});
}
