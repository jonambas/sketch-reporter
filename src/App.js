import React from 'react';
import Theme from '@sweatpants/theme';
import Box from '@sweatpants/box';
import theme from './theme';
import data from '__DATA__';
import Table from './Table';
import Aggregates from './Aggregates';

function NoData() {
  return <Box>Something went wrong! No Sketch data found.</Box>;
}

function App() {
  return (
    <Theme theme={theme}>
      <Box as="main" maxWidth="1200px" mx="auto" my="800" px="500">
        <Box mb="700" as="h1" fontSize="400">
          Sketch Reporter
        </Box>
        {!data ? null : <Aggregates data={data} />}
        {!data ? <NoData /> : <Table data={data} />}
      </Box>
    </Theme>
  );
}

export default App;
