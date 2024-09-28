
const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifytoken');

const router = express.Router();

// Apply verifyToken middleware and route to add firm
router.post('/add-firm', verifyToken, firmController.addFirm);




router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.setHeader('Content-Type', 'image/jpeg');  // Fix: Correct method name is setHeader
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.delete('/:firmId', firmController.deleteFirmById);  // Fix: Added :firmId as a param
module.exports = router;
