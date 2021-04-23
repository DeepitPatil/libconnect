import React, { Component } from 'react';
import BookCard from './BookCard.js'
import { Grid, TextField } from '@material-ui/core'
import { Link, Redirect, useHistory } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import firebase from '../../firebase'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NativeSelect from '@material-ui/core/NativeSelect';
import "firebase/database";
import { Button } from 'react-bootstrap';

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

class EditBook extends Component {
    constructor(props){
        super(props);
        var res = new Date();
        res.setDate(res.getDate()+7)
        this.state = {
            title: "",
            author: "",
            coverurl: "",
            summary: "",
            location: "",
            quantity: 0,
            availability: 0,
            genre: "",
            isbn: "",
            publisher: "",
            date: res,
            returnBy: "error",
            timestamp: "error",
            red: false,
            status: "none",
            eligible: true,
          };
        if(localStorage.getItem('type')==="admin" || localStorage.getItem('type')==="librarian"){
            this.setState({eligible:true})
        }else{
            this.setState({eligible:false})
        }
        
          const rootRef = firebase.database().ref("books");
        const rref = rootRef.child(this.props.match.params.isbn);
        
        rref.once("value")
        .then((snapshot) => {
            this.setState({
                title: snapshot.child("title").val(),
                author: snapshot.child("author").val(),
                genre: snapshot.child("genre").val(),
                summary: snapshot.child("summary").val(),
                location: snapshot.child("location").val(),
                coverurl: snapshot.child("coverurl").val(),
                quantity: snapshot.child("quantity").val(),
                availability: snapshot.child("availability").val(),
                isbn: snapshot.child("isbn").val(),
                publisher: snapshot.child("publisher").val(),
               });
        });
    };

    componentDidMount(){
        
    }
    
           render() {
               return(
                   <div>
                        {!this.state.eligible && <Redirect to="/home/s=" />}
                        <div style={{ display: "flex", flexDirection:"row", justifyContent: "space-evenly"}}>
                        <img
                                style={{width:"30vw", marginTop:"50px", borderRadius:"15px", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", WebkitFilter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017))", filter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017)"
                            }}
                                alt='Book Cover'
                                src={this.state.coverurl}
                                />
                                {this.state.red && <Redirect to={"/books/"+this.props.match.params.isbn}/>}
                            <p style={{margin: "50px 0 0 0", maxWidth: "40vw"}}>
                                <TextField
                                value={this.state.title}
                                onChange={(e)=>this.setState({title: e.target.value})}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                label="Book Title"
                                />
                                <TextField
                                value={this.state.author}
                                onChange={(e)=>this.setState({author: e.target.value})}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                label="Author"
                                />
                                <NativeSelect
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="genre"
                                name="Genre"
                                value={this.state.genre}
                                onChange={(e)=> this.setState({genre: e.target.value})}
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
                                value={this.state.publisher}
                                onChange={(e)=>this.setState({publisher: e.target.value})}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                label="Publisher"
                                />
                                <TextField
                                value={this.state.coverurl}
                                onChange={(e)=>this.setState({coverurl: e.target.value})}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                label="Image Address of Book Cover"
                                />
                                <TextField
                                value={this.state.location}
                                onChange={(e)=>this.setState({location: e.target.value})}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                label="Location"
                                />
                                <TextField
                                value={this.state.quantity}
                                onChange={(e)=> this.setState({quantity: e.target.value})}
                                onBlur={(e)=> {
                                    if(e.target.value>0){
                                        this.setState({quantity: e.target.value})
                                    }
                                    else{
                                        this.setState({quantity: 1})
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
                                value={this.state.summary}
                                onChange={(e)=>this.setState({summary: e.target.value})}
                                variant="outlined"
                                margin="normal"
                                multiline
                                rowsMax='4'
                                fullWidth
                                required
                                label="Summary"
                                />
                            
                            {(localStorage.getItem('type')==="admin" || localStorage.getItem('type')==="librarian") && <Button variant="success" style={{marginTop:"20px"}} onClick={()=>{
                                const DatabaseRef = firebase.database().ref("books");
                                DatabaseRef.child(this.props.match.params.isbn).child("title").set(this.state.title);
                                DatabaseRef.child(this.props.match.params.isbn).child("author").set(this.state.author);
                                DatabaseRef.child(this.props.match.params.isbn).child("genre").set(this.state.genre);
                                DatabaseRef.child(this.props.match.params.isbn).child("publisher").set(this.state.publisher);
                                DatabaseRef.child(this.props.match.params.isbn).child("location").set(this.state.location);
                                DatabaseRef.child(this.props.match.params.isbn).child("quantity").set(parseInt(this.state.quantity, 10));
                                DatabaseRef.child(this.props.match.params.isbn).child("availability").set(parseInt(this.state.quantity, 10));
                                DatabaseRef.child(this.props.match.params.isbn).child("summary").set(this.state.summary);
                                DatabaseRef.child(this.props.match.params.isbn).child("coverurl").set(this.state.coverurl);
                                const dataRef = firebase.database().ref("requests");
                                dataRef.once('value').then((snap)=>{
                                  snap.forEach(child=>{
                                    if(child.val().isbn===this.props.match.params.isbn){
                                      child.ref.update({
                                        title: this.state.title,
                                        author: this.state.author,
                                        coverurl: this.state.coverurl
                                      })
                                    }
                                  })
                                })
                                this.setState({red: true})
                            }}>Save</Button>}
                            {(localStorage.getItem('type')==="admin" || localStorage.getItem('type')==="librarian") && <Button variant="danger" style={{marginLeft:"20px", marginTop:"20px"}} onClick={()=>this.setState({red: true})}>Cancel</Button> }
                            </p>
                   </div>
                </div>
               )
           }
}
export default EditBook;