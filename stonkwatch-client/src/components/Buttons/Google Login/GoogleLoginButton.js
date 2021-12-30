import React, { useState } from "react";
import { useHistory } from "react-router";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import "./GoogleLoginButton.css";

//CLIENT-ID for the Google OAuth Operations
const clientId = "879228533147-5122ar9mm7lmcdfj98j8ba6hqogjqtpr.apps.googleusercontent.com";

//Functional Component implemented for the Google OAuth Sign-In Functionality
function GoogleLoginButton() {
  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const history = useHistory();

  //Function to handle successful google sign-in
  const onLoginSuccess = (res) => {
    //Setting Login and Logout buttons status
    setShowloginButton(false);
    setShowlogoutButton(true);

    history.push("/");
  };

  //Function to handle failed google sign-in
  const onLoginFailure = (res) => {
    console.log("[Login Failed] res:", res);
  };

  //Function to handle successful sign-out
  const onSignoutSuccess = () => {
    alert("You have been logged out successfully");
    console.clear();

    //Setting Login and Logout buttons status
    setShowloginButton(true);
    setShowlogoutButton(false);
  };

  return (
    <div>
      {showloginButton ? (
        <GoogleLogin
          className="G-signIn"
          clientId={clientId}
          buttonText="Log in with Google"
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          uxMode="popup"
          // redirectUri="http://localhost:3000/"
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      ) : null}

      {showlogoutButton ? (
        <GoogleLogout
          clientId={clientId}
          buttonText="Log Out"
          onLogoutSuccess={onSignoutSuccess}
        />
      ) : null}
    </div>
  );
}

export default GoogleLoginButton;
