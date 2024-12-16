import React from 'react'
import LazyImage from '../../utils/LazyImaga'
import { Card,Typography,AspectRatio,CardContent,Link, Chip,Divider } from '@mui/joy';

const RelayCard = ({ relay }) => {
    return (
      <Card >
      <div>
        <Typography level="title-lg">{relay.name}</Typography>
        <Typography level="body-sm">{relay.description}</Typography>
       
      </div>
      <AspectRatio color='white' minHeight="120px" maxHeight="200px">
        <LazyImage src={relay.image}/>
      </AspectRatio>
      <CardContent sx={{borderColor:'lightgrey',bgcolor:"rgb(253,253,253)",borderStyle:"solid",borderWidth:"0.2px",borderRadius:"5px",padding:"20px",paddingTop:"0px",paddingBottom:"10px",boxSizing:"border-box"}} orientation="vertical">
     
      <Divider sx={{ '--Divider-childPosition': `50%` ,fontWeight:"400",marginTop:"10px",marginBottom:"10px"}}>
    Functions Available
  </Divider>
        <div >
          
          {relay.specifications.protectionFunctions.map((protectionFunction, index) => (
            <Chip size='sm' variant='soft' key={index} sx={{ mr: 1, mb: 1 }} >
              {protectionFunction}
            </Chip>
          ))}
        </div>
        <Divider sx={{ '--Divider-childPosition': `50%` ,fontWeight:"400",marginTop:"10px",marginBottom:"10px"}}>
    Setting Calculators
  </Divider>
  <div >
          
          {relay.specifications.protectionFunctions.map((protectionFunction, index) => (
            <Chip onClick={()=>{}} size='sm' color='primary' variant='outlined' key={index} sx={{ mr: 1, mb: 1 }} >
              {protectionFunction}
            </Chip>
          ))}
        </div>
        <Divider sx={{ '--Divider-childPosition': `50%`,fontWeight:"400" ,marginTop:"10px",marginBottom:"10px"}}>
    Manuals and References
  </Divider>
  <div >
          
          {relay.specifications.protectionFunctions.map((protectionFunction, index) => (
            <Link level="body-sm" key={index} sx={{ mr: 2, mb: 1 }} >
              {protectionFunction}
            </Link>
          ))}
        </div>
        
      </CardContent>
    </Card>
    );
  };

  export default RelayCard;