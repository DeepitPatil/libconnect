import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const { currentUser, logout } = useAuth();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (currentUser) {
      setButton(false)
    } else {
      setButton(true)
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link className='navbar-logo' style={{ textDecoration: 'none' }}>
            LibConnect
            <i class='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu} style={{ textDecoration: 'none' }}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/services'
                className='nav-links'
                style={{ textDecoration: 'none' }}
                onClick={closeMobileMenu}
              >
                Services
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/librarian'
                className='nav-links'
                style={{ textDecoration: 'none' }}
                onClick={closeMobileMenu}
              >
                Librarian
              </Link>
            </li>
            <li classname="nav-item">
            {button && <Button buttonStyle='btn--outline' toLink="/sign-up">SIGN UP</Button>}
            {!button && <div className="nav-con">{currentUser.email}</div>}
            </li>
            <li classname="nav-item">
            {!button && <Button buttonStyle='btn--outline' toLink="/signin" onClick={logout()}>LOG OUT</Button>}
            </li>
          </ul>
          
        </div>
      </nav>
    </>
  );
}

export default Navbar;