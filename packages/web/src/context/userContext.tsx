import React from 'react';

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

type SetUserAction = {
    type: 'SET_USER';
    payload: {
        user: User;
    };
};

type SetStatusAction = {
    type: 'SET_STATUS';
    payload: { status: 'pending' | 'success' | 'error' };
};

type SetErrorAction = {
    type: 'SET_ERROR';
    payload: {
        error: string | null;
    };
};

type Actions = SetUserAction | SetErrorAction | SetStatusAction;
export type Dispatch = (action: Actions) => void;
type State = {
    user: User | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    error: string | null;
};
type UserContextType = { state: State; dispatch: Dispatch };

const UserContext = React.createContext<UserContextType | undefined>(undefined);
UserContext.displayName = 'UserContext';

function reducer(state: State, action: Actions): State {
    switch (action.type) {
        case 'SET_STATUS':
            return {
                ...state,
                status: action.payload.status,
            };
        case 'SET_USER':
            return {
                user: action.payload.user,
                status: 'success',
                error: null,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload.error,
                status: 'error',
            };
        default:
            throw new Error(`Unhandled action type`);
    }
}

type UserProviderProps = { children: React.ReactNode };
export function UserProvider({ children }: UserProviderProps) {
    const [state, dispatch] = React.useReducer(reducer, {
        user: null,
        status: 'idle',
        error: null,
    });
    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = React.useContext(UserContext);

    if (context === undefined) {
        throw new Error(`useUser must be used within the UserProvider`);
    }

    return context;
}
