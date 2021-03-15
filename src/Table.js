import Box from '@sweatpants/box';
import React from 'react';
import { useTable, useSortBy } from 'react-table';
import { format } from 'date-fns';
import styled from 'styled-components';

function Cell(props) {
  return <Box as="td" px="200" py="200" {...props} />;
}

const StyledRow = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
  }
`;

function Row(props) {
  return (
    <StyledRow as="tr" {...props}>
      {props.children}
    </StyledRow>
  );
}

function SortIcon({ isSorted, isSortedDesc }) {
  return (
    <Box pl="100" size={isSorted ? '18px' : null}>
      {isSorted ? (
        isSortedDesc ? (
          <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
          >
            <path
              d="M9.854 8.854l.353-.354-.707-.707-.354.353.708.708zM7.5 10.5l-.354.354.354.353.354-.353L7.5 10.5zM5.854 8.146L5.5 7.793l-.707.707.353.354.708-.708zm3.292 0l-2 2 .708.708 2-2-.708-.708zm-1.292 2l-2-2-.708.708 2 2 .708-.708zM8 10.5V4H7v6.5h1z"
              fill="currentColor"
            ></path>
          </svg>
        ) : (
          <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
          >
            <path
              d="M5.146 6.146l-.353.354.707.707.354-.353-.708-.708zM7.5 4.5l.354-.354-.354-.353-.354.353.354.354zm1.646 2.354l.354.353.707-.707-.353-.354-.708.708zm-3.292 0l2-2-.708-.708-2 2 .708.708zm1.292-2l2 2 .708-.708-2-2-.708.708zM7 4.5V11h1V4.5H7z"
              fill="currentColor"
            ></path>
          </svg>
        )
      ) : (
        ''
      )}
    </Box>
  );
}

function Table(props) {
  const { data } = props;

  const coverageSortType = React.useCallback((a, b) => {
    const aVal = a.values.coverage * 100;
    const bVal = b.values.coverage * 100;
    return aVal > bVal ? 1 : -1;
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'File',
        accessor: 'file'
      },
      {
        Header: 'Modified',
        accessor: 'stats.mtime',
        Cell: ({ value }) => `${format(new Date(value), 'M/dd/yyyy')}`
      },
      {
        Header: 'Layers',
        accessor: 'layerCount',
        Cell: ({ value }) => `${value.toLocaleString()}`
      },
      {
        Header: 'Foreign Symbols',
        accessor: 'externalSymbol',
        Cell: ({ value }) => `${value.toLocaleString()}`
      },
      {
        Header: 'Foreign Styles',
        accessor: 'externalTextLayer',
        Cell: ({ value }) => `${value.toLocaleString()}`
      },
      {
        Header: 'Coverage',
        accessor: 'coverage',
        Cell: ({ value }) => `${(value * 100).toFixed(2)}%`,
        sortType: coverageSortType
      }
    ],
    []
  );
  const initialState = React.useMemo(
    () => ({
      sortBy: [{ id: 'coverage', desc: true }]
    }),
    []
  );

  const tableInstance = useTable(
    { columns, data, initialState, disableSortRemove: true },
    useSortBy
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <Box
      as="table"
      width="100%"
      borfder="none"
      cellPadding="0"
      cellSpacing="0"
      {...getTableProps()}
    >
      <Box as="thead">
        {headerGroups.map((headerGroup) => (
          <Box as="tr" textAlign="left" {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Cell
                as="th"
                py="300"
                verticalAlign="top"
                textAlign={['file'].includes(column.id) ? 'left' : 'right'}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                <Box display="inline-flex" verticalAlign="middle">
                  {column.render('Header')}
                  <SortIcon isSorted={column.isSorted} isSortedDesc={column.isSortedDesc} />
                </Box>
              </Cell>
            ))}
          </Box>
        ))}
      </Box>
      <Box as="tbody" {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Row {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <Cell
                    textAlign={['file'].includes(cell.column.id) ? 'left' : 'right'}
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </Cell>
                );
              })}
            </Row>
          );
        })}
      </Box>
    </Box>
  );
}

export default Table;
