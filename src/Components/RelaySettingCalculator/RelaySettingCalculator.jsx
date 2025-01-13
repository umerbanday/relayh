import React, { useState, useEffect } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import { relayProtectionConfigs } from '../../utils/relayProtectionConfigs';

const ResultItem = ({ label, value, level = 0 }) => (
  <Box 
    sx={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 2,
      mb: 1,
      ml: level * 2,
    }}
  >
    <Typography 
      level="body2" 
      sx={{ 
        color: 'text.secondary',
        flexShrink: 0,
        maxWidth: '50%'
      }}
    >
      {label}
    </Typography>
    <Typography 
      level="body1" 
      sx={{ 
        fontWeight: 500,
        textAlign: 'right',
        wordBreak: 'break-word'
      }}
    >
      {value}
    </Typography>
  </Box>
);

const ResultDisplay = ({ results, level = 0 }) => {
  if (typeof results !== 'object' || results === null) {
    return <Typography>{results}</Typography>;
  }

  return Object.entries(results).map(([key, value]) => (
    <Box key={key}>
      {typeof value === 'object' ? (
        <Box 
          sx={{ 
            mb: 2,
            ml: level * 2,
            borderLeft: '2px solid',
            borderColor: 'divider',
            pl: 2
          }}
        >
          <Typography 
            level={level === 0 ? "h6" : "body1"}
            sx={{ 
              fontWeight: 'bold',
              mb: 1,
              color: 'primary.main'
            }}
          >
            {key}
          </Typography>
          <ResultDisplay results={value} level={level + 1} />
        </Box>
      ) : (
        <ResultItem label={key} value={value} level={level} />
      )}
    </Box>
  ));
};

const CalculatorView = ({ currentFunctionConfig, dynamicOptions, handleInputChange, onCalculate }) => (
  <>
    <Grid  container spacing={2}>
      {currentFunctionConfig.inputs.map((input) => (
        <Grid xs={12} md={6} key={input.id}>
          {input.type === 'select' ? (
            <Select
              placeholder={input.label}
              onChange={(_, value) => handleInputChange(input.id, value)}
              sx={{ width: '100%' }}
            >
              {(dynamicOptions[input.id] || input.options).map((opt) => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>
          ) : (
            <Input
              type={input.type}
              placeholder={input.label}
              required={input.required}
              onChange={(e) => handleInputChange(input.id, parseFloat(e.target.value))}
              sx={{ width: '100%' }}
            />
          )}
        </Grid>
      ))}
    </Grid>
    <Box sx={{ mt: 3, textAlign: 'center' }}>
      <Button onClick={onCalculate} size="lg">
        Calculate Settings
      </Button>
    </Box>
  </>
);

const ResultView = ({ results, onBack }) => (
  <>
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
      <Button 
        variant="outlined" 
        color="neutral" 
        onClick={onBack}
        startDecorator="←"
        size="sm"
      >
        Back to Calculator
      </Button>
    </Box>
    <Sheet
      variant="soft"
      color="primary"
      sx={{
        p: 2,
        borderRadius: 'sm',
        maxHeight: '70vh',
        overflow: 'auto'
      }}
    >
      <ResultDisplay results={results} />
    </Sheet>
  </>
);

export default function RelaySettingCalculator({ initialFunction, relayModel, onClose }) {
  const [selectedFunction, setSelectedFunction] = useState('');
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState(null);
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (initialFunction && relayModel) {
      const relayConfig = relayProtectionConfigs[relayModel];
      if (relayConfig) {
        const functionKey = Object.keys(relayConfig).find(
          key => relayConfig[key].name.toLowerCase().includes(initialFunction.toLowerCase())
        );
        if (functionKey) {
          setSelectedFunction(functionKey);
        }
      }
    }
  }, [initialFunction, relayModel]);

  const handleFunctionChange = (_, newValue) => {
    setSelectedFunction(newValue);
    setInputs({});
    setResults(null);
  };

  const handleInputChange = (id, value) => {
    const newInputs = {
      ...inputs,
      [id]: value
    };
    setInputs(newInputs);

    // Update dynamic options if the function has updateOptions method
    const functionConfig = currentRelayConfig?.[selectedFunction];
    if (functionConfig?.updateOptions) {
      const newOptions = functionConfig.updateOptions(newInputs);
      setDynamicOptions(prev => ({
        ...prev,
        ...newOptions
      }));
    }
  };

  const calculateSettings = () => {
    const relayConfig = relayProtectionConfigs[relayModel];
    const functionConfig = relayConfig?.[selectedFunction];
    if (functionConfig) {
      const results = functionConfig.calculate(inputs);
      setResults(results);
      setShowResults(true);
    }
  };

  const handleBack = () => {
    setShowResults(false);
  };

  const currentRelayConfig = relayProtectionConfigs[relayModel];
  const currentFunctionConfig = currentRelayConfig?.[selectedFunction];

  return (
    <CssVarsProvider>
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 600,
          width: '100%',
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 'md',
          boxShadow: 'lg',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="plain" 
            color="neutral" 
            onClick={onClose}
            size="sm"
          >
            ✕
          </Button>
        </Box>
        
        <Typography level="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          {showResults ? 'Calculation Results' : 'Relay Setting Calculator'}
        </Typography>

        {!showResults && (
          <Select
            placeholder="Select Protection Function"
            value={selectedFunction}
            onChange={handleFunctionChange}
            sx={{ mb: 3, width: '100%' }}
          >
            {relayModel && currentRelayConfig &&
              Object.entries(currentRelayConfig).map(([key, func]) => (
                <Option key={key} value={key}>
                  {func.name}
                </Option>
              ))}
          </Select>
        )}

        {currentFunctionConfig && (
          showResults ? (
            <ResultView results={results} onBack={handleBack} />
          ) : (
            <CalculatorView 
              currentFunctionConfig={currentFunctionConfig}
              dynamicOptions={dynamicOptions}
              handleInputChange={handleInputChange}
              onCalculate={calculateSettings}
            />
          )
        )}
      </Sheet>
    </CssVarsProvider>
  );
}
