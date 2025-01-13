import React, { useState } from 'react'
import { Card, Typography, AspectRatio, CardContent, Link, Chip, Divider, Modal } from '@mui/joy';
import LazyImage from '../../utils/LazyImaga'
import RelaySettingCalculator from '../RelaySettingCalculator/RelaySettingCalculator';

const RelayCard = ({ relay }) => {
  const [open, setOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);

  const handleChipClick = (protectionFunction) => {
    setSelectedFunction(protectionFunction);
    setOpen(true);
  };

  return (
    <>
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
              <Chip 
                onClick={() => handleChipClick(protectionFunction)} 
                size='sm' 
                color='primary' 
                variant='outlined' 
                key={index} 
                sx={{ mr: 1, mb: 1, cursor: 'pointer' }}
              >
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

      <Modal
        aria-labelledby="modal-title"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiModal-backdrop': {
            backdropFilter: 'blur(3px)'
          }
        }}
      >
        <div style={{ 
          width: '90%', 
          maxWidth: '600px',
          margin: '20px',
          position: 'relative'
        }}>
          <RelaySettingCalculator 
            initialFunction={selectedFunction}
            relayModel={relay.name}
            onClose={() => setOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
};

export default RelayCard;