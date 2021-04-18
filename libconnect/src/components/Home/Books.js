import React, { Component } from 'react';
import BookCard from './BookCard.js'
import { Grid } from '@material-ui/core'
import firebase from '../../firebase'
import "firebase/database";

class Books extends Component {
    constructor(props){
        super(props);
        this.state = {
            titles: [],
            authors: [],
            coverurls: [],
            isbns: [],
            post: null,
          };
    };

    componentDidMount(){
        const rootRef = firebase.database().ref();
        const post = rootRef.child('books').orderByKey();
        
             post.once('value', snap => {
               snap.forEach(child => {
                if(child.val().title.toString().toLowerCase().includes(this.props.search.toLowerCase()) || child.val().author.toString().toLowerCase().includes(this.props.search.toLowerCase())){
                   this.setState({
                    titles: this.state.titles.concat([child.val().title]),
                    authors: this.state.authors.concat([child.val().author]),
                    coverurls: this.state.coverurls.concat([child.val().coverurl]),
                    isbns: this.state.isbns.concat([child.val().isbn]),
                   });
                  }
        
                   const postList = this.state.isbns.map((dataList, index) =>
                   <Grid item>
                   <BookCard
                     src={this.state.coverurls[index]}
                     text={this.state.titles[index]+" by "+this.state.authors[index]}
                     path={'/books/'+dataList}
                   />
                   </Grid>
        
                    );
        
                    this.setState({
                        post: postList
                    });
               });
           }); }
    
           render() {
               return(
                <Grid container spacing={1} xl={4} style={{justifyContent: "space-evenly"}}>
                {/* <Grid item>
                <BookCard
                  src='https://images-na.ssl-images-amazon.com/images/I/5112YFsXIJL.jpg'
                  text='Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future'
                  path='/librarian/add-book'
                />
                </Grid>*/}
                {this.state.post}
              </Grid>
               )
           }
}
export default Books;