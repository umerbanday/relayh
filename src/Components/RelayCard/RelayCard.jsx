import React from 'react'
import LazyImage from '../../utils/LazyImaga'
import { Card,Typography,AspectRatio,CardContent,Button } from '@mui/joy';

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
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">Total price:</Typography>
          <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>{relay.price}</Typography>
        </div>
        <Button
          variant="solid"
          size="md"
          color="primary"
          aria-label="Explore Bahamas Islands"
          sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
        >
          Explore
        </Button>
      </CardContent>
    </Card>
    );
  };

  export default RelayCard;