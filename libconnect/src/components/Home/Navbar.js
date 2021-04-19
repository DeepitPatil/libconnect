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
    }
    firebase.auth().onAuthStateChanged((user)=> {   
      if(user){
        this.setState({ user: user, email: user.email, button: false });
        localStorage.setItem('email', user.email)
        localStorage.setItem('uid', user.uid)
        localStorage.setItem('uid', user.uid)
      }
      if(this.state.email !== "error"){
        const DatabaseRef = firebase.database().ref().child("users")
        DatabaseRef.once("value")
        .then((snapshot)=> {
          if(!snapshot.hasChild(this.state.uid)){
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
          <Link to='/home/s=' className='navbar-logo' style={{ textDecoration: 'none', color: 'white' }}>
            LibConnect
            <i class='fab fa-typo3' />
          </Link>
          <ul className={'nav-menu active'}>
            <li className='nav-item'>
              <Link to='/home/s=' className='nav-links' style={{ textDecoration: 'none', color: 'white' }}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              {this.state.type==="admin" && <Link
                to='/services'
                className='nav-links'
                style={{ textDecoration: 'none', color: 'white' }}
              >
                Admin
              </Link>}
            </li>
            <li className='nav-item'>
              {(this.state.type==="librarian" || this.state.type==="admin") && <Link
                to='/librarian'
                className='nav-links'
                style={{ textDecoration: 'none', color: 'white'}}
              >
                Librarian
              </Link>}
            </li>
            <li classname="nav-item">
            {this.state.email==="error" && <Button buttonStyle='btn--outline' toLink="/sign-up">SIGN UP</Button>}
            {this.state.email!=="error" && <Link
                to='/'
                className='nav-links'
                style={{ textDecoration: 'none', color: 'white', marginTop: '10px'}}
              >
                {this.state.email}
              </Link>}
            </li>
            <li classname="nav-item">
            {this.state.email!=="error" && <Button buttonStyle='btn--outline' toLink="/signin" onClick={()=>{
              firebase.auth().signOut();
              localStorage.setItem('email', "error");
              localStorage.setItem('uid', "error");
              this.setState({email: "error", uid: "error"})}} >LOG OUT</Button>}
            </li>
          </ul>
          
        </div>
      </nav>
    </>
  );}
}

export default Navbar;