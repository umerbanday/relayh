import { transmissionLineData } from "../data/transmissionLineData";
import { calculateLineParameters } from './lineParameterUtils';

export const relayProtectionConfigs = {

  'Schneider P442': {
    'distance-21': {
      name: 'Distance Protection (21)',
      inputs: [
        { id: 'voltage_level', label: 'Voltage Level (kV)', type: 'select',
          options: [765, 400, 220, 132, 66].map(v => v.toString()) },
        { id: 'ct_primary', label: 'CT Primary (A)', type: 'number', required: true },
        { id: 'ct_secondary', label: 'CT Secondary (A)', type: 'number', required: true },
        { id: 'pt_primary', label: 'PT Primary (kV)', type: 'number', required: true },
        { id: 'pt_secondary', label: 'PT Secondary (V)', type: 'number', required: true },
        // Protected line inputs
        { id: 'line_length', label: 'Protected Line Length (km)', type: 'number', required: true },
        { id: 'protected_line_config', label: 'Protected Line Configuration', type: 'select', options: [] },
        { id: 'protected_conductor_type', label: 'Protected Line Conductor', type: 'select', options: [] },
        // Longest adjacent line inputs
        { id: 'longest_adjacent_line', label: 'Longest Line at Adjacent Station (km)', type: 'number', required: true },
        { id: 'adjacent_line_config', label: 'Adjacent Line Configuration', type: 'select', options: [] },
        { id: 'adjacent_conductor_type', label: 'Adjacent Line Conductor', type: 'select', options: [] },
        // Shortest local line inputs
        { id: 'shortest_local_line', label: 'Shortest Local Line (km)', type: 'number', required: true },
        { id: 'local_line_config', label: 'Local Line Configuration', type: 'select', options: [] },
        { id: 'local_conductor_type', label: 'Local Line Conductor', type: 'select', options: [] },
      ],
      calculate: (inputs) => {
        const CTR = inputs.ct_primary / inputs.ct_secondary;
        const PTR = (inputs.pt_primary * 1000) / inputs.pt_secondary;
        const ctVtRatio = CTR / PTR;

        // Calculate parameters for each line
        const protectedLineParams = calculateLineParameters(
          inputs.voltage_level,
          inputs.protected_line_config,
          inputs.protected_conductor_type,
          inputs.line_length
        );

        const adjacentLineParams = calculateLineParameters(
          inputs.voltage_level,
          inputs.adjacent_line_config,
          inputs.adjacent_conductor_type,
          inputs.longest_adjacent_line
        );

        const localLineParams = calculateLineParameters(
          inputs.voltage_level,
          inputs.local_line_config,
          inputs.local_conductor_type,
          inputs.shortest_local_line
        );

        if (!protectedLineParams || !adjacentLineParams || !localLineParams) return null;


        // Protected line impedance calculations
        const Z1_mag = Math.sqrt(
          Math.pow(protectedLineParams.positiveSeq.R, 2) + 
          Math.pow(protectedLineParams.positiveSeq.X, 2)
        );
        const Z1_angle = Math.atan2(protectedLineParams.positiveSeq.X, protectedLineParams.positiveSeq.R) * (180/Math.PI);

        // Zone calculations using specific line parameters
        const zone1Reach = 0.8 * Z1_mag * ctVtRatio;
        
        // Zone 2 considers protected line + 50% of shortest adjacent line
        const zone2Reach = (Z1_mag*1.5) * ctVtRatio;

        // Zone 3 considers protected line + 100% of longest adjacent line
        const zone3Reach = (Z1_mag + Math.sqrt(
          Math.pow(adjacentLineParams.positiveSeq.R, 2) + 
          Math.pow(adjacentLineParams.positiveSeq.X, 2)
        )) * ctVtRatio *1.2;

        // Zone 4 (reverse) uses local line parameters
        const zone4Reach = -0.5 * Math.sqrt(
          Math.pow(localLineParams.positiveSeq.R, 2) + 
          Math.pow(localLineParams.positiveSeq.X, 2)
        ) * ctVtRatio;

        // Calculate zero sequence values
        const Z0_mag = Math.sqrt(
          Math.pow(protectedLineParams.zeroSeq.R0, 2) + 
          Math.pow(protectedLineParams.zeroSeq.X0, 2)
        );
        const Z0_angle = Math.atan2(protectedLineParams.zeroSeq.X0, protectedLineParams.zeroSeq.R0) * (180/Math.PI);

        // Calculate grounding factors using actual values
        const Kg_numerator = Math.sqrt(
          Math.pow(protectedLineParams.zeroSeq.X0 - protectedLineParams.positiveSeq.X, 2) + 
          Math.pow(protectedLineParams.zeroSeq.R0 - protectedLineParams.positiveSeq.R, 2)
        );
        const Kg_denominator = 3 * Math.sqrt(
          Math.pow(protectedLineParams.positiveSeq.R, 2) + 
          Math.pow(protectedLineParams.positiveSeq.X, 2)
        );

        // Calculate resistive reach
        const primaryFullLoadCurrent = inputs.ct_primary;
        const loadResistance = (0.8 * inputs.voltage_level * 1000 / Math.sqrt(3)) / (2 * primaryFullLoadCurrent);
        const resistiveReachSecondary = loadResistance * ctVtRatio;
        const resistiveReachSecondaryPh = loadResistance * ctVtRatio*0.8;
        const resistiveReachSecondaryEf = loadResistance * ctVtRatio*0.9;

        // Create plotting data
        const plotData = {
          zones: {
            1: { reach: zone1Reach, resistiveReach: resistiveReachSecondary },
            2: { reach: zone2Reach, resistiveReach: resistiveReachSecondary },
            3: { reach: zone3Reach, resistiveReach: resistiveReachSecondary },
            4: { reach: zone4Reach, resistiveReach: resistiveReachSecondary }
          },
          lineAngle: Z1_angle
        };

        return {
          // Input parameters
          'Line Length (km)': inputs.line_length,
          'CT Primary (A)': inputs.ct_primary,
          'CT Secondary (A)': inputs.ct_secondary,
          'PT Primary (kV)': inputs.pt_primary,
          'PT Secondary (V)': inputs.pt_secondary,
          
          // Calculated ratios
          'CT Ratio (CTR)': CTR.toFixed(3),
          'PT Ratio (PTR)': PTR.toFixed(3),
          'CT-VT Ratio': ctVtRatio.toFixed(3),

          
          'Line Parameters': {
            'Protected Line': {
              'Z1': protectedLineParams.positiveSeqPerKm.R.toFixed(6) + ' + j' + protectedLineParams.positiveSeqPerKm.X.toFixed(6),
              'Z0': protectedLineParams.zeroSeqPerKm.R0.toFixed(6) + ' + j' + protectedLineParams.zeroSeqPerKm.X0.toFixed(6)
            },
            'Adjacent Line': {
              'Z1': adjacentLineParams.positiveSeqPerKm.R.toFixed(6) + ' + j' + adjacentLineParams.positiveSeqPerKm.X.toFixed(6),
              'Z0': adjacentLineParams.zeroSeqPerKm.R0.toFixed(6) + ' + j' + adjacentLineParams.zeroSeqPerKm.X0.toFixed(6)
            },
            'Local Line': {
              'Z1': localLineParams.positiveSeqPerKm.R.toFixed(6) + ' + j' + localLineParams.positiveSeqPerKm.X.toFixed(6),
              'Z0': localLineParams.zeroSeqPerKm.R0.toFixed(6) + ' + j' + localLineParams.zeroSeqPerKm.X0.toFixed(6)
            }
          },
          
          'kG Residual Factor': {
          // Grounding factor calculations
          'Kg Numerator': Kg_numerator.toFixed(6),
          'Kg Denominator': Kg_denominator.toFixed(6),
          'Grounding Factor Kg Magnitude': (Kg_numerator / Kg_denominator).toFixed(6),
          'Grounding Factor Kg Angle (degrees)': (Math.atan2(protectedLineParams.zeroSeq.X0 - protectedLineParams.positiveSeq.X, protectedLineParams.zeroSeq.R0 - protectedLineParams.positiveSeq.R) - Math.atan2(protectedLineParams.positiveSeq.X, protectedLineParams.positiveSeq.R)) * (180/Math.PI).toFixed(3),
          },

          'Resistive Reach': {
          // Resistive reach calculations
          'Load Resistance Primary (Ohms)': loadResistance.toFixed(3),
          'Resistive Reach Secondary Ph-Ph (Ohms)': resistiveReachSecondaryPh.toFixed(3),
          'Resistive Reach Secondary Ph-G (Ohms)': resistiveReachSecondaryEf.toFixed(3),
          },
          // Zone Reaches
          'Zone Reaches': {
            'Zone 1 (Ohms)': zone1Reach.toFixed(3),
            'Zone 2 (Ohms)': zone2Reach.toFixed(3),
            'Zone 3 (Ohms)': zone3Reach.toFixed(3),
            'Zone 4 (Ohms) [Reverse]': zone4Reach.toFixed(3)
          }
        };
      },
      // Dynamic options update based on selections
      updateOptions: (currentInputs) => {
        if (currentInputs.voltage_level) {
          const voltageData = transmissionLineData.find(
            v => v.voltage === Number(currentInputs.voltage_level)
          );
          const configs = [...new Set(voltageData?.configs.map(c => c.config) || [])];
          
          const getConfigConductors = (configType) => {
            return currentInputs[configType] ? 
              [...new Set(voltageData?.configs
                .filter(c => c.config === currentInputs[configType])
                .flatMap(c => c.conductors) || [])] : [];
          };

          return {
            protected_line_config: configs,
            adjacent_line_config: configs,
            local_line_config: configs,
            protected_conductor_type: getConfigConductors('protected_line_config'),
            adjacent_conductor_type: getConfigConductors('adjacent_line_config'),
            local_conductor_type: getConfigConductors('local_line_config')
          };
        }
        return {};
      }
    },
    // ...other protection functions for P442...
  },
  'SEL-751A': {
    'overcurrent-51': {
      name: 'Time Overcurrent (51)',
      inputs: [
        { id: 'ct_ratio', label: 'CT Ratio', type: 'number', required: true },
        { id: 'full_load_current', label: 'Full Load Current (A)', type: 'number', required: true },
        { id: 'fault_current', label: 'Maximum Fault Current (A)', type: 'number', required: true },
        { id: 'curve_type', label: 'Time-Current Curve', type: 'select', 
          options: ['U1-Moderately Inverse', 'U2-Inverse', 'U3-Very Inverse', 'U4-Extremely Inverse'] }
      ],
      calculate: (inputs) => {
        const pickup = (inputs.full_load_current * 1.5) / inputs.ct_ratio;
        const tms = 0.1;
        return {
          'Pickup Current (A)': pickup.toFixed(2),
          'Time Dial': tms.toFixed(2),
          'Curve Type': inputs.curve_type
        };
      }
    }
  },
  'Siemens-7SJ62': {
    'overcurrent-51': {
      name: 'Time Overcurrent (51)',
      inputs: [
        { id: 'ct_ratio', label: 'CT Ratio', type: 'number', required: true },
        { id: 'full_load_current', label: 'Full Load Current (A)', type: 'number', required: true },
        { id: 'curve_type', label: 'Time-Current Curve', type: 'select', 
          options: ['IEC Normal Inverse', 'IEC Very Inverse', 'IEC Extremely Inverse'] }
      ],
      calculate: (inputs) => {
        // Siemens-specific calculation logic
        return { /* calculation results */ };
      }
    }
  }
  // Add more relay models as needed
};
