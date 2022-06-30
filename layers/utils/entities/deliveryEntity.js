/**
 * Order Entity Mapping
 *
 */
module.exports = class Delivery {

  constructor(data) {
    this.transactionId = data.transactionId || null;
    this.phone = String(data.phone) || null
    this.phoneAreaCode = String(data.phoneAreaCode) || null
    this.id = data.id || null;
    //TODO LO DE DELIVERY PASAR A UN OBJETO SOLO
    this.deliveryState = data.deliveryState || null,
      this.deliveryLocation = data.deliveryLocation || null,
      this.deliveryStreet = data.deliveryStreet || null,
      this.deliveryHouseNumber = data.deliveryHouseNumber || null,
      this.deliveryFloorNumber = data.deliveryFloorNumber || '',
      this.deliveryDoorNumber = data.deliveryDoorNumber || '',
      this.deliveryComment = data.deliveryComment || '',
      this.deliveryZipCode = data.deliveryZipCode || null,
      this.deliveryCountry = data.deliveryCountry || 'ARGENTINA'
    this.deliveryData = data.deliveryData || null
    this.email = data.email;
    this.name = data.name;
    this.lastName = data.lastName;
    this.messageId = data.messageId || null;
    this.deletedAt = data.deletedAt || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.quantity = data.quantity || null
    this.concepts = data.concepts || null //TODO contemplar mas de un producto
    this.totalAmount = null
    if (typeof data.discount === 'string') { //TODO CON CONCETPS ESTO SE VA
      this.discount = {
        code: data.discount,
        total: null,
        result: null,
        discounted: 0,
      };
    } else {
      this.discount = data.discount
    }

    this.product = data.product || {
      id: data.productId
    }
    this.paymentData = data.paymentData || null
    this.status = data.status || [{
      status: 'orderCreated',
      date: new Date().toISOString()
    }]
    this.notification = data.notification || null
    this.invoiceData = data.invoice || null
  }
  setInvoiceData(data) {
    this.invoiceData = data || null
  }
  setNotificationData(data) {
    this.notification = data || null
  }
  setStatus(data) {
    this.status.push({
      status: data.status || data,
      date: new Date().toISOString()
    })
  }
  setDeliveryData(data) {
    this.deliveryData = data || null
  }
  setPaymentData(data) {
    this.paymentData = {
      ...this.paymentData,
      data
    }
    return this
  }
  setProduct(data) {
    this.product = data || null;
    return this
  }
  setTotalAmount(data) {
    this.totalAmount = data || null
    return this
  }

  setDiscount(data) {
    this.discount = data || {
      code: data.code,
      total: data.total,
      result: data.result,
      discounted: data.discounted,
    }
    return this
  }

  setUUID(value) {
    this.id = value || null;
    return this;
  }

  setTransactionId(value) {
    this.transactionId = value || null;
    return this;
  }

  setId(value) {
    this.id = value || null;
    return this;
  }

  setEmail(value) {
    this.email = value || null;
    return this;
  }

  setName(value) {
    this.name = value || null;
    return this;
  }

  setLastName(value) {
    this.lastName = value || null;
    return this;
  }

  setMessageId(value) {
    this.messageId = value || null;
    return this;
  }

  setDeletedAt(value) {
    this.deletedAt = value || null;
    return this;
  }

  setCreatedAt(value) {
    this.createdAt = value || null;
    return this;
  }

  setUpdatedAt(value) {
    this.updatedAt = value || null;
    return this;
  }

};