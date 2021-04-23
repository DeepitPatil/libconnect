import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
//import { Card, CardHeader, CardTitle, CardBody, CardActions, CardImage, CardSubtitle } from '@progress/kendo-react-layout';
import firebase from '../../firebase'
import "firebase/database";

class BookIssue extends Component {
    constructor(props){
        super(props);
        this.state = {
            titles: [],
            authors: [],
            coverurls: [],
            isbns: [],
            emails: [],
            dates: [],
            uids: [],
            timestamps: [],
            post: null,
            eligible: true,
          };
        
    };

    acceptBook(uid, isbn, timestamp){
        var ava;
        const DatabaseRef = firebase.database().ref('books').child(isbn).child('availability');
        firebase.database().ref('requests').child(timestamp).child('status').set("accepted")
        firebase.database().ref('users').child(uid).child('requests').child(timestamp).child('status').set("accepted")
        firebase.database().ref('users').child(uid).child('books').child(isbn).child('status').set("accepted")
        window.location.reload()
    }

    rejectBook(uid, isbn, timestamp){
        firebase.database().ref('books').child(isbn).child('availability')
        .transaction((searches)=> {
            if (searches) {
              searches = searches + 1;
            }
            return searches;
          });
        firebase.database().ref('requests').child(timestamp).child('status').set("rejected")
        firebase.database().ref('users').child(uid).child('requests').child(timestamp).child('status').set("rejected")
        firebase.database().ref('users').child(uid).child('books').child(isbn).child('status').set("rejected")
        window.location.reload()
    }

    update(tit, aut, cov){
        this.setState({
            titles: this.state.titles.concat([tit]),
            authors: this.state.authors.concat([aut]),
            coverurls: this.state.coverurls.concat([cov]),
        });
    }

    componentDidMount(){
        const rootRef = firebase.database().ref();
        const post = rootRef.child('requests').orderByKey();
             post.once('value', snap => {
               snap.forEach(child => {
                   if(child.val().status==="pending"){
                      this.setState({
                        titles: this.state.titles.concat([child.val().title]),
                        authors: this.state.authors.concat([child.val().author]),
                        coverurls: this.state.coverurls.concat([child.val().coverurl]),
                        isbns: this.state.isbns.concat([child.val().isbn]),
                        emails: this.state.emails.concat([child.val().email]),
                        dates: this.state.dates.concat([child.val().date]),
                        uids: this.state.uids.concat([child.val().uid]),
                        timestamps: this.state.timestamps.concat([child.val().createdAt]),
                    });
                }
        
                   const postList = this.state.isbns.map((dataList, index) =>
                   <div style={{ display: 'flex', flexDirection: 'row', margin:"1vh", paddingRight:'0vw', borderRadius:'15px',
                   boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", WebkitFilter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017))", filter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017)"}}>
                       <img src={this.state.coverurls[index]} style={{width:"12vw", height:"19vw", borderRadius:"15px 0 0 15px", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)" }}/>
                       <p style={{width:"45vw", marginLeft:'2vw', maxHeight:"17vw", marginTop:'1vw'}}>
                           <h3>{this.state.titles[index]+" by "+this.state.authors[index]}</h3>
                           <h5>{"ISBN-13 : "+this.state.isbns[index]}</h5><br/>
                           <h5>{"Request made by : "+this.state.emails[index]}</h5>
                           <h6>{"User ID : "+this.state.uids[index]}</h6><br/>
                           <h5>{"Return by : "+this.state.dates[index]}</h5>
                       </p>
                       <div style={{ width:"7vw",display: 'flex', flexDirection: 'column', justifyContent:"space-evenly" }}>
                       <Button variant="success" style={{boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", height:"9.5vw", borderRadius:"0 15px 0 0"}} onClick={()=>this.acceptBook(this.state.uids[index], this.state.isbns[index], this.state.timestamps[index])}>Accept</Button>
                       <Button variant="danger" style={{boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", height:"9.5vw", borderRadius:"0 0 15px 0"}} onClick={()=>this.rejectBook(this.state.uids[index], this.state.isbns[index], this.state.timestamps[index])}>Reject</Button>
                       </div>
                    </div>
        
                    );
        
                    this.setState({
                        post: postList
                    });
               });
           }); }
    
           render() {
            if(localStorage.getItem('type')==="admin" || localStorage.getItem('type')==="librarian"){
            }else{
                this.setState({eligible:false})
            }
               return(
                <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                    {!this.state.eligible && <Redirect to="/home/s=" />}
                    <h1><br/>Accept or Reject the borrow requests made by users</h1>
                    <div style={{display: 'flex', flexDirection:'column-reverse', alignItems:'center', maxHeight:"80vh", overflowY:"scroll", padding:"1vh"}}>
                    {this.state.post}
                    </div>
              </div>
               )
           }
}
export default BookIssue;