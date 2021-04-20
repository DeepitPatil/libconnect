import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase'
import "firebase/database";

class Account extends Component {
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
            statuses: [],
            post: null,
          };
    };

    componentDidMount(){
        const rootRef = firebase.database().ref();
        const post = rootRef.child('users').child(localStorage.getItem("uid")).child("requests").orderByKey();
             post.once('value', snap => {
               snap.forEach(child => {
                   this.setState({
                    titles: this.state.titles.concat([child.val().title]),
                    authors: this.state.authors.concat([child.val().author]),
                    coverurls: this.state.coverurls.concat([child.val().coverurl]),
                    isbns: this.state.isbns.concat([child.val().isbn]),
                    emails: this.state.emails.concat([child.val().email]),
                    dates: this.state.dates.concat([child.val().date]),
                    uids: this.state.uids.concat([child.val().uid]),
                    statuses: this.state.statuses.concat([child.val().status]),
                    timestamps: this.state.timestamps.concat([new Date(child.val().createdAt)]),
                   });
                
        
                   const postList = this.state.isbns.map((dataList, index) =>
                   <Link to={"/books/"+dataList} style={{ display: 'flex', flexDirection: 'row', margin:"1vh", paddingRight:'0vw', borderRadius:'15px', textDecoration:"none", color:"black",
                   boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", WebkitFilter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017))", filter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017)"}}>
                       <img src={this.state.coverurls[index]} style={{width:"12vw", height:"19vw", borderRadius:"15px 0 0 15px", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)" }}/>
                       <p style={{width:"45vw", marginLeft:'2vw', maxHeight:"17vw", marginTop:'1vw'}}>
                           <h3>{this.state.titles[index]+" by "+this.state.authors[index]}</h3>
                           <h5>{"ISBN-13 : "+this.state.isbns[index]}</h5><br/><br/>
                           <h5>{"Return by : "+this.state.dates[index]}</h5>
                           <h6>{"Request made on : "+this.state.timestamps[index].getDate() + '/' + (this.state.timestamps[index].getMonth()+1) + '/' + this.state.timestamps[index].getFullYear()}</h6>
                       </p>
                       {this.state.statuses[index]==="pending" && <div style={{ width:"7vw",display: 'flex', flexDirection: 'column',color:"white", justifyContent:"space-evenly", backgroundColor:"orange", borderRadius:"0 15px 15px 0", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", }}><center>Pending</center></div>}
                       {this.state.statuses[index]==="accepted" && <div style={{ width:"7vw",display: 'flex', flexDirection: 'column', justifyContent:"space-evenly", color:"white", backgroundColor:"green", borderRadius:"0 15px 15px 0", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", }}><center>Accepted</center></div>}
                       {this.state.statuses[index]==="rejected" && <div style={{ width:"7vw",display: 'flex', flexDirection: 'column', justifyContent:"space-evenly", color:"white", backgroundColor:"red", borderRadius:"0 15px 15px 0", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", }}><center>Rejected</center></div>}
                       {this.state.statuses[index]==="none" && <div style={{ width:"7vw",display: 'flex', flexDirection: 'column', justifyContent:"space-evenly", color:"white", backgroundColor:"DodgerBlue", borderRadius:"0 15px 15px 0", boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", }}><center>Returned</center></div>}
                    </Link>
        
                    );
        
                    this.setState({
                        post: postList
                    });
               });
           }); }
    
           render() {
               return(
                <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                    <div style={{display:"flex", flexDirection:'column', alignItems:"center", height:"20vh"}}>
                    <h1><br/>Welcome, {localStorage.getItem('email')} ({localStorage.getItem('type')})</h1>
                    <h6>Your User ID is {localStorage.getItem('uid')}</h6><br/>
                    {localStorage.getItem('type')==="member" && <h4>And this is your history</h4>}
                    </div>
                    
                    <div style={{display: 'flex', flexDirection:'column-reverse', alignItems:'center', height:"70vh", overflowY:"scroll",padding:"1vh"}}>
                    {this.state.post}
                    </div>
                
              </div>
               )
           }
}
export default Account;