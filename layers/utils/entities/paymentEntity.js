/**
 * Order Entity Mapping
 *
 */
module.exports = class Payment {

  constructor(data) {
    this.payment_type = 'web_checkout'
    this.payment_callback_url = process.env.CALLBACK_URL
    this.external_payment_id = data.id
    this.transactions = [{
      integrator_merchant_id: 'NX',
      amount: {
        currency: 'ARS',
        value: String(data.totalAmount)
      },
      soft_descriptor: 'Naranja Toque',
      products: [{
        id: data.product.id,
        name: 'Toque',
        description: ' ',
        quantity: data.quantity,
        unit_price: {
          currency: 'ARS',
          value: String(data.totalAmount)
        }
      }]
    }]
    this.contracts = [{
        entity_id: 'naranja',
        merchant_id: '100562747'
      },
      {
        entity_id: 'payzen',
        merchant_id: 'NX'
      }
    ]
    this.fraud_prevention = {
      skip_fraud_service: true
    }
    this.payment_retries_allowed = 3
    this.request_creation_redirect = {
      success_url: `${process.env.SUCCESS_URL}/${data.id}`,
      back_url: `${process.env.BACK_URL}/${data.id}`,
      failure_url: `${process.env.FAILURE_URL}/${data.id}`
    }
    this.additional_info = {
      skin: 'naranjax'
    }
    this.seller = {
      name: 'webtoque'
    }
    this.payment_gateway = [{
        id: 'naranja',
        store_id: '100562747'
      },
      {
        id: 'payzen',
        store_id: '80786080'
      }
    ]
  }

  setTransactions(data) {
    // if (data.concepts) {
    //   var transactions = new Array();
    //   var products = new Array();
    //   data.concepts.forEach(function (transaction, i) {
    //     data.concepts[i].forEach(function (product, j) {
    //       products[j] = {
    //         id: product.id,
    //         name: product.name,
    //         description: ' ',
    //         quantity: data.quantity,
    //         unit_price: {
    //           currency: 'ARS',
    //           value: String(product.price)
    //         }
    //       }
    //     })
    //     transactions[i] = {
    //       integrator_merchant_id: 'NX',
    //       amount: {
    //         currency: 'ARS',
    //         value: String(transaction.totalAmount)
    //       },
    //       soft_descriptor: 'Naranja Toque',//ver de donde sale
    //       products: products
    //     }
    //   });
    //   console.log('\x1b[31m', '-----------', '\x1b[0m')
    //   console.log('\x1b[31m', transactions, '\x1b[0m')
    //   console.log('\x1b[31m', '-----------', '\x1b[0m')
    //   return this
    // }

    this.transactions = [{
      integrator_merchant_id: 'NX',
      amount: {
        currency: 'ARS',
        value: String(data.totalAmount)
      },
      soft_descriptor: 'Naranja Toque',
      products: [{
        id: data.product.id,
        name: 'Toque',
        description: ' ',
        quantity: data.quantity,
        unit_price: {
          currency: 'ARS',
          value: String(data.totalAmount)
        }
      }]
    }]
    return this
  }
};