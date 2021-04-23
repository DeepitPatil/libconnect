import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React, { useRef, useState } from "react"
import { Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory, Redirect } from "react-router-dom"
import {provider} from '../firebase';
import firebase from "../firebase"
import "firebase/auth";
import './App.css'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1741&q=80)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(35, 10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 4),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [emailID, setEmail] = useState('')
  const [password_one, setPassword] = useState('')

  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    

    try {
      setError("")
      setLoading(true)
      await login(emailID, password_one)
      setLoggedIn(true)
      window.location.reload()
    } catch {
      setError("Failed to log in")
    }
    setLoading(false)
    
  }

  function handleGoog(){
    firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    setLoggedIn(true)
    window.location.reload()
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
  
  }

  return (
    <Grid container component="main" className={classes.root} style={{marginTop:"-3vh"}}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h3">
              <center>Welcome to LibConnect<br/><br/></center>
          </Typography>
          <Typography component="h1" variant="h5">
              <center>Please Sign In</center>
          </Typography>
          {error && <Alert variant="danger">{error}</Alert>}
          {loggedIn && <Redirect to="/home/s=" />}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              value={emailID}
              onChange={(e)=> setEmail(e.target.value)}
              ref={emailRef}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              value={password_one}
              onChange={(e)=> setPassword(e.target.value)}
              ref={passwordRef}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              disabled={loading}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to='/sign-up' variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              
            </Grid>
          </form>
          <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />

          <div class="google-btn" onClick={handleGoog}>
            <div class="google-icon-wrapper">
              <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
            </div>
            <p class="btn-text" style={{userSelect:'none'}}><b>Sign in with google</b></p>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}