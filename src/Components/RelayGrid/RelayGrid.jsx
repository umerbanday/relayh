import React from "react";
import RelaysData from "../../data/RelaysData";
import RelayCard from "../relaycard/RelayCard";
import styles from './RelayGrid.module.css'

const RelayGrid = () => {
    return (
      <div className={styles.mainContainer}>
       
        {RelaysData.map(relay => (
            <RelayCard key={relay.id} relay={relay} />
          ))}
        </div>
    );
  };
  export default RelayGrid;