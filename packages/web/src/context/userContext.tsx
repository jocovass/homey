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

type SetUserAction = {
    type: 'SET_USER';
    payload: {
        user: User | null;
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
        status: 'pending',
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

export const getCurrentUser = async (dispatch: Dispatch) => {
    try {
        const { data } = await axios.get('/users/current_user');
        dispatch({ type: 'SET_USER', payload: { user: data.data.user } });
    } catch (error: any) {
        dispatch({ type: 'SET_USER', payload: { user: null } });
    }
};

export const uploadProfilePicture = async ({
    file,
    dispatch,
}: {
    file: File;
    dispatch: Dispatch;
}) => {
    dispatch({ type: 'SET_STATUS', payload: { status: 'pending' } });
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const { data } = await axios.post(
            '/users/update_profile_image',
            formData,
        );

        dispatch({ type: 'SET_USER', payload: { user: data.data.user } });

        return data.data.user;
    } catch (error: any) {
        dispatch({
            type: 'SET_ERROR',
            payload: { error: 'Something went wrong.' },
        });
    }
};

export const updateProfile = async ({
    firstName,
    lastName,
    email,
    dispatch,
}: {
    firstName?: string;
    lastName?: string;
    email?: string;
    dispatch: Dispatch;
}) => {
    try {
        dispatch({ type: 'SET_STATUS', payload: { status: 'pending' } });

        const { data } = await axios.post('/users/update_profile', {
            firstName,
            lastName,
            email,
        });

        dispatch({ type: 'SET_USER', payload: { user: data.data.user } });
    } catch (error: any) {
        console.log(error);
    }
};

export const updatePassword = async ({
    currentPassword,
    password,
    passwordConfirm,
    dispatch,
}: {
    currentPassword: string;
    password: string;
    passwordConfirm: string;
    dispatch: Dispatch;
}) => {
    try {
        dispatch({ type: 'SET_STATUS', payload: { status: 'pending' } });
        const { data } = await axios.post('/users/update_password', {
            currentPassword,
            newPassword: password,
            passwordConfirm,
        });
        dispatch({ type: 'SET_STATUS', payload: { status: 'success' } });
        return data;
    } catch (error: any) {
        dispatch({ type: 'SET_STATUS', payload: { status: 'error' } });
        return Promise.reject(error.response.data);
    }
};
