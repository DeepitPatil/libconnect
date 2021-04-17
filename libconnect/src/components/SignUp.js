import React, { useState } from "react"
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory, Redirect } from "react-router-dom"
import { Alert } from "react-bootstrap"
import firebase from '../firebase'
import "firebase/database";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1577985051167-0d49eec21977?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3425&q=80)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(25, 10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 4),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const [emailID, setEmail] = useState('')
  const [password_one, setPasswordOne] = useState('')
  const [password_two, setPasswordTwo] = useState('')
  const [Username, setUsername] = useState('')

  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [signedUp, setSignedUp] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (password_one !== password_two) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailID, password_one)
      //history.push("/")
      const DatabaseRef = firebase.database().ref("users");
      const dict = {
        username: Username,
        type: "member",
      };
      DatabaseRef.push(dict);
      setSignedUp(true)
      
    } catch {
      setError("Failed to create an account")
    }
    

    setLoading(false)
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h3">
              <center>Welcome to LibConnect<br/><br/></center>
          </Typography>
          <Typography component="h1" variant="h5">
              <center>Please Sign Up</center>
          </Typography>
          {error && <Alert variant="danger">{error}</Alert>}
          {signedUp && <Redirect to="/signin" />}
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              value={Username}
              onChange={(e)=> setUsername(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="Username"
              autoFocus
            />
            <TextField
              value={emailID}
              onChange={(e)=> setEmail(e.target.value)}
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
              onChange={(e)=> setPasswordOne(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="passwordRef"
              autoComplete="current-password"
            />
            <TextField
              value={password_two}
              onChange={(e)=> setPasswordTwo(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Confirm Password"
              type="password"
              id="passwordConfirmRef"
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
              Sign Up
            </Button>
            <center>
            <Link to="/signin" variant="body2">
                {"Already have an account? Sign in"}
            </Link>
            </center>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}