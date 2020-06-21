var express = require('express');
var router = express.Router();
const midtransClient = require('midtrans-client')

// initialize snap client object
let snap = new midtransClient.Snap({
   isProduction : false,
   serverKey : 'SB-Mid-server-Rr0amHepmpr7szv-bczKOq2F',
   clientKey : 'SB-Mid-client-L0DuKIxBDcUKW-sm'
});

let data = [
   {total: 10000, status: 'Success' },
   {total: 20000, status: 'Pending' },
   {total: 30000, status: 'Pending' },
]

router.get('/', function(req, res) {
  res.status(200).json(data)
});

router.get('/:id', function(req, res) {
   res.status(200).json(data[req.params.id - 1])
})

router.post('/', function(req, res) {
   let newItem = {
      total: parseInt(req.body.total),
      status: 'Pending'
   }

   data.push(newItem)

   res.status(201).json(newItem)
})

router.post('/charge', function(req, res) {
   let newTransaction = {
      "transaction_details": {
         "order_id": req.body.order_id,
         "gross_amount": req.body.gross_amount
     },
     "enabled_payments": ["gopay", "bca_va"],
     "gopay": {
         "enable_callback": true,
         "callback_url": "http://google.com"
      },
      "bca_va": {
         "va_number": "12345678911",
         "sub_company_code": "00000",
         "free_text": {
           "inquiry": [
             {
               "en": "text in English",
               "id": "text in Bahasa Indonesia"
             }
           ],
           "payment": [
             {
               "en": "pay text in English",
               "id": "pay text in Bahasa Indonesia"
             }
           ]
         }
       },
   }

   snap.createTransaction(newTransaction)
   .then((transaction) => {
      res.status(201).json(transaction)
   })
   .catch((e) => {
      res.status(400).send(e.message)
   })
})



module.exports = router;