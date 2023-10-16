import mongoose, { Schema } from 'mongoose';
import { SessionDocument } from '../../global/types';

const sessionSchema = new Schema<SessionDocument>({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	valid: { type: Boolean, default: true }
},
{
	timestamps: true
});

const SessionModel = mongoose.model('Session', sessionSchema);

export default SessionModel;
