import React, { useEffect, useState } from 'react'
import '../App.css';
import './HeroSection.css';
import bookVideo from './book.mp4'
import Books from './Books.js'
import SearchBar from "material-ui-search-bar";
import { Dropdown } from 'react-bootstrap'
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
  var s, g;
  if(props.match.params.search==="s="){
    s = ""
    g = ""
  }
  else {
    var list = props.match.params.search.substring(2).split("&&")
    s = list[0]
    s.replaceAll("%20", " ")
    console.log(s)
    if(list.length === 1){
      g = ""
    }else {
      g = list[1].substring(2)
    }
    g.replaceAll("%20", " ")
    console.log(g)
  }
  const [search, setSearch] = useState(s);
  const [post, setPost] = useState(<Books search={s} genre={g}/>)
  const [searched, setSearched] = useState(false);
  const history = useHistory();
  
    return(
        <div>
          <div className='hero-container'>
            <video src={bookVideo} autoPlay loop muted style={{filter:"brightness(70%)"}}/>
            <h1>Welcome to LibConnect</h1>
            <p >“Today a reader, tomorrow a leader.” – Margaret Fuller</p>
            <center>
            <div style={{ width: "50vw", opacity:"50%", display:"flex",}}>
            <SearchBar
              style={{margin: "10vh 0 0 0", width: "50vw",}}
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
              
              </div>
              <Dropdown style={{margin: "10vh 0 0 0", height:"20px"}}>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  {(g==="") && "All Genre"}
                  {(g!=="" && g)}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item href={"s="+search+""}>All Genrecd</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Action & Adventure"}>Action & Adventure</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Biography"}>Biography</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Children"}>Children</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Crime"}>Crime</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Dystopian"}>Dystopian</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Fantasy"}>Fantasy</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Fiction"}>Fiction</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Graphic Novel"}>Graphic Novel</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=History"}>History</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Horror"}>Horror</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Humanities"}>Humanities</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Humour"}>Humour</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Mystery"}>Mystery</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Poetry"}>Poetry</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Religion & Spirituality"}>Religion & Spirituality</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Romance"}>Romance</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Science Fiction"}>Science Fiction</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Science & Technology"}>Science & Technology</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Self Help"}>Self Help</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Thriller & Suspense"}>Thriller & Suspense</Dropdown.Item>
                  <Dropdown.Item href={"s="+search+"&&g=Travel"}>Travel</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            {searched && <Redirect to={"/home/s="+search}/>}
            </center>
          </div>
          {post}
        </div>
    )
}