import { useAuth } from '../../context/authContext';

export const Homepage = () => {
    const { state, dispatch } = useAuth();
    return (
        <>
            <h1>Homepage</h1>
            <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
    );
};
