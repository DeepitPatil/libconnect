import React, { useState } from 'react';
import './Cards.css';
import CardItem from './CardItem';
import { Redirect } from 'react-router-dom'

function Librarian() {
  const [eligible, setEligible] = useState(true)
  if(localStorage.getItem('type')==="admin" || localStorage.getItem('type')==="librarian"){
      
  }else if(eligible){
      setEligible(false)
  }

  return (
    <div className='cards'>
      {!eligible && <Redirect to="/home/s=" />}
      <h1><br/><br/>Managing a Library has never been easier!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='https://images.unsplash.com/photo-1532012197267-da84d127e765?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80'
              text='Keep your library updated by adding new books.'
              label='Add New Books'
              path='/librarian/add-book'
            />
            <CardItem
              src='https://images.unsplash.com/photo-1589123053970-a2f81b8ea7b0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80'
              text='Manage the issuance and collection of Library Books.'
              label='Issuance of Books'
              path='/librarian/book-issue'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Librarian;