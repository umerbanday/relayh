import React from 'react'
import Header from '../../Components/Header/Header'
import styles from './Home.module.css'
import { Typography } from '@mui/joy'

function Home() {
  return (
    <div className={styles.mainContainer}>
        <Header/>
        <Heading/>
    </div>
  )
}

//heading sction containing the heading and the subheading
function Heading() {
  return (
    <div className={styles.headingContainer}>
      <Typography level='h1'>
        Welcome to the {' '}
        <Typography level='h1' variant='soft'  color='danger'>Relay</Typography>
        <Typography level='h1' variant='soft'  >hub</Typography>
      </Typography>
      <Typography  level='h4' textAlign={'center'} sx={{ maxWidth: 600 }} >
      Your comprehensive source for all protection relay information including{' '}<Typography color='success' variant='outlined'> manuals</Typography> , <Typography color='danger' variant='soft'>settings</Typography>, and more.
      </Typography>
    </div>
  )
}

export default Home