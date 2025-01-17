import React from 'react';
import styles from './Home.module.css'
import {tabClasses} from '@mui/joy';
import { Typography, Input, Tabs, TabList, Tab, TabPanel } from '@mui/joy'
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import RelayGrid from '../../Components/RelayGrid/RelayGrid'
import Header from '../../Components/Header/Header'
import CalculatorGrid from '../../Components/CalculatorGrid/CalculatorGrid';

function HomePage() {
  const [query,setquery]=useState('')
  return (
    <div className={styles.mainContainer}>
      <Header />
      <Heading />

      <Tabs aria-label="tabs" defaultValue={0} sx={{ bgcolor: 'transparent',border:'0.5px solid lightgrey',borderRadius:'10px',height:'100%',margin:'20px',padding:'20px',boxSizing:'border-box' }}>
        <TabList
  
        sx={{
          p: 0.5,
          gap: 0.5,
          borderRadius: 'xl',
          bgcolor: 'background.level1',
          [`& .${tabClasses.root}[aria-selected="true"]`]: {
            boxShadow: 'sm',
            fontWeight:'500',
            bgcolor: 'background.surface',
          },
        }}
      >
          <Tab disableIndicator variant="plain" color="primary">Calculators</Tab>
          <Tab disableIndicator variant="plain" color="primary">Relays</Tab>
        </TabList>

        <TabPanel sx={{padding:'0',marginTop:'20px'}} value={0}>
        <SearchBar query={query} setquery={setquery}/>  
          <CalculatorGrid filterString={query} />
        </TabPanel>
        <TabPanel sx={{padding:'0',marginTop:'20px'}} value={1}>
      
          <RelayGrid />
        </TabPanel>
      </Tabs>
    
    </div>
  );
}

//heading sction containing the heading and the subheading
function Heading() {
  return (
    <div className={styles.headingContainer}>
      <Typography 
        level='h1' 
        sx={{ 
          fontSize: {
            xs: '1.8rem', // Mobile
            sm: '2rem',   // Small devices
            md: '3rem'    // Medium and larger devices
          },
          textAlign: 'center',
          lineHeight: 1.2
        }}
      >
        Welcome to the{' '}
        <Typography 
          component="span" 
          level='h1' 
          variant='soft' 
          color='danger'
          sx={{ 
            fontSize: {
              xs: '1.8rem', // Mobile
              sm: '2rem',   // Small devices
              md: '3rem'
            }
          }}
        >
          Relay
        </Typography>{' '}
        <Typography 
          component="span" 
          level='h1' 
          variant='soft'
          sx={{ 
            fontSize: {
              xs: '1.8rem', // Mobile
            sm: '2rem',   // Small devices
            md: '3rem'
            }
          }}
        >
          hub
        </Typography>
      </Typography>
      
      <Typography 
        level='h4' 
        sx={{ 
          maxWidth: {
            xs: '100%',  // Full width on mobile
            sm: '500px'  // Constrained width on larger screens
          },
          textAlign: 'center',
          fontSize: {
            xs: '1rem',   // Smaller font on mobile
            sm: '1.125rem' // Slightly larger on larger screens
          },
          px: 2 // Horizontal padding
        }}
      >
        Your comprehensive source for all protection relay information including{' '}
        <Typography 
          color='success' 
          variant='outlined'
          component="span"
        >
          manuals
        </Typography>
        , {' '}
        <Typography 
          color='danger' 
          variant='soft'
          component="span"
        >
          settings
        </Typography>
        , and more.
      </Typography>
    </div>
  );
}

//searchbar section containing the searchbar and the search button

function SearchBar({query,setquery}) {
  
  return (
    <div className={styles.searchContainer}>

      <Input
        size="sm"
        placeholder="Search"
        fullWidth
        value={query}
        startDecorator={<SearchIcon />}
        onChange={(e)=>{setquery(e.target.value)}}
      />

    </div>


  )
}

export default HomePage