import React from 'react';
import Box from '@sweatpants/box';

function Aggregates(props) {
  const { data } = props;

  const totalLayers = data.reduce((acc, entry) => {
    return acc + entry.layerCount;
  }, 0);

  const totalExternalStyle = data.reduce((acc, entry) => {
    return acc + entry.externalTextLayer;
  }, 0);

  const totalExternalSymbols = data.reduce((acc, entry) => {
    return acc + entry.externalSymbol;
  }, 0);

  return (
    <Box mb="700" display="grid" gridTemplateColumns="repeat(4, 1fr)" gridGap="500">
      <Box border="card" p="500" borderRadius="5px">
        <Box mb="400" fontSize="100">
          Total Coverage
        </Box>
        <Box fontSize="600">
          {(((totalExternalSymbols + totalExternalStyle) / totalLayers) * 100).toFixed(2)}%
        </Box>
      </Box>
      <Box border="card" p="500" borderRadius="5px">
        <Box mb="400" fontSize="100">
          Total Foreign Symbols
        </Box>
        <Box fontSize="600">{totalExternalSymbols.toLocaleString()}</Box>
      </Box>
      <Box border="card" p="500" borderRadius="5px">
        <Box mb="400" fontSize="100">
          Total Foreign Styles
        </Box>
        <Box fontSize="600">{totalExternalStyle.toLocaleString()}</Box>
      </Box>
      <Box border="card" p="500" borderRadius="5px">
        <Box mb="400" fontSize="100">
          Total Layers
        </Box>
        <Box fontSize="600">{totalLayers.toLocaleString()}</Box>
      </Box>
    </Box>
  );
}

export default Aggregates;
