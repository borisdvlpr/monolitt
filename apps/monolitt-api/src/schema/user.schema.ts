import {object, string, TypeOf} from 'zod';

// Object used to validade the objects passed on the requests
// Creates an object with the expected fields from the request object (and handles errors for those fields)
// Zod automatically verifies if passwords match, eliminating that necessity on the controller
// createUserSchema verifies the parameters passed on the creation of a new user
export const createUserSchema = object({
	// verifies the fields passed on the request body
	body: object({
		firstName: string({
			required_error: 'First name is required.'
		}),
		lastName: string({
			required_error: 'Last name is required.'
		}),
		password: string({
			required_error: 'Password is required.'
		}).min(6, 'Password lenght too short - should be min. 6 characters.'),
		passwordConfirmation: string({
			required_error: 'Password confirmation is required'
		}).min(6, 'Password lenght too short - should be min. 6 characters.'),
		email: string({
			required_error: 'First name is required'
		}).email('Not a valid email.')
	}).refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match.',
		path: ['passwordConfirmation']
	})
});

// validateUserShcema verifies the parameters passed on the validation of an existing user
export const verifyUserSchema = object({
	// verifies the params passed on the url
	params: object({
		id: string(),
		verificationCode: string()
	})
});

export const forgotPasswordSchema = object({
	body: object({
		email: string({
			required_error: 'First name is required'
		}).email('Not a valid email.')
	})
});

export const resetPasswordSchema = object({
	params: object({
		id: string(),
		passwordResetCode: string()
	}),
	body: object({
		password: string({
			required_error: 'Password is required.'
		}).min(6, 'Password lenght too short - should be min. 6 characters.'),
		passwordConfirmation: string({
			required_error: 'Password confirmation is required'
		}).min(6, 'Password lenght too short - should be min. 6 characters.')
	}).refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match.',
		path: ['passwordConfirmation']
	})
});

// Functions responsible for the conversion of the Zod object into a TS interface
export type CreateUserInputSchema = TypeOf<typeof createUserSchema>['body'];
export type VerifyUserInputSchema = TypeOf<typeof verifyUserSchema>['params'];
export type ForgotPasswordInputSchema = TypeOf<typeof forgotPasswordSchema>['body'];

// This schema is defined by two objects, body and params, so we don't need to call them 
// ... individually. We call each one, at the controller, on their respective positions
export type ResetPasswordInputSchema = TypeOf<typeof resetPasswordSchema>;
