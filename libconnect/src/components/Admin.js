import React, { Component } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import firebase from '../firebase'
import './App.css'
import "firebase/database";
import { Redirect } from 'react-router';

class Admin extends Component {
    constructor(props){
        super(props);
        this.state = {
            emails: [],
            uids: [],
            types: [],
            post: null,
          };
        if(localStorage.getItem('type')==="admin"){
            this.setState({eligible:true})
        }else{
            this.setState({eligible:false})
        }
    };

    handleClick(uid, type) {
        firebase.database().ref("users").child(uid).child('type').set(type);
    }

    componentDidMount(){
        const rootRef = firebase.database().ref();
        const post = rootRef.child('users').orderByKey();
             post.once('value', snap => {
               snap.forEach(child => {
                   if(child.val().uid!==localStorage.getItem('uid')){
                   this.setState({
                    emails: this.state.emails.concat([child.val().email]),
                    uids: this.state.uids.concat([child.val().uid]),
                    types: this.state.types.concat([child.val().type]),
                   });
                }
        
                   const postList = this.state.uids.map((dataList, index) =>
                   <div style={{ display: 'flex', flexDirection: 'row', margin:"1vh", paddingRight:'0vw', borderRadius:'2px', height:"75px",
                   boxShadow: "0 6px 20px rgba(56, 125, 255, 0.17)", WebkitFilter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017))", filter:"drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017)"}}>
                       <img src="https://image.flaticon.com/icons/png/512/61/61205.png" style={{width:"50px", height:"50px", alignSelf:"center", marginLeft:"12.5px"}}/>
                       <p style={{width:"25vw", marginLeft:'20px', maxHeight:"100px", marginTop:'10px'}}>
                           <h5>{"Email ID : "+this.state.emails[index]}</h5>
                           <h6>{"User ID : "+this.state.uids[index]}</h6><br/>
                       </p>
                       <ToggleButtonGroup type="radio" name="options" defaultValue={this.state.types[index]} onChange={(e)=> this.handleClick(this.state.uids[index], e)} >
                            <ToggleButton value="admin" className='toggle'>Admin</ToggleButton>
                            <ToggleButton value="librarian" className='toggle'>Librarian</ToggleButton>
                            <ToggleButton value="member" className='toggle'>Member</ToggleButton>
                            <ToggleButton value="ban" className='toggle'>Banned</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
        
                    );
        
                    this.setState({
                        post: postList
                    });
               });
           }); }
    
           render() {
               return(
                <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                    {!this.state.eligible && <Redirect to="/home/s=" />}
                    <h1><br/>Manage Accounts</h1>
                    <div style={{display: 'flex', flexDirection:'column', alignItems:'center', height:"80vh",  padding:"1vh"}}>
                    {this.state.post}
                    </div>
              </div>
               )
           }
}
export default Admin;