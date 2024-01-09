const builder = require('../builder')

async function getLoanList (req, res) {
  const loans = await builder.select(
    'loan_header_id',
    'pn_number',
    'customername',
    'bank_name_pdc',
    'loancategory',
    'loanfacility',
    'principal_amount',
    'total_interest',
    'date_granted',
    'status_code',
  )
  .from('view_loanheader')
  
  res.status(200).json(loans)
}

async function getLoan(req, res) {
  const {id} = req.params
  const loans = await builder.select(
    'loan_detail_id',
    'check_date',
    'monthly_principal',
    'monthly_amortization',
    'description'
  ).from('view_detail_payment').where('loan_header_id', '=', id)
  
  const loanDetails = loans.map((l) =>{
    if(l.description === null){
      const loan = {...l, description : 'UNSETTLED'}
      return loan
    } else {
      return l
    }
  })

  res.status(200).send(loanDetails)
}

async function saveLoan(req, res){
}

module.exports = { getLoan, getLoanList, saveLoan }