const express = require('express')
const app = express()
const cors = require('cors')
const loanRouter = require('./routes/loan')
const customerRouter = require('./routes/customer')
const bankRouter = require('./routes/bank')
const deductionRouter = require('./routes/deduction')
const bodyParser = require('body-parser')
const facilityRouter = require('./routes/facility')
const categoryRouter = require('./routes/category')
const customerInfoRouter = require('./routes/customerInfo')
const collateralRouter = require('./routes/collateral')
const accountCategoryRouter = require('./routes/accountCategory')
const accountTitleRouter = require('./routes/accountTitle')
const employeeRouter = require('./routes/employee')
const paymentRouter = require('./routes/payment');

const production = false;

const port = process.env.PORT | 8000
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cors())

app.use('/loans', loanRouter)
app.use('/payments', paymentRouter)
app.use('/employee', employeeRouter)
app.use('/customers', customerRouter)
app.use('/banks', bankRouter)
app.use('/deductions', deductionRouter)
app.use('/facility', facilityRouter)
app.use('/category', categoryRouter)
app.use('/customerInfo', customerInfoRouter)
app.use('/collateral', collateralRouter)
app.use('/account-category', accountCategoryRouter)
app.use('/account-title', accountTitleRouter)
app.use('/employee', employeeRouter)


app.listen(port, () => {
  console.log(`Server running...`)
  // console.log(`Click link to open http://localhost:${params.port}`)
  // console.log('Do not close this window');
})