import React from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Authenticated from '../Authenticated/Authenticated';
import UnAuthenticated from '../UnAuthenticated/UnAuthenticated';

function App() {
    const navigateTo = useNavigate();

    return (
        <div className="bg-background">
            <nav>
                <Link to="/account">account</Link>
                {'  '}
                <Link to="/">login</Link>
            </nav>
            <Routes>
                <Route path="/" element={<UnAuthenticated />} />
                <Route path="/account" element={<Authenticated />} />
            </Routes>
        </div>
    );
}

export default App;
