import React, { useState } from 'react'
import Header from '../../components/Header'
import Popups from '../../components/Popups'
import { Box, Skeleton } from '@mui/material';
import ExpensesParentForm from '../expenses/components/ExpensesParentForm';
import { FormStep } from '../expenses';
import ExpensesDetails from '../expenses/components/ExpensesDetails';
import useSwr from 'swr'
import axios from 'axios'
import ExpensesVoucher from '../expenses/components/ExpensesVoucher';
import PrintAdjustingTicket from './components/PrintAdjustingTicket';
import useSWRMutation from 'swr/mutation';
import { toastErr, toastSucc } from '../../utils';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { PrintOutlined } from '@mui/icons-material';
import adjusting_entries_template from '../../assets/adjusting-entries.html?raw'
import logo from '../../assets/c2g_logo_nb.png'


const initialValues = {
  voucherNumber: '0000',
  borrower : '',
  date: null,
  bank : '',
  check_number : '',
  check_date: '',
  prepared_by: '',
  checked_by: '',
  approved_by: '',
  voucher_details : [{ category: '', debit: '0', credit: '0'}] 
}

const fetcher = (url) => {
  return axios.get(url).then(res => res.data)
}
const saveAdjustingEntries = (url, {arg}) => {
  return axios.post(url, arg)
}

const print = (t, data) => {
  
  const tmp = ejs.render(t, data)
  console.log(tmp)
  const voucherWindow = window.open("", "Print Voucher");
  voucherWindow.document.write(tmp);
}

export default function AdjustingEntriesPage() {

  const {data : banks, } = useSwr('/api/expenses/banks', fetcher)
  const {data : expenses_title, } = useSwr('/api/account-title/expenses', fetcher)
  const {data : employee, } = useSwr('/api/employee', fetcher,)
  const {data : suppliers} = useSwr('/api/expenses/suppliers', fetcher)
  const {data : adjustingEntries, isLoading, mutate : refetch} = useSwr('/api/adjusting-entries/', fetcher)
  const { trigger } = useSWRMutation('/api/adjusting-entries', saveAdjustingEntries)
  
  const [activeStep, setActiveStep] = useState(0);
  const [details, setDetails] = useState(initialValues)
  const [openPopup, setOpenPopup] = useState(false)
  
  const handlePrintTicketId = async (id) => {
    
    const request  = await axios.get(`/api/adjusting-entries/${id}`)
    
    if(!request.status == 200) {
      return console.log(request.statusText)
    }

    print(adjusting_entries_template, {...request.data, logo : logo})
  }
  const colums = [
    {
      field: 'actions',
      type: 'actions',
      width: 30,
      getActions: ({id}) => {
        return [
          <GridActionsCellItem 
            icon={<PrintOutlined />}
            label='Print Ticket'
            onClick={() => handlePrintTicketId(id)}
            showInMenu={true}
            />,
          
        ]
      }
    },
    { field : 'ticket_number', headerName: "TICKET NO.", width: 90 },
    { field : 'date', headerName: "DATE",  width: 85 },
    { field : 'borrower_name', headerName: "BORROWER", flex : 1},
    { field : 'check_details', headerName: "CHECK DETAILS", width: 120},
    { field : 'check_date', headerName: "CHECK DATE",  width : 90},
    { field : 'prepared_by', headerName: "PREPARED BY",   width: 110},
    { field : 'checked_by', headerName: "CHECKED BY",   width: 110},
    { field : 'approved_by', headerName: "APPROVED BY",  width: 110 },
  ]

  const handleStepComplete = (data) => {
    setDetails((old) => ({...old, ...data}))
    
    setActiveStep((prev) => prev + 1)
  }

  const handlePrevious = (data) => {
    setDetails((old) => ({...old, ...data}))
    setActiveStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    const formatDetails = details.voucher_details.map(v => ({
      account_title_id : v.category.id,
      credit : v.credit,
      debit: v.debit
    }))

    const input = {
      header : {
        borrower_name : details.borrower.name,
        borrower_id: details.borrower.id,
        bank_name: details.bank.name ,
        bank_id: details.bank.id,
        date: details.date,
        check_number: details.check_number ,
        check_date: details.check_date,
        prepared_by: details.prepared_by,
        checked_by: details.checked_by,
        approved_by : details.approved_by
      },
      details : formatDetails
    }
    
    const request =  await trigger(input)
    if(!request.status == 200) return(toastErr('Something went wrong'))
    
    toastSucc('Save Successfully!')
    await refetch()
    setOpenPopup(false)
    setDetails(initialValues)
    setActiveStep(0)
  }
  
  const handlePrintTicket = async (data) => {
    console.log(logo)
    print(adjusting_entries_template, {...data, logo : logo})
  }
  

  return (
    <div style={{ height: "80%", padding: 20 }}>
      <Header title='Adjusting Entries' onAddButtonClick={() => { setOpenPopup(true)}} />
        {isLoading ? 
          (
            <Skeleton variant="rounded" width='100%' height='100%' />
          ) : (
            <DataGrid rows={adjustingEntries} columns={colums}/>
          )
        }
      <Popups 
        title="Adjusting Entries Form"
        openPopup={openPopup}
        setOpenPopup={(open) => {
          setOpenPopup(open)
          setDetails(initialValues)
          setActiveStep(0)
        }}
      >
        <Box width={900}>
          <ExpensesParentForm activeStep={activeStep}>
            <FormStep label='Adjusting Ticket Info'>
              <ExpensesDetails hasTicketNumber data={details} banks={banks} employee={employee} suppliers={suppliers} onComplete={handleStepComplete}/>
            </FormStep>
            <FormStep label='Details'>
              <ExpensesVoucher titles={expenses_title} data={details.voucher_details} onComplete={handleStepComplete} onPrevious={handlePrevious}/>
            </FormStep>
            <FormStep label='Print Ticket'>
              <PrintAdjustingTicket onPrintTicket={handlePrintTicket} onSubmit={handleSubmit} data={details} onPrevious={handlePrevious} />
            </FormStep>
          </ExpensesParentForm>
        </Box>
      </Popups>
    </div>
  )
}
