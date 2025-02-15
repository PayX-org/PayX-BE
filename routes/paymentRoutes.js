const express = require('express');
const router = express.Router();

const {
  createPayment,
  getPayment,
  updatePayment,
  deletePayment,
  getAllPayments
} = require('../controllers/paymentController');

// Add some logging middleware to debug route matching
router.use((req, res, next) => {
  console.log(`Payment route accessed: ${req.method} ${req.url}`);
  next();
});

router.post('/', createPayment);
router.get('/', getAllPayments);
router.get('/:id', getPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

module.exports = router;