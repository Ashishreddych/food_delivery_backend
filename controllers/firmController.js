const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');  // Make sure to add this

// Configure Multer storage for images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');  // Folder where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Prevent overwriting
    }
});

const upload = multer({ storage: storage });  // No need to use `.single()` here

const addFirm = async (req, res) => {
    try {
        // Use Multer to handle the file upload inside the controller
        upload.single('image')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ error: "Image upload failed" });
            }

            const { firmname, area, category, offer, region } = req.body;

            // Validate firmname
            if (!firmname || firmname.trim() === '') {
                return res.status(400).json({ error: "Firm name is required and cannot be empty" });
            }

            // Check if the firmname already exists
            const existingFirm = await Firm.findOne({ firmname });
            if (existingFirm) {
                return res.status(409).json({ error: "Firm name already exists" });
            }

            // Get the uploaded image (if available)
            const image = req.file ? req.file.filename : undefined;

            // Find vendor by ID (vendorId is provided by verifyToken middleware)
            const vendor = await Vendor.findById(req.vendorId);
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }

            // Create new firm and save to database
            const firm = new Firm({
                firmname,
                area,
                category,
                region,
                image,  // Save the image filename if provided
                offer,
                Vendor: vendor._id
            });

            const savedFirm = await firm.save();

            // Add the saved firm to the vendor's firm list and save the vendor
            vendor.firm.push(savedFirm);
            await vendor.save();

            return res.status(200).json({ message: "Firm added successfully", firm: savedFirm });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const deletedFirm = await Firm.findByIdAndDelete(firmId);  // Fix: Use Firm instead of Product
        if (!deletedFirm) {
            return res.status(404).json({ error: "No firm found" });
        }
        return res.status(200).json({ message: "Firm deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { addFirm, deleteFirmById };  // No need for upload.single('image') here
