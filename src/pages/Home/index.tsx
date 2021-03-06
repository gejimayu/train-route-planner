import * as React from 'react';

// Components
import InstructionComponent from './components/Instruction';
import FormInput from './components/FormInput';

// Utils;
import { fetchGET } from 'utils/fetch';
import pathFinder from 'utils/pathFinder';
import { formatResultsAsInstruction } from 'utils/formatData';

// Assets
import MRTLogo from 'assets/images/mrt-logo.png';

// Types
import { StationData } from 'types/station';

import styles from './Home.module.scss';
import { Instruction } from 'types/instruction';

function Home() {
  const [stationData, setStationData] = React.useState<StationData>();
  const [instructions, setInstructions] = React.useState<Instruction[]>();

  React.useEffect(() => {
    const getData = async () => {
      const response = await fetchGET<StationData>('/stations.json');
      if (!response.error) {
        setStationData(response as StationData);
      }
    };

    getData();
  }, []);

  return (
    <>
      <header className={styles.header}>
        <img className={styles.logo} src={MRTLogo} alt="MRT" />
      </header>
      <div className={styles.container}>
        <FormInput
          stationData={stationData}
          onSubmit={(fields, isValid) => {
            const source = fields['source'].value;
            const destination = fields['destination'].value;
            if (isValid) {
              const paths = pathFinder(stationData!, source, destination);
              setInstructions(formatResultsAsInstruction(paths));
            }
          }}
        />
        <div className={styles.instructionContainer}>
          {instructions?.map((instruction, idx) => (
            <InstructionComponent
              key={idx}
              instruction={instruction}
              onClick={() => {
                const newInstructions = [...instructions];
                newInstructions[idx].showDetail = !newInstructions[idx]
                  .showDetail;
                setInstructions([...newInstructions]);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
