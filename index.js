const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 4000 ;


// Load environment variables
dotenv.config();
app.use(cors())
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MONGODB connected successfully"))
    .catch((error) => console.log(error));
// Simple route for testing
// app.use('/', (req, res) => {
//     res.json({message: "Welcome"});
// });


// Middleware
app.use(bodyParser.json());
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

// Start server
app.listen(PORT, () => {
    console.log(`Server started and running at ${PORT}`);
});

