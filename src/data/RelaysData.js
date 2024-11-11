
// First, create a data file for relay information
// src/data/relaysData.js
const RelaysData = [
  {
    id: 1,
    name: "Schneider P442",
    description: "High performance relay for industrial use",
    specifications: {
      voltage: "24V",
      current: "10A",
      type: "SPDT",
      protectionFunctions: ["Overcurrent", "Short Circuit", "Ground Fault"],
    },
    image: require('../assets/relays/p442/image.png'),
    price: 29.99
  },
  {
    id: 2,
    name: "Siemens Siprotec 7SJ82",
    description: "Multifunctional overcurrent protection relay",
    specifications: {
      voltage: "48V",
      current: "15A",
      type: "DPDT",
      protectionFunctions: ["Overcurrent", "Directional Earth Fault", "Breaker Failure"],
    },
    image: require('../assets/relays/7SJ82/image.png'),
    price: 49.99
  },
  {
    id: 3,
    name: "ABB REF615",
    description: "Compact protection relay for feeder protection",
    specifications: {
      voltage: "48V",
      current: "20A",
      type: "SPDT",
      protectionFunctions: ["Overcurrent", "Undervoltage", "Reverse Power"],
    },
    image: require('../assets/relays/p442/image.png'),
    price: 59.99
  },
  {
    id: 4,
    name: "GE Multilin F35",
    description: "Feeder Protection System with advanced protection",
    specifications: {
      voltage: "24V",
      current: "30A",
      type: "SPDT",
      protectionFunctions: ["Overcurrent", "Underfrequency", "Distance Protection"],
    },
    image:require('../assets/relays/p442/image.png'),
    price: 75.00
  },
  {
    id: 5,
    name: "Schneider MiCOM P642",
    description: "Distance protection relay for transmission line",
    specifications: {
      voltage: "110V",
      current: "15A",
      type: "SPDT",
      protectionFunctions: ["Distance Protection", "Out-of-Step", "Power Swing Blocking"],
    },
    image: require('../assets/relays/p442/image.png'),
    price: 120.99
  },
  {
    id: 6,
    name: "Siemens Reyrolle 7SR10",
    description: "Relay for feeder overcurrent and earth fault protection",
    specifications: {
      voltage: "125V",
      current: "25A",
      type: "DPDT",
      protectionFunctions: ["Overcurrent", "Earth Fault", "Breaker Failure"],
    },
    image: require('../assets/relays/p442/image.png'),
    price: 67.99
  }
  // Add more relay data as needed
];

export default RelaysData;