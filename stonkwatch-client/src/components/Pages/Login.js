import React, {useEffect, useState} from 'react';
import { Button,Col,Container,Form,Row,Navbar } from 'react-bootstrap';
import userIcon from '../Images/userIcon.png'
import GoogleLoginButton from '../Buttons/Google Login/GoogleLoginButton';
import { Grid, Paper, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import axios from 'axios';

// INCOMPLETE IMPLEMENTATION - Component implemented for user sign-in page
const Login = () => {
   const [userEmail, setUserEmail] =useState("");
   const [password, setPassword] =useState("");
   var [userName,setUserName] = useState("");
   const [status,setStatus] = useState(false);
   let history = useHistory();

   const paperStyle = {padding: 20, height: '65vh', width:600, margin:"20px auto"};
   axios.defaults.withCredentials = true;
   
   // Function to handle sign-in    
   const login = () =>{
       axios.post('http://localhost:8080/api/authentication/login',{
         emailID: userEmail,
         password: password
       }).then((response)=>{
   
            console.log(response);
            
       });
   };

   // Function to handle sign-out   
   const logout = async() =>{
        axios.get('http://localhost:8080/api/authentication/logout').then((response)=>{
            console.log(response);
        });
    };

    return (

        <div className="login">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
               <Container>
                   <Navbar.Brand href="/">StonkWatch</Navbar.Brand>
               </Container>
           </Navbar>

           {(status!=true)?
                    <div className="loginTitle">
                       <h1 className="loginTitle">Welcome to StonkWatch!</h1>
                       <div className="loginBody">
                       <Grid textAlign="center">
                           <Paper elevation={10} style={paperStyle}>
                               <Grid textAlign="center" marginTop="50px">
                                   <img className="icon-image" src={userIcon} alt="image"></img>
                                   <h2>Sign In</h2>
                               </Grid>
                               <br></br>
                              <TextField 
                                   label="Email ID" 
                                   margin="20px" 
                                   placeholder="Enter email" 
                                   onChange={(e)=> {
                                       setUserEmail(e.target.value);
                                   }}
                                   fullWidth required ></TextField>
                              <br></br>
                              <br></br>
                              <TextField 
                                   label="Password" 
                                   placeholder="Enter password" 
                                   type='password' 
                                   onChange={(e)=> {
                                       setPassword(e.target.value);
                                   }}
                                   fullWidth required
                               ></TextField>
                              <br></br>
                              <br></br>
                              <Button type ="submit" color="primary" onClick={login} fullWidth required>Sign In</Button>
                              <br></br>
                              <br></br>
                              <Form>
                                   <GoogleLoginButton></GoogleLoginButton>  
                                   <br></br>
                              </Form>
                              <p>Dont have an account? Click here to <Link to="/sign-up"> Sign Up</Link></p>
                           </Paper>
                       </Grid>
                       </div>
                    </div>
            
            :
            <div className="loginTitle A">
                <h1>Welcome to your dashboard,{userName}</h1>
                <button onClick={logout}>Sign Out</button>
            </div>
            }           
        </div>
    );
};

export default Login;