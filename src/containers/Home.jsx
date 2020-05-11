import React from "react";
import { useAuth0 } from "../auth0-spa.jsx";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => {
    const { isAuthenticated, loginWithRedirect, logout, loading } = useAuth0();
    const handleLoginClick = () => {
        loginWithRedirect({ returnTo: window.location.origin + "/map" });
    };
    const logoutClickHandle = () => {
        logout({ returnTo: window.location.origin });
    };
    if (loading) return <div>loading...</div>;
    return (
        <div className="home">
            {isAuthenticated ? (
                <div className="home-btns">
                    <Link to="/map">View map</Link>
                    <div className="logout-btn" onClick={logoutClickHandle}>
                        Logout
                    </div>
                </div>
            ) : (
                <div className="login-btn" onClick={handleLoginClick}>
                    Login
                </div>
            )}
        </div>
    );
};

export default Home;
