import React, { useState,useEffect } from 'react';
import { Card, Typography, CardContent, Modal } from '@mui/joy';
import { relayProtectionConfigs } from '../../utils/relayProtectionConfigs';
import CalculateIcon from '@mui/icons-material/Calculate';
import RelaySettingCalculator from '../RelaySettingCalculator/RelaySettingCalculator';
import styles from './CalculatorGrid.module.css';

const CalculatorGrid = ({filterString}) => {
    // Collect all unique calculators from relay configs
    const calculators = [
     
    ];
  
    // Add relay-specific calculators
    Object.entries(relayProtectionConfigs).forEach(([relayModel, functions]) => {
      Object.entries(functions).forEach(([funcId, func]) => {
        calculators.push({
          id: `${relayModel}-${funcId}`,
          name: func.name,
          description: `${func.name} calculator for ${relayModel}`,
          relayModel,
          functionId: funcId
        });
      });
    });
  
  const [selectedCalculator, setSelectedCalculator] = useState(null);
  const [filteredCalculators, setfilteredCalculators] = useState([]);
  
  useEffect (() => {
    if (filterString&&filterString.length > 0) {
      const filteredCalculators = calculators?.filter((calc) => {
        return calc.name.toLowerCase().includes(filterString.toLowerCase())||calc.description.toLowerCase().includes(filterString.toLowerCase());
      });
      setfilteredCalculators(filteredCalculators);
    } else {
      setfilteredCalculators(calculators);
    }
  }, [filterString]);



  const handleCalculatorSelect = (calc) => {
    setSelectedCalculator(calc);
  };

  return (
    <>
      <div className={styles.mainContainer}>
        {filteredCalculators?.map((calc) => (
          <Card
            key={calc.id}
            variant="outlined"
            sx={{
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'background.level1',
              },
             
              display: 'flex',  
              flexDirection: 'column'
            }}
            onClick={() => handleCalculatorSelect(calc)}
          >
            <CardContent sx={{ 
              flex: 1,
              padding: { xs: 2, sm: 3 },
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <CalculateIcon color="primary" />
              <Typography level="title-md">
                {calc.name}
              </Typography>
              <Typography level="body-sm">
                {calc.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        aria-labelledby="calculator-modal"
        open={!!selectedCalculator}
        onClose={() => setSelectedCalculator(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
       
       <RelaySettingCalculator
                relayModel={selectedCalculator?.relayModel}
                initialFunction={selectedCalculator?.name}
                onClose={() => setSelectedCalculator(null)}
              />
        
      </Modal>
    </>
  );
};

export default CalculatorGrid;
