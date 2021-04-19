import React, { useEffect, useState } from 'react'
import '../App.css';
import './HeroSection.css';
import bookVideo from './book.mp4'
import Books from './Books.js'
import SearchBar from "material-ui-search-bar";
import { Grid, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import firebase from '../../firebase'
import "firebase/database";
import { Redirect, useHistory } from 'react-router';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));





export default function Home(props){
  
  const classes = useStyles();
  var s;
  if(props.match.params.search==="s=")
    s = ""
  else
    s = props.match.params.search.substring(2)
  const [search, setSearch] = useState(s);
  const [post, setPost] = useState(<Books search={s}/>)
  const [searched, setSearched] = useState(false);
  const history = useHistory();
  
    return(
        <div>
          <div className='hero-container'>
            <video src={bookVideo} autoPlay loop muted />
            <h1>Welcome to LibConnect</h1>
            <p>“Today a reader, tomorrow a leader.” – Margaret Fuller</p>
            <center>
            <SearchBar
              style={{margin: "10vh 0 0 0", width: "50vw"}}
              value={search}
              onChange={(e) => {
                setSearch(e)
                setSearched(true)
              }}
              placeholder="Search title or author"
              onRequestSearch={(e)=>{
                window.location.reload()
              }}
              onCancelSearch={(e)=>{
                setSearch("")
                setSearched(true)
              }}
            />
            {searched && <Redirect to={"/home/s="+search}/>}
            </center>
          </div>
          {post}
        </div>
    )
}