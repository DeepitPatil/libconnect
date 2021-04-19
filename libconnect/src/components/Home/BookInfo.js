import React, { Component } from 'react';
import BookCard from './BookCard.js'
import { Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import firebase from '../../firebase'
import "firebase/database";
import { Button } from './Button.js';

class BookInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: "",
            author: "",
            coverurl: "",
            summary: "",
            location: "",
            quantity: 0,
            availability: 0,
            genre: "",
            isbn: ""
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
                            </p>
                            <Button>Borrow Now</Button>
                        </div>
                   </div>
               )
           }
}
export default BookInfo;