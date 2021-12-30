import React, {useState} from 'react';
import { Button,Container,Navbar } from 'react-bootstrap';
import userIcon from '../Images/userIcon.png'
import { useHistory } from 'react-router';
import { Grid, Paper, TextField } from '@mui/material';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// INCOMPLETE IMPLEMENTATION: Component implemented for user sign-up page
const SignUp = () => {
    const paperStyle = {padding: 20, height: '70vh', width:600, margin:"20px auto"}
    const [userFullNameReg, setUserFullNameReg] =useState("");
    const [userEmailReg, setUserEmailReg] =useState("");
    const [passwordReg, setPasswordReg] =useState("");
    let history = useHistory();
    toast.configure()

    // Function to handle user sign-up 
    const register = async () =>{

        // Implementing validation to check whether the details input are empty or not
        if((userFullNameReg!=='') && (userEmailReg!=='') && (passwordReg!=='')){
            let result = axios.post('http://localhost:8080/api/authentication/register',{
            fullName: userFullNameReg,
            emailID: userEmailReg,
            password: passwordReg
            }).catch((err) => {
                console.log(err);
            });
            toast.success('User has been succesfully registered',
            {position: toast.POSITION.BOTTOM_CENTER})
        }
        else{
            toast.warning('Fields cannot be empty!',
           {position: toast.POSITION.BOTTOM_CENTER})
        }
    };

    // Function to handle user redirect to previous page
    const previousPage = () =>{
        history.push('/login')
    }

    return (
        <div className="login">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
               <Container>
                   <Navbar.Brand href="/">StonkWatch</Navbar.Brand>
               </Container>
           </Navbar>
           <div className="loginBody">
               <Grid textAlign="center">
                   <Paper elevation={10} className="Paper" style={paperStyle}>
                
                       <Grid textAlign="center" marginTop="50px">
                           <img className="icon-image" src={userIcon} alt="image"></img>
                           <h2>Sign Up</h2>
                           <h5>Please complete this form to register and get started!</h5>
                           <br></br>
                           <br></br>
                       </Grid>
                       <br></br>
                       <form>
                            <TextField 
                                label="Full Name" margin="20px"           
                                onChange={(e)=> {
                                    setUserFullNameReg(e.target.value);
                                }}
                                placeholder="Enter your full name" 
                                fullWidth required 
                            />
                            <br></br>
                            <br></br>
                            <TextField 
                                label="Email ID" 
                                margin="20px" 
                                onChange={(e)=> {
                                    setUserEmailReg(e.target.value);
                                }}
                                placeholder="Enter your email ID" 
                                fullWidth required 
                            />
                            <br></br>
                            <br></br>
                            <TextField 
                                label="Password" 
                                placeholder="Enter a password" 
                                type='password' 
                                fullWidth required
                                onChange={(e)=> {
                                    setPasswordReg(e.target.value);
                                }}
                            />
                            <br></br>
                            <br></br>
                            <div className="signUpFormButton">
                                <Button type ="submit" color="primary" onClick={register} fullWidth required >Register</Button>
                                <Button type ="submit" color="danger" onClick={previousPage} fullWidth required >Go back</Button>
                            </div>
                            <br></br>
                            <br></br>
                        </form>
                   </Paper>
               </Grid>

            </div>
        </div>
    );
};

export default SignUp;