import React, { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Button from '@mui/joy/Button';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';

// Full Transmission line data
const transmissionLineData = [
  {
    voltage: 765,
    baseImpedance:5852.25,
    configs: [
      {
        config: 'Quad @ACSR',
        conductors: ['Bersimis S/C'],
        positiveSeq: { R: 1.951E-6, X: 4.880E-5, B: 2.35E-2 },
        zeroSeq: { R0: 4.500E-5, X0: 1.800E-4, B0: 1.406E-2 }
      },
      {
        config: 'Hexa @ACSR',
        conductors: ['Zebra D/C'],
        positiveSeq: { R: 2.096E-6, X: 4.360E-5, B: 2.66E-2 },
        zeroSeq: { R0: 3.839E-5, X0: 1.576E-4, B0: 1.613E-2 }
      },
      {
        config: 'Hexa #ACSR',
        conductors: ['Zebra D/C'],
        positiveSeq: { R: 2.076E-6, X: 4.338E-5, B: 2.675E-2 },
        zeroSeq: { R0: 3.662E-5, X0: 1.582E-4, B0: 1.605E-2 }
      },
      {
        config: 'Hexa #AL59',
        conductors: ['61/3.08 D/C'],
        positiveSeq: { R: 2.056E-6, X: 4.351E-5, B: 2.671E-2 },
        zeroSeq: { R0: 3.660E-5, X0: 1.583E-4, B0: 1.609E-2 }
      },
      {
        config: 'Twin ACSR',
        conductors: ['Moose S/C'],
        positiveSeq: { R: 1.862E-5, X: 2.075E-4, B: 5.55E-3 },
        zeroSeq: { R0: 1.012E-4, X0: 7.750E-4, B0: 3.584E-3 }
      },
      {
        config: 'Twin ACSR',
        conductors: ['Moose D/C'],
        positiveSeq: { R: 1.800E-5, X: 1.923E-4, B: 6.02E-3 },
        zeroSeq: { R0: 1.672E-4, X0: 6.711E-4, B0: 3.669E-3 }
      },
      {
        config: 'Twin AL59',
        conductors: ['61/3.31 D/C'],
        positiveSeq: { R: 1.871E-5, X: 1.946E-4, B: 5.980E-3 },
        zeroSeq: { R0: 1.556E-4, X0: 6.777E-4, B0: 3.650E-3 }
      },
      {
        config: 'Twin ACSR',
        conductors: ['Lapwing S/C'],
        positiveSeq: { R: 1.230E-5, X: 1.910E-4, B: 6.08E-3 },
        zeroSeq: { R0: 6.685E-5, X0: 7.134E-4, B0: 3.926E-3 }
      },
      {
        config: 'Twin ACSR',
        conductors: ['Lapwing D/C'],
        positiveSeq: { R: 1.204E-5, X: 1.905E-4, B: 6.08E-3 },
        zeroSeq: { R0: 1.606E-4, X0: 6.651E-4, B0: 3.682E-3 }
      },
      {
        config: 'Twin Moose eq. AAAC',
        conductors: ['S/C'],
        positiveSeq: { R: 1.934E-5, X: 2.065E-4, B: 5.67E-3 },
        zeroSeq: { R0: 1.051E-4, X0: 7.730E-4, B0: 3.660E-3 }
      },
      {
        config: 'Triple ACSR',
        conductors: ['Zebra S/C'],
        positiveSeq: { R: 1.401E-5, X: 1.870E-4, B: 5.86E-3 },
        zeroSeq: { R0: 7.616E-3, X0: 6.949E-4, B0: 3.783E-3 }
      }
    ]
  },
  {
    voltage: 400,
    baseImpedance: 1600,
    configs: [
      {
        config: 'Triple ACSR',
        conductors: ['Snowbird D/C'],
        positiveSeq: { R: 1.193E-5, X: 1.721E-4, B: 6.733E-3 },
        zeroSeq: { R0: 1.477E-3, X0: 6.499E-4, B0: 3.950E-3 }
      },
      {
        config: 'Quad ACSR',
        conductors: ['Zebra S/C'],
        positiveSeq: { R: 1.050E-5, X: 1.590E-4, B: 6.60E-3 },
        zeroSeq: { R0: 5.708E-3, X0: 5.940E-4, B0: 4.294E-3 }
      },
      {
        config: 'Quad ACSR',
        conductors: ['Bersimis S/C'],
        positiveSeq: { R: 7.416E-6, X: 1.560E-4, B: 7.46E-3 },
        zeroSeq: { R0: 4.031E-3, X0: 5.828E-4, B0: 4.854E-3 }
      },
      {
        config: 'Quad ACSR',
        conductors: ['Moose S/C'],
        positiveSeq: { R: 9.167E-6, X: 1.580E-4, B: 7.32E-3 },
        zeroSeq: { R0: 1.550E-4, X0: 6.250E-4, B0: 4.220E-3 }
      },
      {
        config: 'Quad ACSR',
        conductors: ['Moose D/C'],
        positiveSeq: { R: 9.177E-6, X: 1.582E-4, B: 7.33E-3 },
        zeroSeq: { R0: 1.557E-4, X0: 6.246E-4, B0: 4.237E-3 }
      },
      {
        config: 'Quad AL59',
        conductors: ['61/3.31 D/C'],
        positiveSeq: { R: 9.506E-6, X: 1.594E-4, B: 7.299E-3 },
        zeroSeq: { R0: 1.439E-4, X0: 6.318E-4, B0: 4.221E-3 }
      },
      {
        config: 'Quad Moose eq. AAAC',
        conductors: ['S/C'],
        positiveSeq: { R: 9.790E-6, X: 1.676E-4, B: 6.99E-3 },
        zeroSeq: { R0: 5.320E-3, X0: 6.260E-4, B0: 4.510E-3 }
      },
      {
        config: 'Twin ACSR',
        conductors: ['Moose S/C'],
        positiveSeq: { R: 4.304E-5, X: 5.819E-4, B: 1.98E-3 },
        zeroSeq: { R0: 4.200E-4, X0: 2.414E-3, B0: 1.107E-3 }
      }
    ]
  },
  {
    voltage: 220,
    baseImpedance:484,
    configs: [
      {
        config: 'Single ACSR',
        conductors: ['Zebra S/C'],
        positiveSeq: { R: 1.440E-4, X: 8.220E-4, B: 1.41E-3 },
        zeroSeq: { R0: 4.231E-4, X0: 2.757E-3, B0: 8.843E-4 }
      },
      {
        config: 'Single ACSR',
        conductors: ['Drake S/C'],
        positiveSeq: { R: 1.800E-4, X: 8.220E-4, B: 1.41E-3 },
        zeroSeq: { R0: 6.1E-4, X0: 2.56E-3, B0: 8.050E-4 }
      },
      {
        config: 'Single ACSR',
        conductors: ['Moose S/C'],
        positiveSeq: { R: 1.547E-4, X: 8.249E-4, B: 1.42E-3 },
        zeroSeq: { R0: 4.545E-4, X0: 2.767E-3, B0: 8.906E-4 }
      },
      {
        config: 'Single ACSR',
        conductors: ['Kunda S/C'],
        positiveSeq: { R: 1.547E-4, X: 8.249E-4, B: 1.42E-3 },
        zeroSeq: { R0: 4.545E-4, X0: 2.767E-3, B0: 8.906E-4 }
      },
      {
        config: 'Single AAAC',
        conductors: ['Zebra S/C'],
        positiveSeq: { R: 1.547E-4, X: 8.249E-4, B: 1.42E-3 },
        zeroSeq: { R0: 4.545E-4, X0: 2.767E-3, B0: 8.906E-4 }
      },
      {
        config: 'Single ACSR',
        conductors: ['Zebra D/C'],
        positiveSeq: { R: 1.416E-4, X: 8.227E-4, B: 1.407E-3 },
        zeroSeq: { R0: 5.398E-4, X0: 2.676E-3, B0: 8.869E-4 }
      },
      {
        config: 'Single ACSR',
        conductors: ['Moose D/C'],
        positiveSeq: { R: 1.152E-4, X: 8.078E-4, B: 1.433E-3 },
        zeroSeq: { R0: 5.137E-4, X0: 2.661E-3, B0: 9.074E-4 }
      },
      {
        config: 'Twin ACSR',
        conductors: ['Zebra D/C'],
        positiveSeq: { R: 7.049E-5, X: 5.842E-4, B: 2.006E-3 },
        zeroSeq: { R0: 4.692E-4, X0: 2.437E-3, B0: 1.132E-3 }
      },
      {
        config: 'Twin ACSR',
        conductors: ['Moose D/C'],
        positiveSeq: { R: 5.772E-5, X: 5.767E-4, B: 2.003E-3 },
        zeroSeq: { R0: 4.563E-4, X0: 2.429E-3, B0: 1.118E-3 }
      },
      {
        config: 'Twin AL59',
        conductors: ['ZEBRA D/C'],
        positiveSeq: { R: 7.027E-5, X: 5.885E-4, B: 1.973E-3 },
        zeroSeq: { R0: 4.672E-4, X0: 2.442E-3, B0: 1.118E-3 }
      },
      {
        config: 'Twin AL59',
        conductors: ['Moose D/C'],
        positiveSeq: { R: 6.132E-5, X: 5.851E-4, B: 1.990E-3 },
        zeroSeq: { R0: 4.583E-4, X0: 2.438E-3, B0: 1.127E-3 }
      }
    ]
  },
  {
    voltage: 132,
    baseImpedance:174.24,
    configs: [
      {
        config: 'Single ACSR',
        conductors: ['PANTHER D/C'],
        positiveSeq: { R: 7.823E-4, X: 2.323E-3, B: 4.950E-4 },
        zeroSeq: { R0: 1.957E-4, X0: 7.606E-3, B0: 3.138E-4 }
      }
    ]
  },
  {
    voltage: 66,
    baseImpedance: 43.56,
    configs: [
      {
        config: 'Single ACSR',
        conductors: ['DOG D/C'],
        positiveSeq: { R: 6.299E-3, X: 1.024E-2, B: 1.242E-4 },
        zeroSeq: { R0: 1.103E-2, X0: 3.305E-2, B0: 8.171E-5 }
      }
    ]
  }
];

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