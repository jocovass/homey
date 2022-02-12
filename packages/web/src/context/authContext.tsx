import React from 'react';

/**
 * USER INVITATION MODEL
 */
type UserInvitation = {
    id: string;
    byWho: string;
    nameOfTheHouseHold: string;
    inviteSent: Date;
    status: 'pending' | 'accepted' | 'rejected';
} | null;

/**
 * USER HOUSEHOLD MODEL
 */
type UserHousehold = {
    id: string;
    name: string;
    memberSince: Date;
    role: 'member' | 'admin' | 'owner';
} | null;

/**
 * USER MODEL
 */
type User = {
    name: string;
    email: string;
    uId: string;
    createdAt: Date;
    updatedAt: Date;
    photoUrl: string;
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
    payload: { email: string; password: string; name: string };
};

/**
 * UPDATE USER ACTION MODEL
 */
type UpdateUserAction = {
    type: 'update_user';
    payload: { emal: string; name: string; updatedAt: Date; photoUrl: string };
};

/**
 * RESET PASSWORD EMAIL ACTION MODEL
 */
type ResetPasswordEmail = {
    type: 'reset_password';
    payload: { email: string };
};

/**
 * REAUTHENTICATE USER MODEL
 */
type ReAuthenticate = {
    type: 're_authenticate';
    payload: { password: string };
};

type Actions = LoginAction | LogoutAction | SingupAction;
type Dispatch = (action: Actions) => void;
type State = {
    user: User | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    error: string | null;
};
type AuthProviderProps = { children: React.ReactNode };
type AuthContextType = { state: State; dispatch: Dispatch };

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// REDUCER
function authReducer(state: State, action: Actions) {
    switch (action.type) {
        case 'login':
            // do something
            return state;
        case 'logout':
            return state;
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

// AUTH PROVIDER
export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = React.useReducer(authReducer, {
        user: null,
        status: 'idle',
        error: null,
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
