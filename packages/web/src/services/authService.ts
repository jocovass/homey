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
        throw error.response.data;
    }
};
