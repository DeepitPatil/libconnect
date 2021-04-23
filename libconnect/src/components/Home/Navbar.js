import React, { useState, useEffect, Component } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import firebase from '../../firebase'
import "firebase/database";
import './Navbar.css';

class Navbar extends Component {

  constructor(props){
    super(props);
    this.state = {
      button: true,
      email: localStorage.getItem('email') || "error",
      uid: localStorage.getItem('uid') || "error",
      type: localStorage.getItem('type') || "error",
      loggedout: false,
    }
    firebase.auth().onAuthStateChanged((user)=> {   
      if(user){
        this.setState({ user: user, email: user.email, button: false });
        localStorage.setItem('email', user.email)
        localStorage.setItem('uid', user.uid)
      }
      if(this.state.email !== "error"){
        const DatabaseRef = firebase.database().ref().child("users")
        DatabaseRef.once("value")
        .then((snapshot)=> {
          if(!snapshot.hasChild(this.state.uid) && this.state.uid!=="error"){
            DatabaseRef.child(this.state.uid).set({
              email: this.state.email,
              uid: this.state.uid,
              type: "member",
            })
            this.setState({type: "member"})
            localStorage.setItem("type", "member")
          }else {
            const starCountRef = DatabaseRef.child(this.state.uid).child("type")
            starCountRef.on('value', (snapshot) => {
              const data = snapshot.val();
              this.setState({type: data})
              localStorage.setItem('type', data)
            });
            
          }
        });
      }
    });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=> {   
      if(user){
        this.setState({ user: user, email: user.email, button: false });
      }
    });
  }

  render() {
    return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/home/s='><img src="https://i.pinimg.com/564x/cb/cd/13/cbcd13e56456b549cfeee170dce94d7c.jpg" style={{marginLeft:"10px",width:"90px", filter:"invert(1) grayscale()"}} /></Link>
          <Link to='/home/s=' className='navbar-logo' style={{ textDecoration: 'none', color: 'white', marginLeft:"0px" }}>
            LibConnect
            <i class='fab fa-typo3' />
          </Link>
          <ul className={'nav-menu active'}>
            <li className='nav-item'>
              <Link to='/home/s=' className='nav-links' style={{ textDecoration: 'none', color: 'white' }}>
                Home
              </Link>
            </li>
            {this.state.type==="admin" && <li className='nav-item'>
              <Link
                to='/admin'
                className='nav-links'
                style={{ textDecoration: 'none', color: 'white' }}
              >
                Admin
              </Link>
            </li>}
            {(this.state.type==="librarian" || this.state.type==="admin") && <li className='nav-item'>
              <Link
                to='/librarian'
                className='nav-links'
                id="lib"
                style={{ textDecoration: 'none', color: 'white', marginTop:"8px"}}
              >
                Librarian
              </Link>
            </li>}
            <li classname="nav-item">
            {this.state.email==="error" && <Button buttonStyle='btn--outline' toLink="/sign-up">SIGN UP</Button>}
            {this.state.email!=="error" && <Link
                to='/account'
                className='nav-links'
                style={{ textDecoration: 'none', color: 'white', marginTop: '8px'}}
              >
                {this.state.email}
              </Link>}
            </li>
            <li classname="nav-item">
            {this.state.email!=="error" && <Button buttonStyle='btn--outline' onClick={()=>{
              firebase.auth().signOut();
              localStorage.setItem('email', "error");
              localStorage.setItem('uid', "error");
              localStorage.setItem('type', 'error')
              this.setState({email: "error", uid: "error", type: "error", loggedout: true})
              window.location.reload()
              }} >LOG OUT</Button>}
            </li>
          </ul>
          
        </div>
      </nav>
    </>
  );}
}

export default Navbar;