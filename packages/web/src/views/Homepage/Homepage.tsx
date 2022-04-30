import { useUser } from '../../context/userContext';

export const Homepage = () => {
    const { state } = useUser();
    return (
        <>
            <h1>Homepage</h1>
            <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
    );
};
