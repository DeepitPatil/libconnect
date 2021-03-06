import React from 'react';
import '../App.css';
import './HeroSection.css';
import bookVideo from './book.mp4'

function HeroSection() {
  return (
    <div className='hero-container'>
      <video src={bookVideo} autoPlay loop muted />
      <h1>Welcome to LibConnect</h1>
      <p>“Today a reader, tomorrow a leader.” – Margaret Fuller</p>
    </div>
  );
}

export default HeroSection;