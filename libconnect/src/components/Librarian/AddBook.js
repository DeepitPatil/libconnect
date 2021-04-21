import React, { useRef, useState } from "react"
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory, Redirect } from "react-router-dom"
import { Alert } from "react-bootstrap"
import firebase from '../../firebase'
import "firebase/database";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1532012197267-da84d127e765?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(5, 10),
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
  margin: {
    margin: theme.spacing(1),
  },
}));

const BootstrapInput = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }))(InputBase);

export default function SignUp() {
  const classes = useStyles();
  const [location, setLocation] = useState('')
  const [summary, setSummary] = useState('')
  const [publisher, setPublisher] = useState('')
  const [genre, setGenre] = useState('')
  const [ISBN, setISBN] = useState('')
  const [author, setAuthor] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [coverURL, setCoverURL] = useState('')

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [signedUp, setSignedUp] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
        setError("")
        setLoading(true)
        const DatabaseRef = firebase.database().ref("books");
        DatabaseRef.child(ISBN).child("title").set(bookTitle);
        DatabaseRef.child(ISBN).child("author").set(author);
        DatabaseRef.child(ISBN).child("isbn").set(ISBN);
        DatabaseRef.child(ISBN).child("genre").set(genre);
        DatabaseRef.child(ISBN).child("publisher").set(publisher);
        DatabaseRef.child(ISBN).child("location").set(location);
        DatabaseRef.child(ISBN).child("quantity").set(parseInt(quantity, 10));
        DatabaseRef.child(ISBN).child("availability").set(parseInt(quantity, 10));
        DatabaseRef.child(ISBN).child("summary").set(summary);
        DatabaseRef.child(ISBN).child("coverurl").set(coverURL);
        DatabaseRef.child(ISBN).child("rating").set(0);
        DatabaseRef.child(ISBN).child("numreviews").set(0);
        setSignedUp(true)
      
      
    } catch {
      setError("Failed to add book.")
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
              <center>Add a Book to the Library<br/><br/></center>
          </Typography>
          <Typography component="h1" variant="h5">
              <center>Please enter the book details</center>
          </Typography>
          {error && <Alert variant="danger">{error}</Alert>}
          {signedUp && <Redirect to="/librarian" />}
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              value={bookTitle}
              onChange={(e)=> setBookTitle(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="bookTitle"
              label="Book Title"
              name="Book Title"
              autoFocus
            />
            <TextField
              value={author}
              onChange={(e)=> setAuthor(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="author"
              label="Author"
              name="Author"
            />
            <TextField
              value={ISBN}
              onChange={(e)=> setISBN(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="ISBN"
              label="ISBN-13"
              name="ISBN"
            />
            <NativeSelect
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="genre"
              name="Genre"
              value={genre}
              onChange={(e)=> setGenre(e.target.value)}
              input={<BootstrapInput />}
            >
                <option aria-label="None" value="" >Genre</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Dystopian">Dystopian</option>
                <option value="Action & Adventure">Action & Adventure</option>
                <option value="Mystery">Mystery</option>
                <option value="Horror">Horror</option>
                <option value="Thriller & Suspense">Thriller & Suspense</option>
                <option value="Graphic Novel">Graphic Novel</option>
                <option value="Fiction">Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Poetry">Poetry</option>
                <option value="Biography">Biography</option>
                <option value="Children">Children</option>
                <option value="Self Help">Self Help</option>
                <option value="Travel">Travel</option>
                <option value="History">History</option>
                <option value="Crime">Crime</option>
                <option value="Humour">Humour</option>
                <option value="Religion & Spirituality">Religion & Spirituality</option>
                <option value="Science & Technology">Science & Technology</option>
                <option value="Humanities">Humanities</option>
            </NativeSelect>
            <TextField
              value={publisher}
              onChange={(e)=> setPublisher(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="publisher"
              label="Publisher"
              name="Publisher"
            />
            <TextField
              value={location}
              onChange={(e)=> setLocation(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="location"
              label="Location"
              name="Location"
            />
            <TextField
              value={coverURL}
              onChange={(e)=> setCoverURL(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="coverURL"
              label="Image address of book cover"
              name="coverURL"
            />
            <TextField
              value={quantity}
              onChange={(e)=> setQuantity(e.target.value)}
              onBlur={(e)=> {
                if(e.target.value>0){
                  setQuantity(e.target.value)
                }
                else{
                    setQuantity(1)
                }
              }}
              variant="outlined"
              margin="normal"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              required
              fullWidth
              id="quantity"
              label="Quantity"
              name="quantity"
            />
            <TextField
              value={summary}
              onChange={(e)=> setSummary(e.target.value)}
              variant="outlined"
              margin="normal"
              multiline
              required
              fullWidth
              rowsMax="4"
              id="summary"
              label="Summary"
              name="Summary"
            />
            <Button
              disabled={loading}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Add Book
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}