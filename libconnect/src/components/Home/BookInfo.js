import React, { Component } from 'react';
import BookCard from './BookCard.js'
import { Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import firebase from '../../firebase'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "firebase/database";

import { Button } from 'react-bootstrap';

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
            quantity: 0,
            availability: 0,
            genre: "",
            isbn: "",
            date: res,
            returnBy: "error",
            timestamp: "error",
            status: "none"
          };
    };

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
                availability: snapshot.child("availability").val(),
                isbn: snapshot.child("isbn").val(),
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
                   <div>
                        <div style={{ display: "flex", flexDirection:"row", justifyContent: "space-evenly"}}>
                        {/* <li className='cards__item' style={{margin: "50px 0 0 0", maxWidth: "30vw" }} >
                            <Link className='cards__item__link' style={{ textDecoration: 'none' }}>
                            <figure className='cards__item__pic-wrap-' >
                                <img
                                className='cards__item__img-'
                                alt='Book Image'
                                src={this.state.coverurl}
                                />
                            </figure>
                            </Link>
                        </li> */}
                        <img
                                style={{width:"30vw", marginTop:"50px", borderRadius:"15px", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", WebkitFilter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017))", filter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017)"
                            }}
                                alt='Book Cover'
                                src={this.state.coverurl}
                                />
                            <p style={{margin: "50px 0 0 0", maxWidth: "40vw"}}>
                                <h1 style={{textAlign: "left"}}>{this.state.title}</h1><br/>
                                <h3>{"by "+this.state.author}</h3><br/>
                                <h5 >{"ISBN-13 : "+this.state.isbn}</h5><br/>
                                <h4 >{this.state.genre}</h4><br/>
                                <h7>{this.state.summary}</h7><br/><br/>
                                <h5 >{this.state.availability+" books available in "+this.state.location}</h5>
                                <div style={{ display: "flex", flexDirection:"row", marginTop:"5vh"}}>
                                {localStorage.getItem('type')==="member" && this.state.status !== "pending" && <DatePicker selected={this.state.date} onChange={date => this.setState({date: date})}/>}
                                {localStorage.getItem('type')==="member" && (this.state.status==="none" || this.state.status==="rejected") && <Button variant="outline-dark" style={{ marginTop:'-5px', marginLeft:"10px"}} onClick={()=>{
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
                                    firebase.database().ref('books').child(this.state.isbn).child('availability')
                                    .transaction((searches)=> {
                                        if (searches) {
                                        searches = searches - 1;
                                        }
                                        return searches;
                                    });
                                    this.setState({status: "pending"})
                                }}>Borrow Now</Button>}
                                {localStorage.getItem('type')==="member" && this.state.status==="accepted" && <Button variant="outline-dark" style={{ marginTop:'-5px', marginLeft:"10px"}} onClick={()=>{
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
                                {this.state.status==="accepted" && localStorage.getItem('type')==="member" && <Button variant="outline-success" style={{ marginTop:'-5px', marginLeft:"10px"}} onClick={()=>{
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
                                {localStorage.getItem('type')==="member" && this.state.status==="pending" && <div><div style={{ borderRadius:"5px", color:"white", backgroundColor:"orange", width:"150px", padding:"5px", textAlign:"center", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)"}} >Request Pending</div><div style={{marginTop:"15px", color:"orange"}}>Please wait for the librarian to approve your request.</div></div>}
                                </div>
                                {localStorage.getItem('type')==="member" && this.state.status==="rejected" && <div style={{ marginTop:'15px',  color:"red", padding:"5px", textAlign:"left",}} >Request Rejected</div>}
                                {localStorage.getItem('type')==="member" && this.state.status==="accepted" && <div style={{ marginTop:'15px',  color:"green",  textAlign:"left", }} >Request Accepted. Please return by {this.state.returnBy}</div>}  
                            </p>
                            
                        </div>
                   </div>
               )
           }
}
export default BookInfo;