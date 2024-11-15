import React from 'react'
import styles from './Home.module.css'
import { Typography ,Input, Button} from '@mui/joy'
import SearchIcon from '@mui/icons-material/Search';  
import RelayGrid from '../../Components/RelayGrid/RelayGrid'
import Header from '../../Components/Header/Header'


function HomePage() {
  return (
    <div className={styles.mainContainer}>
        <Header/>
        <Heading/>
        <SearchBar/>
        <RelayGrid/>
        
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

//searchbar section containing the searchbar and the search button

function SearchBar() {
  return (
    <div className={styles.searchContainer}>
    
        <Input
          size="sm"
          placeholder="Search"
          fullWidth
          startDecorator={<SearchIcon />}
        />
    
    </div>

    
  )
}

export default HomePage