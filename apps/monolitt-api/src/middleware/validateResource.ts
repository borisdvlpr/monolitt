import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

// Takes the Zod schema, the user's req and res and validates the user's request against the schema
const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
	// If the schema can be parsed, the request is good to go! (can call next() function)
	try {
		schema.parse({
			body: req.body,
			query: req.query,
			params: req.params
		});

		next();

	// If the schema cannot be parsed, it sends a 400 error
	} catch(e: any) {
		return res.status(400).send(e.errors);
	}
};

export default validateResource;
