const express = require('express')
const customerRouter = express.Router()
const builder = require('../builder')

customerRouter.get('/', async (req, res) =>{
  const customers = await builder.select({
    id : 'customerid',
    f_name : 'cfname',
    m_name : 'cmname',
    l_name : 'clname',
    contactNo : 'contactno',
    address : 'address',
    gender : 'gender',
  }).from({ c : 'customertbl'})

  res.status(200).send(customers)
})

customerRouter.get('/info', async (req, res)=>{
  const customers = await builder.select('*').from('customertbl')
  res.status(200).send(customers)
})

customerRouter.get('/info/:id', async (req, res)=>{
  const {id} = req.params
  const customers = await builder.select('*').from('customertbl').where('customerid', id)
  res.status(200).send(customers[0])
})

customerRouter.post('/', async (req, res)=>{
  const {borrower, spouse} = req.body
  const id = await builder('customertbl').insert({
    // Borrower Info
    cfname : borrower.fName,
    cmname : borrower.mName,
    clname : borrower.lName,
    address : borrower.address,
    contactno : borrower.phoneNum,
    birthdate : borrower.birthdate,
    gender : borrower.gender,
    maritalstatus : borrower.civilStatus,
    // Borrower Spouse Info
    spousefname: spouse.fName,
    spousemname : spouse.mName,
    spouselname : spouse.lName,
    spouseaddress : spouse.address,
    spousebirthdate : spouse.birthdate,
    spousegender : spouse.gender,
    spousemaritalstatus: borrower.civilStatus,
    spousecontactno : spouse.phoneNum
  }, ['customerid'])
  console.log(id)
  res.status(200).json({id : id[0]})

})
customerRouter.put('/', async (req, res)=>{
  const {borrower, spouse, id} = req.body
  console.log(id)
  const update = await builder('customertbl')
  .where('customerid', id)
  .update({
    // Borrower Info
    cfname : borrower.fName,
    cmname : borrower.mName,
    clname : borrower.lName,
    address : borrower.address,
    contactno : borrower.phoneNum,
    birthdate : borrower.birthdate,
    gender : borrower.gender,
    maritalstatus : borrower.civilStatus,
    // Borrower Spouse Info
    spousefname: spouse.fName,
    spousemname : spouse.mName,
    spouselname : spouse.lName,
    spouseaddress : spouse.address,
    spousebirthdate : spouse.birthdate,
    spousegender : spouse.gender,
    spousemaritalstatus: borrower.civilStatus,
    spousecontactno : spouse.phoneNum
  })
  
  res.status(200).send()
  
})


module.exports = customerRouter