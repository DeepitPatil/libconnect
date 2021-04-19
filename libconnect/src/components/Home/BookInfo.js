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
            this.setState({status: snapshot.child(this.state.isbn).child("status").val()})
          }})
    }
    
           render() {
               return(
                   <div>
                        <div style={{ display: "flex", flexDirection:"row", justifyContent: "space-evenly"}}>
                        <li className='cards__item' style={{margin: "50px 0 0 0", maxWidth: "30vw" }} >
                            <Link className='cards__item__link' style={{ textDecoration: 'none' }}>
                            <figure className='cards__item__pic-wrap-' >
                                <img
                                className='cards__item__img-'
                                alt='Book Image'
                                src={this.state.coverurl}
                                />
                            </figure>
                            </Link>
                        </li>
                            <p style={{margin: "50px 0 0 0", maxWidth: "40vw"}}>
                                <h1 style={{textAlign: "left"}}>{this.state.title}</h1><br/>
                                <h3>{"by "+this.state.author}</h3><br/>
                                <h5 >{"ISBN-13 : "+this.state.isbn}</h5><br/>
                                <h4 >{this.state.genre}</h4><br/>
                                <h7>{this.state.summary}</h7><br/><br/>
                                <h5 >{this.state.availability+" books available in "+this.state.location}</h5>
                                <div style={{ display: "flex", flexDirection:"row", marginTop:"5vh"}}>
                                {localStorage.getItem('type')==="member" && <DatePicker selected={this.state.date} onChange={date => this.setState({date: date})}/>}
                                {localStorage.getItem('type')==="member" && this.state.status==="none" && <Button variant="dark" style={{ marginTop:'-5px', marginLeft:"10px"}} onClick={()=>{
                                    const timestamp = Date.now();
                                    firebase.database().ref().child("requests").child(timestamp).set({
                                        uid: localStorage.getItem('uid'),
                                        email: localStorage.getItem('email'),
                                        book: this.state.isbn,
                                        date: this.state.date.getDate()+'/'+this.state.date.getMonth()+'/'+this.state.date.getFullYear(),
                                        createdAt: timestamp,
                                        status: 'pending',
                                    });
                                    firebase.database().ref().child("users").child(localStorage.getItem('uid')).child("requests").child(timestamp).set({
                                        uid: localStorage.getItem('uid'),
                                        email: localStorage.getItem('email'),
                                        book: this.state.isbn,
                                        date: this.state.date.getDate()+'/'+this.state.date.getMonth()+'/'+this.state.date.getFullYear(),
                                        createdAt: timestamp,
                                        status: 'pending',
                                    });
                                    firebase.database().ref().child("users").child(localStorage.getItem('uid')).child("books").child(this.state.isbn).set({
                                        uid: localStorage.getItem('uid'),
                                        email: localStorage.getItem('email'),
                                        book: this.state.isbn,
                                        date: this.state.date.getDate()+'/'+this.state.date.getMonth()+'/'+this.state.date.getFullYear(),
                                        createdAt: timestamp,
                                        status: 'pending',
                                    });
                                    this.setState({status: "pending"})
                                }}>Borrow Now</Button>}
                                {localStorage.getItem('type')==="member" && this.state.status==="pending" && <Button variant="warning" style={{ marginTop:'-5px', marginLeft:"10px"}} >Request Pending</Button>}
                                </div>           
                            </p>
                            
                        </div>
                   </div>
               )
           }
}
export default BookInfo;