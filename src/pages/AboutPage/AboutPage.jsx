import React from 'react'
import myphoto from "../../assets/myphoto.jpeg"
import { Typography, Card, Box, Avatar } from '@mui/joy'
import EmailIcon from '@mui/icons-material/Email'
import WorkIcon from '@mui/icons-material/Work'
import SchoolIcon from '@mui/icons-material/School'
import Header from '../../Components/Header/Header'
import styles from './AboutPage.module.css'

function AboutPage() {
  return (
    <div className={styles.mainContainer} >
      <Header />
      <Box sx={{ 
        maxWidth: 1000,
        boxSizing:'border-box',
        width:'100%',
        margin: 'auto', 
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        marginTop:'55px',
        gap: 4
      }}>
        <Card variant="outlined" sx={{ p: 4 }}>
          <Typography level="h3" sx={{ mb: 2 }}>
            About This Site
          </Typography>
          <Typography>
            This site is a personal project designed to help fellow protection engineers during their job.
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ p: 4 }}>
          <Typography level="h3" sx={{ mb: 2 }}>
            About Me
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={myphoto} sx={{ width: 100, height: 100 }} />
            <Box>
              <Typography level="h3">Umer Banday</Typography>
              <Typography>Electrical Engineer</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon />
                <Typography>umer.banday@gmail.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon />
                <Typography>JKPTCL</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon />
                <Typography>NIT Srinagar '16</Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </div>
  )
}

export default AboutPage