import React, { Component } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import {
  GoogleLogin,
  GoogleLogout
} from "react-google-login";
import "./Navbar.css";
import Button from "@mui/material/Button";
import axios from "axios";

//CLIENT-ID for the Google OAuth Operations
const clientId ="879228533147-5122ar9mm7lmcdfj98j8ba6hqogjqtpr.apps.googleusercontent.com";

// Database endpoint for retrieving the user data from the back-end
const dbAPI = axios.create({
  baseURL: `http://localhost:8080/api`,
});


// Class Component implemented for the Navigation Bar
class Nav_bar extends Component {
  state = {
    clicked: false,
    user: {},
    showloginButton: true,
    showlogoutButton: false,
    userName: "",
    status: false,
    render: false
  };

  constructor(props) {
    super(props);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLoginFailure = this.onLoginFailure.bind(this);
    this.onSignoutSuccess = this.onSignoutSuccess.bind(this);
  }

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  //Function to handle successful google sign-in
  onLoginSuccess = (res) => {
    console.log("[Login Success] Signed in as: ", res.profileObj.name);
    localStorage.setItem("userProfile", JSON.stringify(res.profileObj));
    this.setState({ user: res.profileObj });
    this.setState({ showloginButton: false });
    this.setState({ showlogoutButton: true });
    var result = this.checkUser(res.profileObj.email, res.profileObj.name);
  };

  //Function to handle failed google sign-in
  onLoginFailure = (res) => {
    console.log("[Login Failed] response:", res);
  };

  //Function to handle successful sign-out
  onSignoutSuccess = () => {
    alert("You have been logged out successfully");
    console.clear();
    localStorage.clear();
    if (localStorage.getItem("userProfile") == null) {
      let object = {
        email: "",
        familyName: "",
        givenName: "",
        googleId: "",
        imageUrl: "",
        name: "",
      };
      // Resetting userProfile object in localStorage
      localStorage.setItem("userProfile", JSON.stringify(object));
      localStorage.setItem("CurrentUserID", 0);
    }
    this.setState({ user: "" });
    this.setState({ showloginButton: true });
    this.setState({ showlogoutButton: false });
  };

  // Function for checking if the user exists in the database
  checkUser = async (emailID, name) => {
    var res = true;
    let result = await dbAPI
      .get(`/users/check/${emailID}`)
      .then((data) => {
        res = data.data;
        if (!res) {
          this.createUser(emailID, name);
        }
      })
      .then((data) => {
        this.setCurrentUser();
      });
    return res;
  };

  // Function for adding a new user to the database
  createUser = async (emailID, fullName) => {
    let res = await dbAPI.post("/users", {
      user_id: 0,
      email_id: emailID,
      full_name: fullName,
    });
    console.log(res);
  };

  // Function for retreiving the id of the currently logged in user
  setCurrentUser = async () => {
    const profileObj = JSON.parse(localStorage.getItem("userProfile"));
    const userEmail = profileObj.email;
    localStorage.setItem("CurrentUserID", 0);
    let currentUserId = await dbAPI
      .get(`/users?emailID=${userEmail}`)
      .then(({ data }) => data[0].user_id )
    localStorage.setItem("CurrentUserID", currentUserId);
  };

  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">StonkWatch</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" />
            <Nav className="mr-auto">
              <Nav.Link href="/">Dashboard</Nav.Link>
              <Nav.Link href="/portfolio">Portfolio</Nav.Link>
              <Nav.Link href="/news">News</Nav.Link>
              <NavDropdown title="Trending" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/trending/tickers">
                  Stock tickers
                </NavDropdown.Item>
              </NavDropdown>
              <br />
              <NavDropdown title="Profile" id="collasible-nav-dropdown">
                <NavDropdown.Item>
                  {this.state.user && this.state.user.name
                    ? `Signed in as: ${
                        this.state.user && this.state.user.name
                      } `
                    : "Not signed in"}
                </NavDropdown.Item>
              </NavDropdown>
              {this.state.showloginButton ? (
                <GoogleLogin
                  className="G-signIn"
                  clientId={clientId}
                  onSuccess={this.onLoginSuccess}
                  onFailure={this.onLoginFailure}
                  uxMode="popup"
                  render={(renderProps) => (
                    <Button
                      className="signOut"
                      variant="outlined"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Sign-in
                    </Button>
                  )}
                  cookiePolicy={"single_host_origin"}
                  isSignedIn={true}
                />
              ) : null}
              {this.state.showlogoutButton ? (
                <GoogleLogout
                  clientId={clientId}
                  buttonText="Log Out"
                  onLogoutSuccess={this.onSignoutSuccess}
                  render={(renderProps) => (
                    <Button
                      className="signOut"
                      variant="outlined"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Sign Out
                    </Button>
                  )}
                />
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Nav_bar;
