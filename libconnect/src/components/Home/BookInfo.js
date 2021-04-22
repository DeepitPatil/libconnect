import React, { Component } from 'react';
import Rating from '@material-ui/lab/Rating';
import { Link, Redirect, useHistory } from 'react-router-dom';
import firebase from '../../firebase'
import DatePicker from "react-datepicker";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import "react-datepicker/dist/react-datepicker.css";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import "firebase/database";
import { Button } from 'react-bootstrap';
import { TextField } from '@material-ui/core';

class BookInfo extends Component {
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
            publisher: "",
            quantity: 0,
            availability: 0,
            rating: 0,
            numreviews: 0,
            userrating: 0,
            userreview: "",
            genre: "",
            isbn: "",
            date: res,
            returnBy: "error",
            timestamp: "error",
            red: false,
            red2: false,
            rev: false,
            status: "none",
            anonymous: false,
            post: null,
            emails: [],
            ratings: [],
            reviews: [],
            timestamps: [],
            revreq: false,
          };
    };

    handleDelete(usersRating, timestamp){
        if(window.confirm("Are you sure you want to delete this review? This action is irreversible.")){
            var oldRat = (this.state.numreviews*this.state.rating-usersRating)/(this.state.numreviews-1)
            firebase.database().ref("books").child(this.props.match.params.isbn).child("rating").set(oldRat)
            firebase.database().ref('books').child(this.props.match.params.isbn).child('numreviews').set(this.state.numreviews-1)
            firebase.database().ref("books").child(this.props.match.params.isbn).child("reviews").child(timestamp).remove()
            this.setState({rating: oldRat, numreviews: (this.state.numreviews-1), })
            window.location.reload()
        }
    }

    componentDidMount(){
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
                publisher: snapshot.child("publisher").val(),
                availability: snapshot.child("availability").val(),
                rating: snapshot.child("rating").val(),
                numreviews: snapshot.child("numreviews").val(),
                isbn: snapshot.child("isbn").val(),
               });
        });

        const post = firebase.database().ref("books").child(this.props.match.params.isbn).child("reviews").orderByKey()
        post.once('value', snap => {
            snap.forEach(child => {
                if(child.val().anonymous){
                     this.setState({emails: this.state.emails.concat(["Anonymous"])})
                }else{
                    this.setState({emails: this.state.emails.concat([child.val().email])})
                }
                this.setState({
                 ratings: this.state.ratings.concat([child.val().rating]),
                 reviews: this.state.reviews.concat([child.val().review]),
                 timestamps: this.state.timestamps.concat([child.val().createdAt]),
                });
                if(child.val().uid===localStorage.getItem('uid'))
                    this.setState({rev: true})
     
                const postList = this.state.emails.map((dataList, index) =>
                <div>
                <div style={{display:"flex", flexDirection:"row", width:"70vw", marginTop:"15px"}}>
                    <div style={{display:"flex", flexDirection:"column", width:"70vw",}}>
                        <h3>{this.state.emails[index]}</h3>
                        <Rating size="large" value={this.state.ratings[index]} readOnly /><br/>
                        <h5 style={{marginLeft:"15px", marginTop:"-10px"}}>{this.state.reviews[index]}</h5>
                        
                    </div>
                    {localStorage.getItem('type')==="admin" && <IconButton style={{height:"50px", width:"50px"}} aria-label="delete" onClick={()=>this.handleDelete(this.state.ratings[index], this.state.timestamps[index])}>
                        <DeleteIcon />
                    </IconButton>}
                    
                </div>
                <hr  style={{
                            color: '#000000',
                            backgroundColor: '#000000',
                            height: "1px",
                            borderColor : '#000000'
                        }}/>
                </div>
                
     
                 );
     
                 this.setState({
                     post: postList
                 });
            });
        });

        const dataRef = firebase.database().ref("users").child(localStorage.getItem('uid')).child("books")
        dataRef.once("value")
        .then((snapshot)=> {
          if(snapshot.hasChild(this.state.isbn)){
            this.setState({status: snapshot.child(this.state.isbn).child("status").val(), returnBy:snapshot.child(this.state.isbn).child("date").val(), timestamp:snapshot.child(this.state.isbn).child("createdAt").val()})
          }})
    }
    
           render() {
               return(
                   <div style={{display:"flex", flexDirection:"column"}}>
                        <div style={{ display: "flex", flexDirection:"row", justifyContent: "space-evenly"}}>
                        <img
                                style={{width:"30vw", height:'48vw', marginTop:"50px", borderRadius:"15px", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", WebkitFilter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017))", filter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017)"
                            }}
                                alt='Book Cover'
                                src={this.state.coverurl}
                                />
                                {this.state.red && <Redirect to="/home/s="/>}
                                {this.state.red2 && <Redirect to={"/edit/"+this.state.isbn}/>}
                            <p style={{margin: "50px 0 0 0", maxWidth: "40vw"}}>
                                <h1 style={{textAlign: "left"}}>{this.state.title}</h1>
                                <h3>{"by "+this.state.author}</h3><br/>
                                {this.state.numreviews===0 && <p><h5>No reviews yet</h5><br/></p>}
                                {this.state.numreviews!==0 && <div style={{display:"flex", alignItems:"center"}}>{<p><Rating size="large" value={this.state.rating} precision={0.5} readOnly /></p>}
                                    <p style={{marginLeft:"10px"}}>{this.state.numreviews+" reviews"}</p>
                                </div>}
                                
                                <h5 >{"ISBN-13 : "+this.state.isbn}</h5>
                                <h5 >{"Published by "+this.state.publisher}</h5><br/>
                                <h4 >{this.state.genre}</h4><br/>
                                <h7>{this.state.summary}</h7><br/><br/>
                                <h5 >{this.state.availability+" copies available in "+this.state.location}</h5>
                                <div style={{ display: "flex", flexDirection:"row", marginTop:"5vh"}}>
                                {!this.state.revreq &&localStorage.getItem('type')==="member" && this.state.status !== "pending" && <DatePicker dateFormat="dd/MM/yyyy" selected={this.state.date} onChange={date => this.setState({date: date})}/>}
                                {!this.state.revreq &&localStorage.getItem('type')==="member" && (this.state.status==="none" || this.state.status==="rejected") && <Button variant="outline-dark" style={{ marginTop:'-5px', marginLeft:"10px"}} onClick={()=>{
                                    const timestamp = Date.now();
                                    firebase.database().ref().child("requests").child(timestamp).set({
                                        uid: localStorage.getItem('uid'),
                                        email: localStorage.getItem('email'),
                                        isbn: this.state.isbn,
                                        coverurl: this.state.coverurl,
                                        title: this.state.title,
                                        author: this.state.author,
                                        date: this.state.date.getDate()+'/'+(parseInt(this.state.date.getMonth(), 10)+1).toString()+'/'+this.state.date.getFullYear(),
                                        createdAt: timestamp,
                                        status: 'pending',
                                    });
                                    firebase.database().ref().child("users").child(localStorage.getItem('uid')).child("requests").child(timestamp).set({
                                        uid: localStorage.getItem('uid'),
                                        email: localStorage.getItem('email'),
                                        isbn: this.state.isbn,
                                        coverurl: this.state.coverurl,
                                        title: this.state.title,
                                        author: this.state.author,
                                        date: this.state.date.getDate()+'/'+(parseInt(this.state.date.getMonth(), 10)+1).toString()+'/'+this.state.date.getFullYear(),
                                        createdAt: timestamp,
                                        status: 'pending',
                                    });
                                    firebase.database().ref().child("users").child(localStorage.getItem('uid')).child("books").child(this.state.isbn).set({
                                        date: this.state.date.getDate()+'/'+(parseInt(this.state.date.getMonth(), 10)+1).toString()+'/'+this.state.date.getFullYear(),
                                        status: 'pending',
                                        createdAt: timestamp,
                                    });
                                    firebase.database().ref('books').child(this.state.isbn).child('availability').set(this.state.availability-1)
                                    this.setState({status: "pending"})
                                }}>Borrow Now</Button>}
                                {!this.state.revreq &&localStorage.getItem('type')==="member" && this.state.status==="accepted" && <Button variant="outline-dark" style={{ marginTop:'-5px', marginLeft:"10px"}} onClick={()=>{
                                    const timestamp = Date.now();
                                    firebase.database().ref().child("requests").child(timestamp).set({
                                        uid: localStorage.getItem('uid'),
                                        email: localStorage.getItem('email'),
                                        isbn: this.state.isbn,
                                        coverurl: this.state.coverurl,
                                        title: this.state.title,
                                        author: this.state.author,
                                        date: this.state.date.getDate()+'/'+(parseInt(this.state.date.getMonth(), 10)+1).toString()+'/'+this.state.date.getFullYear(),
                                        createdAt: timestamp,
                                        status: 'pending',
                                    });
                                    firebase.database().ref().child("users").child(localStorage.getItem('uid')).child("requests").child(timestamp).set({
                                        uid: localStorage.getItem('uid'),
                                        email: localStorage.getItem('email'),
                                        isbn: this.state.isbn,
                                        coverurl: this.state.coverurl,
                                        title: this.state.title,
                                        author: this.state.author,
                                        date: this.state.date.getDate()+'/'+(parseInt(this.state.date.getMonth(), 10)+1).toString()+'/'+this.state.date.getFullYear(),
                                        createdAt: timestamp,
                                        status: 'pending',
                                    });
                                    firebase.database().ref().child("users").child(localStorage.getItem('uid')).child("books").child(this.state.isbn).set({
                                        date: this.state.date.getDate()+'/'+(parseInt(this.state.date.getMonth(), 10)+1).toString()+'/'+this.state.date.getFullYear(),
                                        status: 'pending',
                                    });
                                    this.setState({status: "pending"})
                                }}>Renew Issuance</Button>}
                                {!this.state.revreq &&this.state.status==="accepted" && localStorage.getItem('type')==="member" && <Button variant="outline-success" style={{ marginTop:'-5px', marginLeft:"10px"}} onClick={()=>{
                                    firebase.database().ref("users").child(localStorage.getItem('uid')).child("books").child(this.state.isbn).child('status').set('none')
                                    firebase.database().ref("users").child(localStorage.getItem('uid')).child("books").child(this.state.isbn).child('createdAt').get().then((snapshot)=>{
                                        console.log(snapshot.val())
                                        firebase.database().ref("requests").child(snapshot.val()).child("status").set("none");
                                        firebase.database().ref("users").child(localStorage.getItem('uid')).child("requests").child(snapshot.val()).child("status").set("none");
                                        firebase.database().ref('books').child(this.state.isbn).child('availability')
                                        .transaction((searches)=> {
                                            if (searches) {
                                            searches = searches + 1;
                                            }
                                            return searches;
                                        });
                                    })
                                    
                                    this.setState({status:"none"})
                                }}>Return Book</Button>}
                                {!this.state.revreq &&localStorage.getItem('type')==="member" && this.state.status==="pending" && <div><div style={{ borderRadius:"5px", color:"white", backgroundColor:"orange", width:"150px", padding:"5px", textAlign:"center", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)"}} >Request Pending</div><div style={{marginTop:"15px", color:"orange"}}>Please wait for the librarian to approve your request.</div></div>}
                                </div>
                                {!this.state.revreq &&localStorage.getItem('type')==="member" && this.state.status==="rejected" && <div style={{ marginTop:'15px',  color:"red", padding:"5px", textAlign:"left",}} >Request Rejected</div>}
                                {!this.state.revreq &&localStorage.getItem('type')==="member" && this.state.status==="accepted" && <div style={{ marginTop:'15px',  color:"green",  textAlign:"left", }} >Request Accepted. Please return by {this.state.returnBy}</div>}  
                                {!this.state.revreq &&(localStorage.getItem('type')==="admin" || localStorage.getItem('type')==="librarian") && <Button variant="primary" onClick={()=>this.setState({red2: true})}>Edit Book</Button>}
                                {false && !this.state.revreq &&(localStorage.getItem('type')==="admin" || localStorage.getItem('type')==="librarian") && <Button variant="danger" style={{marginLeft:"20px"}} onClick={()=>{
                                    var b = window.confirm("Are you sure you want to delete this book? This action cannot be reversed.")
                                    if(b){
                                    firebase.database().ref('books').child(this.state.isbn).remove()
                                    this.setState({red: true})
                                }
                                }}>Delete Book</Button>}{!this.state.revreq &&<br/>}
                                {!this.state.rev && !this.state.revreq && (localStorage.getItem('type')==="member" || localStorage.getItem('type')==="librarian" || localStorage.getItem('type')==="admin") && <Button variant="success" style={{marginTop:"20px"}} onClick={()=>this.setState({revreq: true})}>Add Book Review</Button>}
                                {this.state.revreq && <div style={{marginTop:"-3.5vh"}}>
                                    <h4>Add your Review</h4>
                                    <Rating size="large" value={this.state.userrating} onChange={(event, newValue) => this.setState({userrating: newValue})}/><br/>
                                    <FormControlLabel
                                        control={<Checkbox checked={this.state.anonymous} onChange={(e)=>this.setState({anonymous: e.target.checked})} />}
                                        label="Anonymous"
                                        style={{marginLeft:"0px"}}
                                    />
                                    <TextField fullWidth required multiline rowsMax="3" variant="filled" label="Review" value={this.state.userreview} onChange={(e)=>this.setState({userreview: e.target.value})} />
    
                                    {(localStorage.getItem('type')==="admin" || localStorage.getItem('type')==="librarian" || localStorage.getItem('type')==="member") && <Button variant="success" style={{marginTop:"20px"}} onClick={()=>{
                                        const t = Date.now();
                                        const DatabaseRef = firebase.database().ref("books").child(this.props.match.params.isbn).child("reviews");
                                        DatabaseRef.child(t).child("rating").set(this.state.userrating);
                                        DatabaseRef.child(t).child("email").set(localStorage.getItem('email'));
                                        DatabaseRef.child(t).child("uid").set(localStorage.getItem('uid'));
                                        DatabaseRef.child(t).child("review").set(this.state.userreview);
                                        DatabaseRef.child(t).child("anonymous").set(this.state.anonymous);
                                        DatabaseRef.child(t).child("createdAt").set(t);
                                        firebase.database().ref('books').child(this.props.match.params.isbn).child('numreviews').set(this.state.numreviews+1)
                                        var newRat = (this.state.rating*this.state.numreviews+this.state.userrating)/(this.state.numreviews+1)
                                        firebase.database().ref('books').child(this.props.match.params.isbn).child('rating').set(newRat)
                                        this.setState({revreq: false, rev: true, rating: newRat, numreviews: (this.state.numreviews+1),
                                        })
                                        window.location.reload()
                                    }}>Publish Review</Button>}
                                    {(localStorage.getItem('type')==="admin" || localStorage.getItem('type')==="librarian" || localStorage.getItem('type')==="member") && <Button variant="danger" style={{marginLeft:"20px", marginTop:"20px"}} onClick={()=>this.setState({revreq: false})}>Cancel</Button> }
                                    
                                </div> }
                            </p>
                            
                        </div>
                        {this.state.numreviews!==0 && <div style={{display:"flex", flexDirection:"column", alignItems:"center", marginTop:"40px"}}>
                            <h1>Book Reviews</h1>
                        {this.state.post}
                        </div>}
                        
                   </div>
               )
           }
}
export default BookInfo;