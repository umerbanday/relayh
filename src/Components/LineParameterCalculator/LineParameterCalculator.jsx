import React, { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Button from '@mui/joy/Button';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import { transmissionLineData } from '../../data/transmissionLineData';

export default function LineParameterCalculator() {
    const [selectedVoltage, setSelectedVoltage] = useState(null);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [selectedConductor, setSelectedConductor] = useState(null);
    const [result, setResult] = useState(null);
  
    const availableVoltages = [...new Set(transmissionLineData.map(item => item.voltage))];
  
    const getConfigsForVoltage = () => {
      const voltageData = transmissionLineData.find(item => item.voltage === selectedVoltage);
      return voltageData ? [...new Set(voltageData.configs.map(config => config.config))] : [];
    };
  
    const getConductorsForConfig = () => {
      const voltageData = transmissionLineData.find(item => item.voltage === selectedVoltage);
      // Find all configs with the selected configuration
      const configData = voltageData?.configs.filter(config => config.config === selectedConfig);
      // Return unique conductors for this configuration
      return configData ? [...new Set(configData.flatMap(config => config.conductors))] : [];
    };
  
    const calculateParameters = () => {
      const voltageData = transmissionLineData.find(item => item.voltage === selectedVoltage);
      const configData = voltageData?.configs.find(config => 
        config.config === selectedConfig && config.conductors.includes(selectedConductor)
      );
  
      if (configData) {
        // Convert per-unit values to actual values using base impedance
        const convertPerUnitToActual = (perUnitValue, baseImpedance) => {
          return Number((perUnitValue * baseImpedance).toFixed(5));
        };

        setResult({
          baseImpedance: voltageData.baseImpedance,
          positiveSeq: {
            R: convertPerUnitToActual(configData.positiveSeq.R, voltageData.baseImpedance),
            X: convertPerUnitToActual(configData.positiveSeq.X, voltageData.baseImpedance),
            B: convertPerUnitToActual(configData.positiveSeq.B, voltageData.baseImpedance)
          },
          zeroSeq: {
            R0: convertPerUnitToActual(configData.zeroSeq.R0, voltageData.baseImpedance),
            X0: convertPerUnitToActual(configData.zeroSeq.X0, voltageData.baseImpedance),
            B0: convertPerUnitToActual(configData.zeroSeq.B0, voltageData.baseImpedance)
          }
        });
      }
    };
  
    return (
      <CssVarsProvider>
        <Sheet 
          variant="outlined" 
          sx={{ 
            maxWidth: 600,
            width:"100%",
            mx: 'auto', 
            my: 4, 
            p: 3, 
            borderRadius: 'md',
            boxShadow: 'md'
          }}
        >
          <Typography level="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
            Transmission Line Parameters Calculator
          </Typography>
  
          <Grid container spacing={2}>
            <Grid xs={12} md={4}>
              <Select
                placeholder="Voltage (kV)"
                value={selectedVoltage}
                onChange={(_, newValue) => {
                  setSelectedVoltage(newValue);
                  setSelectedConfig(null);
                  setSelectedConductor(null);
                  setResult(null);
                }}
              >
                {availableVoltages.map(voltage => (
                  <Option key={voltage} value={voltage}>
                    {voltage} kV
                  </Option>
                ))}
              </Select>
            </Grid>
  
            <Grid xs={12} md={4}>
              <Select
                placeholder="Configuration"
                value={selectedConfig}
                disabled={!selectedVoltage}
                onChange={(_, newValue) => {
                  setSelectedConfig(newValue);
                  setSelectedConductor(null);
                  setResult(null);
                }}
              >
                {getConfigsForVoltage().map(config => (
                  <Option key={config} value={config}>
                    {config}
                  </Option>
                ))}
              </Select>
            </Grid>
  
            <Grid xs={12} md={4}>
              <Select
                placeholder="Conductor"
                value={selectedConductor}
                disabled={!selectedConfig}
                onChange={(_, newValue) => {
                  setSelectedConductor(newValue);
                  setResult(null);
                }}
              >
                {getConductorsForConfig().map(conductor => (
                  <Option key={conductor} value={conductor}>
                    {conductor}
                  </Option>
                ))}
              </Select>
            </Grid>
          </Grid>
  
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              onClick={calculateParameters}
              disabled={!selectedVoltage || !selectedConfig || !selectedConductor}
            >
              Calculate Parameters
            </Button>
          </Box>
  
          {result && (
            <Sheet 
              variant="soft" 
              color="primary" 
              sx={{ 
                mt: 3, 
                p: 2, 
                borderRadius: 'sm' 
              }}
            >
              <Typography level="h6" sx={{ mb: 2 }}>Results</Typography>
              {/*<Typography sx={{ mb: 2 }}>Base Impedance: {result.baseImpedance} Ω</Typography>*/}
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <Typography fontWeight="lg">Positive Sequence:</Typography>
                  <Typography>R: {result.positiveSeq.R} Ω/km</Typography>
                  <Typography>X: {result.positiveSeq.X} Ω/km</Typography>
                  <Typography>B: {result.positiveSeq.B} Ω/km</Typography>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography fontWeight="lg">Zero Sequence:</Typography>
                  <Typography>R0: {result.zeroSeq.R0} Ω/km</Typography>
                  <Typography>X0: {result.zeroSeq.X0} Ω/km</Typography>
                  <Typography>B0: {result.zeroSeq.B0} Ω/km</Typography>
                </Grid>
              </Grid>
            </Sheet>
          )}
        </Sheet>
      </CssVarsProvider>
    );
  }