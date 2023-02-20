import React from 'react';
import { Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Header from './Header';
import { Redirect } from 'react-router-dom';
const Home = (props) => {
    const {
        REACT_APP_CLIENT_ID2,
        REACT_APP_AUTHORIZE_URL2,
        REACT_APP_REDIRECT_URL2
    } = process.env;
    const REACT_APP_CLIENT_ID='638167eba6cc437ea6dcc6b82671b53a';
      const  REACT_APP_AUTHORIZE_URL='https://accounts.spotify.com/authorize';
       const REACT_APP_REDIRECT_URL='http://localhost:3000/redirect';
    const scopes = encodeURIComponent('playlist-modify-private playlist-modify-public');
    const handleLogin = () => {
        window.location = `${REACT_APP_AUTHORIZE_URL}?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_REDIRECT_URL}&response_type=token&show_dialog=true&scope=${scopes}`;
    };
    const { isValidSession, location } = props;
    const { state } = location;
    const sessionExpired = state && state.session_expired;

    return (
        <React.Fragment>
            {isValidSession() ? (
                <Redirect to="/dashboard" />
            ) : (
                <div className="login">
                    <Header />
                    {sessionExpired && (
                        <Alert variant="info">Session expired. Please login again.</Alert>
                    )}
                    <Button variant="info" type="submit" onClick={handleLogin}>
                        Login to spotify
                    </Button>
                </div>
            )}
        </React.Fragment>
    );
};
export default Home;