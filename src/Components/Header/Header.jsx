import React from 'react'
import Logo_high from '../../assets/Logo_high.png'
import styles from './Header.module.css'
import '@fontsource/inter';
import { Link } from '@mui/joy';

function Header() {
  return (
    <div className={styles.mainContainer}>
        <img src={Logo_high} height={35} className={styles.logo} alt="logo" />
        <div className={styles.links}>
            <Link level='body-sm' color='neutral' underline='hover'>
            Home
            </Link>
            <Link level='body-sm'  color='neutral' underline='hover'>
            About
            </Link>
        </div>
    </div>
  )
}

export default Header