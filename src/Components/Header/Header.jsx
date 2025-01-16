import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/joy';
import Logo_high from '../../assets/Logo_high.png';
import styles from './Header.module.css';
import '@fontsource/inter';

function Header() {
  const location = useLocation();
  
  return (
    <div className={styles.mainContainer}>
      <img src={Logo_high} height={35} className={styles.logo} alt="logo" />
      <div className={styles.links}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button 
            variant={location.pathname === "/" ? "soft" : "plain"}
            color="primary"
          >
            Home
          </Button>
        </Link>
        <Link to="/about" style={{ textDecoration: 'none' }}>
          <Button 
            variant={location.pathname === "/about" ? "soft" : "plain"}
            color="primary"
          >
            About
          </Button>
        </Link>
      </div>
      </div>
  );
}

export default Header;