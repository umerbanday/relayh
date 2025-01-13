import { transmissionLineData } from "../data/transmissionLineData";
import { calculateLineParameters } from './lineParameterUtils';

export const relayProtectionConfigs = {
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
  },
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
        { id: 'line_length', label: 'Protected Line Length (km)', type: 'number', required: true },
        { id: 'line_config', label: 'Line Configuration', type: 'select',
          options: [] }, // Will be populated based on voltage selection
        { id: 'conductor_type', label: 'Conductor Type', type: 'select',
          options: [] }, // Will be populated based on configuration selection
      ],
      calculate: (inputs) => {
        // Calculate CT and PT ratios
        const CTR = inputs.ct_primary / inputs.ct_secondary;
        const PTR = (inputs.pt_primary * 1000) / inputs.pt_secondary;
        const ctVtRatio = CTR / PTR;

        // Get line parameters using the utility function
        const lineParams = calculateLineParameters(
          inputs.voltage_level,
          inputs.line_config,
          inputs.conductor_type,
          inputs.line_length
        );

        if (!lineParams) return null;

        // Calculate impedance values using the converted actual values
        const Z1_mag = Math.sqrt(
          Math.pow(lineParams.positiveSeq.R, 2) + 
          Math.pow(lineParams.positiveSeq.X, 2)
        );
        const Z1_angle = Math.atan2(lineParams.positiveSeq.X, lineParams.positiveSeq.R) * (180/Math.PI);

        // Calculate zero sequence values
        const Z0_mag = Math.sqrt(
          Math.pow(lineParams.zeroSeq.R0, 2) + 
          Math.pow(lineParams.zeroSeq.X0, 2)
        );
        const Z0_angle = Math.atan2(lineParams.zeroSeq.X0, lineParams.zeroSeq.R0) * (180/Math.PI);

        // Calculate grounding factors using actual values
        const Kg_numerator = Math.sqrt(
          Math.pow(lineParams.zeroSeq.X0 - lineParams.positiveSeq.X, 2) + 
          Math.pow(lineParams.zeroSeq.R0 - lineParams.positiveSeq.R, 2)
        );
        const Kg_denominator = 3 * Math.sqrt(
          Math.pow(lineParams.positiveSeq.R, 2) + 
          Math.pow(lineParams.positiveSeq.X, 2)
        );

        // Calculate zone reaches
        const zone1Reach = 0.8 * Z1_mag * ctVtRatio;
        const zone2Reach = 1.5 * Z1_mag * ctVtRatio;
        const zone3Reach = 2.2 * Z1_mag * ctVtRatio;
        const zone4Reach = 0.25 * zone1Reach;

        // Calculate resistive reach
        const primaryFullLoadCurrent = inputs.ct_primary;
        const loadResistance = (0.8 * inputs.voltage_level * 1000 / Math.sqrt(3)) / (2 * primaryFullLoadCurrent);
        const resistiveReachSecondary = loadResistance * ctVtRatio;

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

          'Line Parameter Z1 (Ω/kM)': lineParams.positiveSeqPerKm.R.toFixed(6) + ' + j' + lineParams.positiveSeqPerKm.X.toFixed(6),
          
          // Line impedance parameters
          'Z1 Resistance (Ω)': lineParams.positiveSeq.R.toFixed(6),
          'Z1 Reactance (Ω)': lineParams.positiveSeq.X.toFixed(6),
          'Z1 Magnitude (Ω)': Z1_mag.toFixed(6),
          'Z1 Angle (degrees)': Z1_angle.toFixed(3),
          
          'Z0 Resistance (Ω)': lineParams.zeroSeq.R0.toFixed(6),
          'Z0 Reactance (Ω)': lineParams.zeroSeq.X0.toFixed(6),
          'Z0 Magnitude (Ω)': Z0_mag.toFixed(6),
          'Z0 Angle (degrees)': Z0_angle.toFixed(3),
          
          // Grounding factor calculations
          'Kg Numerator': Kg_numerator.toFixed(6),
          'Kg Denominator': Kg_denominator.toFixed(6),
          'Grounding Factor Kg Magnitude': (Kg_numerator / Kg_denominator).toFixed(6),
          'Grounding Factor Kg Angle (degrees)': (Math.atan2(lineParams.zeroSeq.X0 - lineParams.positiveSeq.X, lineParams.zeroSeq.R0 - lineParams.positiveSeq.R) - Math.atan2(lineParams.positiveSeq.X, lineParams.positiveSeq.R)) * (180/Math.PI).toFixed(3),
          
          // Zone reaches
          'Zone 1 Reach (Ω)': zone1Reach.toFixed(3),
          'Zone 2 Reach (Ω)': zone2Reach.toFixed(3),
          'Zone 3 Reach (Ω)': zone3Reach.toFixed(3),
          'Zone 4 Reach (Ω)': zone4Reach.toFixed(3),
          
          // Resistive reach calculations
          'Load Resistance Primary (Ω)': loadResistance.toFixed(3),
          'Resistive Reach Secondary (Ω)': resistiveReachSecondary.toFixed(3),

          plotData: plotData
        };
      },
      // Dynamic options update based on selections
      updateOptions: (currentInputs) => {
        if (currentInputs.voltage_level) {
          const voltageData = transmissionLineData.find(
            v => v.voltage === Number(currentInputs.voltage_level)
          );
          const configs = [...new Set(voltageData?.configs.map(c => c.config) || [])];
          const conductors = currentInputs.line_config ? 
            [...new Set(voltageData?.configs
              .filter(c => c.config === currentInputs.line_config)
              .flatMap(c => c.conductors) || [])] : [];
          
          return {
            line_config: configs,
            conductor_type: conductors
          };
        }
        return {};
      }
    },
    // ...other protection functions for P442...
  }
  // Add more relay models as needed
};
