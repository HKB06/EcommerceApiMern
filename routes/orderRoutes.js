const express = require('express');
const {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  createDirectOrder
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.post('/direct/:customerId', createDirectOrder);

module.exports = router;
