import React, { useState,useEffect } from 'react';
import { Card, Typography, CardContent, Modal } from '@mui/joy';
import { relayProtectionConfigs } from '../../utils/relayProtectionConfigs';
import CalculateIcon from '@mui/icons-material/Calculate';
import LineParameterCalculator from '../LineParameterCalculator/LineParameterCalculator';
import RelaySettingCalculator from '../RelaySettingCalculator/RelaySettingCalculator';
import styles from './CalculatorGrid.module.css';

const CalculatorGrid = ({filterString}) => {
  const [selectedCalculator, setSelectedCalculator] = useState(null);
  const [filteredCalculators, setfilteredCalculators] = useState([]);
  const [calculators,setcalculators]=useState([])
  // Collect all unique calculators from relay configs
  

 

  useEffect(() => {
    const calculatorsTemp = [
      // Add Line Parameter Calculator as the first item
      {
        id: 'line-parameters',
        name: 'Line Parameter Calculator',
        relayModel:'',
        description: 'Calculate transmission line parameters based on voltage level and configuration'
      }
    ];
     // Add relay-specific calculators
  Object.entries(relayProtectionConfigs).forEach(([relayModel, functions]) => {
    Object.entries(functions).forEach(([funcId, func]) => {
      calculatorsTemp.push({
        id: `${relayModel}-${funcId}`,
        name: func.name,
        description: `${func.name} calculator for ${relayModel}`,
        relayModel,
        functionId: funcId
      });
    });
  });
  setcalculators(calculatorsTemp)
  }, []);

  useEffect(() => {
    if(filterString!==''&&calculators){
      console.log(filterString)
      console.log( calculators.filter((item)=>{return item.name.includes(filterString)}))
      setfilteredCalculators(
        calculators.filter((item)=>{return item.name.toLowerCase().includes(filterString.toLowerCase())||item.relayModel.toLowerCase().includes(filterString.toLowerCase())||item.description.toLowerCase().includes(filterString.toLowerCase())})
      )
    }else{
      setfilteredCalculators(calculators)
    }
   
  }, [filterString,calculators]);

  

  const handleCalculatorSelect = (calc) => {
    setSelectedCalculator(calc);
  };

  return (
    <>
      <div className={styles.mainContainer}>
        {filteredCalculators.map((calc) => (
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
       
          {selectedCalculator?.id === 'line-parameters' ? (
            <LineParameterCalculator />
          ) : (
            selectedCalculator && (
              <RelaySettingCalculator
                relayModel={selectedCalculator.relayModel}
                initialFunction={selectedCalculator.name}
                onClose={() => setSelectedCalculator(null)}
              />
            )
          )}
        
      </Modal>
    </>
  );
};

export default CalculatorGrid;
