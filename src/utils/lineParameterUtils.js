import { transmissionLineData } from '../data/transmissionLineData';

export const calculateLineParameters = (voltage, config, conductor, lineLength) => {
  const voltageData = transmissionLineData.find(item => item.voltage === Number(voltage));
  const configData = voltageData?.configs.find(c => 
    c.config === config && c.conductors.includes(conductor)
  );

  if (!configData) return null;

  const convertPerUnitToActual = (perUnitValue, baseImpedance) => {
    return Number((perUnitValue * baseImpedance).toFixed(5));
  };

  return {
    baseImpedance: voltageData.baseImpedance,
    positiveSeqPerKm: {
      R: convertPerUnitToActual(configData.positiveSeq.R, voltageData.baseImpedance),
      X: convertPerUnitToActual(configData.positiveSeq.X, voltageData.baseImpedance),
      B: convertPerUnitToActual(configData.positiveSeq.B, voltageData.baseImpedance)
    },
    zeroSeqPerKm: {
        R0: convertPerUnitToActual(configData.zeroSeq.R0, voltageData.baseImpedance),
        X0: convertPerUnitToActual(configData.zeroSeq.X0, voltageData.baseImpedance),
        B0: convertPerUnitToActual(configData.zeroSeq.B0, voltageData.baseImpedance)
        },
    positiveSeq: {
      R: convertPerUnitToActual(configData.positiveSeq.R, voltageData.baseImpedance) * lineLength,
      X: convertPerUnitToActual(configData.positiveSeq.X, voltageData.baseImpedance) * lineLength,
      B: convertPerUnitToActual(configData.positiveSeq.B, voltageData.baseImpedance) * lineLength
    },
    zeroSeq: {
      R0: convertPerUnitToActual(configData.zeroSeq.R0, voltageData.baseImpedance) * lineLength,
      X0: convertPerUnitToActual(configData.zeroSeq.X0, voltageData.baseImpedance) * lineLength,
      B0: convertPerUnitToActual(configData.zeroSeq.B0, voltageData.baseImpedance) * lineLength
    }
  };
};
