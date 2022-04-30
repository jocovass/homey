import React from 'react';
import axios from '../util/axios';

/**
 * USER INVITATION MODEL
 */
type UserInvitation = {
    id: string;
    invitedBy: string;
    household: string;
    createdAt: Date;
    status: 'pending' | 'accepted' | 'rejected';
} | null;

/**
 * USER HOUSEHOLD MODEL
 */
type UserHousehold = {
    id: string;
    household: string;
    joined: Date;
    role: 'member' | 'admin' | 'owner';
} | null;

/**
 * USER MODEL
 */
type User = {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    avatar: string;
    invitation: UserInvitation;
    household: UserHousehold;
};

/**
 * LOGIN ACTION MODEL
 */
type LoginAction = {
    type: 'login';
    payload: { email: string; password: string };
};

/**
 * LOGOUT ACTION MODEL
 */
type LogoutAction = { type: 'logout' };

/**
 * SIGNUP ACTION MODEL
 */
type SingupAction = {
    type: 'singup';
    payload: {
        email: string;
        password: string;
        passwordConfirm: string;
        firstName: string;
        lastName: string;
    };
};

/**
 * UPDATE USER ACTION MODEL
 */
type UpdateUserAction = {
    type: 'update_user';
    payload: {
        emal: string;
        firstName: string;
        lastName: string;
        avatar: string;
    };
};

/**
 * RESET PASSWORD EMAIL ACTION MODEL
 */
type ResetPasswordEmail = {
    type: 'reset_password';
    payload: { email: string };
};

type StatusAction = {
    type: 'SET_STATUS';
    payload: { status: 'pending' | 'success' | 'error' };
};

type SetErrorAction = {
    type: 'SET_ERROR';
    payload: {
        globalError: string | null;
        errors: { [key: string]: string } | null;
    };
};

type SetUserAction = {
    type: 'SET_USER';
    payload: {
        status: 'pending' | 'success' | 'error';
        user: User;
    };
};

type Actions =
    | StatusAction
    | SetUserAction
    | SetErrorAction
    | ResetPasswordEmail;
type Dispatch = (action: Actions) => void;
type State = {
    user: User | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    errors: { [key: string]: string } | null;
    globalError: string | null;
};
type AuthProviderProps = { children: React.ReactNode };
type AuthContextType = { state: State; dispatch: Dispatch };

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

// REDUCER
function authReducer(state: State, action: Actions): State {
    switch (action.type) {
        case 'SET_STATUS':
            return {
                ...state,
                status: action.payload.status,
            };
        case 'SET_ERROR':
            return {
                ...state,
                ...action.payload,
                status: 'error',
            };
        case 'SET_USER':
            return {
                ...state,
                ...action.payload,
                errors: {},
                globalError: null,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

// AUTH PROVIDER
export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = React.useReducer(authReducer, {
        user: null,
        status: 'idle',
        errors: null,
        globalError: null,
    });

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

// useHook TO CONSUME AUTHCONTEXT
export function useAuth() {
    const context = React.useContext(AuthContext);

    if (context === undefined) {
        throw new Error(`useAuth must be used within the AuthProvider`);
    }

    return context;
}

// login, signup, reset password, update user settings, singup with invite, logout, checkif user is logged in

export const login = async (
    dispatch: Dispatch,
    { email, password }: { email: string; password: string },
) => {
    // dispatch a start action
    dispatch({ type: 'SET_STATUS', payload: { status: 'pending' } });
    try {
        const { data } = await axios.post('/users/login', {
            email,
            password,
        });

        dispatch({
            type: 'SET_USER',
            payload: {
                user: data.data.user,
                status: 'success',
            },
        });
    } catch (error: any) {
        // error can be global to the form like (INVALID CREDENTIALS)
        if (error.response.data.message) {
            dispatch({
                type: 'SET_ERROR',
                payload: {
                    globalError: error.response.data.message,
                    errors: {},
                },
            });
        } else {
            // or it can be input related (VALIDATION ERRORS)
            /**
             * error.response.data.errors
             *      [
             *          { email: 'Field is required' },
             *          { email: 'Email is invalid' },
             *          { password: 'Field is required' },
             *          ...
             *      ]
             */
            let errors = error.response.data?.errors?.reduce(
                (
                    acc: { [key: string]: string },
                    item: { [key: string]: string },
                ) => {
                    let keys = Object.keys(item);
                    // if (!acc[keys[0]]) {
                    acc[keys[0]] = item[keys[0]];
                    // }

                    return acc;
                },
                {},
            );

            dispatch({
                type: 'SET_ERROR',
                payload: {
                    errors,
                    globalError: null,
                },
            });
        }
    }
};
