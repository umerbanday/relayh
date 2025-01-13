import React, { useState } from 'react';
import { Card, Typography, CardContent, Modal } from '@mui/joy';
import { relayProtectionConfigs } from '../../utils/relayProtectionConfigs';
import CalculateIcon from '@mui/icons-material/Calculate';
import LineParameterCalculator from '../LineParameterCalculator/LineParameterCalculator';
import RelaySettingCalculator from '../RelaySettingCalculator/RelaySettingCalculator';
import styles from './CalculatorGrid.module.css';

const CalculatorGrid = () => {
  const [selectedCalculator, setSelectedCalculator] = useState(null);

  // Collect all unique calculators from relay configs
  const calculators = [
    // Add Line Parameter Calculator as the first item
    {
      id: 'line-parameters',
      name: 'Line Parameter Calculator',
      description: 'Calculate transmission line parameters based on voltage level and configuration'
    }
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

  const handleCalculatorSelect = (calc) => {
    setSelectedCalculator(calc);
  };

  return (
    <>
      <div className={styles.mainContainer}>
        {calculators.map((calc) => (
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
          justifyContent: 'center',
          '& .MuiModal-backdrop': {
            backdropFilter: 'blur(3px)'
          }
        }}
      >
        <div style={{ 
          width: '90%', 
          maxWidth: '600px',
          margin: '20px'
        }}>
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
        </div>
      </Modal>
    </>
  );
};

export default CalculatorGrid;
