import React, { useEffect, useState } from 'react'
import HeroSection from './HeroSection.js'
import BookCard from './BookCard.js'
import Books from './Books.js'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import firebase from '../../firebase'
import "firebase/database";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Home(){
  const classes = useStyles();

  
    return(
        <div>
          <HeroSection/>
          <Books/>
        </div>
    )
}