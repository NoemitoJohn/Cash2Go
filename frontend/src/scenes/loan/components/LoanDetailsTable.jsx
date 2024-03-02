import { useTheme } from '@emotion/react';
import { DeleteOutlined } from '@mui/icons-material';
import { Button, Tooltip, styled, tooltipClasses } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridEditInputCell, GridRowEditStopReasons, GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';
import React, { useState } from 'react'
import { tokens } from '../../../theme';

function EditToolbar(props) {
  const {setRows, rows, setRowModesModel} = props
  
  const handleClick = () =>{
    const id = rows.length + 1
    setRows((oldRows) => [...oldRows, {id , dueDate: null,  principal : '', interest : '', amortization : '', bank : null, checkNumber: '', isNew : true}])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id] : { mode: GridRowModes.Edit, fieldToFocus: 'dueDate' }
    }))
  }

  return (
    <GridToolbarContainer>
      <Button color='secondary' onClick={handleClick}>
        Add Record
      </Button>
    </GridToolbarContainer>
  )
}

const formatNumber = (params) =>{
  const format = Number(params.value).toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })
  return format
}

const StyledToolTip = styled(({className, ...props}) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));


const renderAmount = (props) => {
  const {error} = props
  // console.log(params)
  return (
    <StyledToolTip open={!!error} title={error} >
      <GridEditInputCell {...props} />
    </StyledToolTip>
    
  )
}

const handleAmountValidation = async (params) => {
  const error = new Promise((resolve) => {
    resolve(Number(params.props.value) <= 0 ? `Invalid Amount` : null)
  });
  return params.hasChanged ? {...params.props, error : await error} :  {...params.props}
}

export default function LoanDetailsTable({banks, rows, setRows}) {

  const theme = useTheme()
  const colors =  tokens(theme.palette.mode)
  const [rowModesModel, setRowModesModel] = useState({})

  const handleDelete = (id) => {
    const filterRows = rows.filter((row) => row.id !== id).map((r,i) =>  ({...r, id : i + 1}) )
    setRows(filterRows)
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowInputChange = (newRow) =>{
    const updatedRow = { ...newRow, isNew : false}
    setRows(rows.map((row)=> (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const columns = [
    { field: 'id', headerName: 'Count', editable: false },
    { field: 'dueDate', headerName: 'Due Date', width: 150, editable: true, type : 'date' },
    { field: 'principal', headerName: 'Principal', width: 150, editable: true, type : 'number',
      valueFormatter : (params) => {
        return formatNumber(params)
      },
      preProcessEditCellProps :  handleAmountValidation,
      renderEditCell : renderAmount
    },
    { field: 'interest', headerName: 'Interest', width: 150, editable: true, type : 'number',
      valueFormatter : (params) => {
        return formatNumber(params)
      },
      preProcessEditCellProps :  handleAmountValidation,
      renderEditCell : renderAmount
    },
    { field: 'amortization', headerName: 'Amortization', width: 150, editable: true, type : 'number',
      valueFormatter : (params) => {
        return formatNumber(params)
      },
      preProcessEditCellProps :  handleAmountValidation,
      renderEditCell : renderAmount
    },
    { field: 'bank', headerName: 'Bank', width: 150, editable: true, type : 'singleSelect', valueOptions : banks.map(b => b.name),},
    { field: 'checkNumber', headerName: 'Check Number', width: 120, editable: true,   },
    { field: 'action', type : 'actions',
      getActions : ({id}) => {
        return [
          <GridActionsCellItem
            icon={<DeleteOutlined/>}
            color='inherit'
            label='edit'
            sx={{color: colors.redAccent[500], cursor: 'auto'}}
            onClick={(e) => handleDelete(id)}
          />
        ]
      }
    },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      editMode="row"
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={handleRowInputChange}
      slots={{
        toolbar: EditToolbar,
      }}
      slotProps={{
        toolbar: {setRows, rows, setRowModesModel},
      }}
    />
  )
}
