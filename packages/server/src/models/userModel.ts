import { Schema, Model, Types, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

interface IUserInvitation {
    _id?: Types.ObjectId;
    invitedBy: Types.ObjectId;
    household: Types.ObjectId;
    createdAt: Date;
    status: 'pending' | 'accepted' | 'rejected';
}

interface IUserHousehold {
    _id: Types.ObjectId;
    household: Types.ObjectId;
    joined: Date;
    role: 'member' | 'admin' | 'owner';
}

interface IUserBase {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    invitation?: IUserInvitation;
    houehold?: IUserHousehold;
}

export interface IUserFront extends IUserBase {
    _id: Types.ObjectId;
}

export interface IUserBack extends IUserBase, Document {
    password: string;
    passwordResetToken?: string;
    passwordResetExpires?: DataView;
    _id: Types.ObjectId;
    comparePassword: (password: string) => Promise<boolean>;
    createPasswordResetToken: () => string;
}

type UserModel = Model<IUserBack>;

const userSchema = new Schema<IUserBack, UserModel>(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required.'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required.'],
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, 'Email is required.'],
        },
        avatar: {
            type: String,
        },
        password: {
            type: String,
            select: true,
            required: [true, 'Password is required.'],
        },
        houehold: {
            role: {
                type: String,
                enum: ['admin', 'member', 'owner'],
            },
            joined: Date,
            householdRef: {
                type: Schema.Types.ObjectId,
                ref: 'Household',
            },
        },
        invitation: {
            status: {
                type: String,
                enum: ['pending', 'accepted', 'rejected'],
            },
            invitedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            createdAt: Date,
            household: {
                type: Schema.Types.ObjectId,
                ref: 'Household',
            },
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    {
        timestamps: true,
    },
);

// Has the password before saving it to the database
// Runs when creating new account and when updating password
userSchema.pre<IUserBack>('save', async function (next): Promise<void> {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.method<IUserBack>(
    'comparePassword',
    function (password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    },
);

userSchema.methods.createPasswordResetToken = function (): string {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = model<IUserBack, UserModel>('User', userSchema);

export { User };
