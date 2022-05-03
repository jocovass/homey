import axios from '../util/axios';
import { Dispatch } from '../context/userContext';

export const login = async ({
    email,
    password,
    dispatch,
}: {
    email: string;
    password: string;
    dispatch: Dispatch;
}) => {
    try {
        const { data } = await axios.post(`/users/login`, {
            email,
            password,
        });

        dispatch({
            type: 'SET_USER',
            payload: {
                user: data.data.user,
            },
        });

        return data;
    } catch (error: any) {
        return Promise.reject(error.response.data);
    }
};

export const signup = async ({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    dispatch,
}: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
    dispatch: Dispatch;
}) => {
    try {
        const { data } = await axios.post('/users/signup', {
            email,
            firstName,
            lastName,
            password,
            passwordConfirm,
        });

        dispatch({
            type: 'SET_USER',
            payload: {
                user: data.data.user,
            },
        });

        return data;
    } catch (error: any) {
        return Promise.reject(error.response.data);
    }
};

export const logout = async ({
    dispatch,
}: {
    dispatch: Dispatch;
}): Promise<void> => {
    try {
        await axios.post(`/users/logout`);
        dispatch({ type: 'SET_USER', payload: { user: null } });
        return;
    } catch (error: any) {
        console.log(error.response);
        return;
    }
};
