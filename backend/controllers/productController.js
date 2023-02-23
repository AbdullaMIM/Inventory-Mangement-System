const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { formatFileSize } = require('../utils/fileUpload');
const cloudinary = require("cloudinary").v2;

const createProduct = asyncHandler(async (req, res) => {
        
      const {name, sku, category, quantity, price, description} = req.body

      //Validation
      if(!name || !category || !quantity || !price || !description) {
           res.status(400)
           throw new Error("Please fill in all fields")
      }

      // Handle Image Upload
      let fileData = {}
      if (req.file) {

            // Save image to cloudinary
            let uploadedFile 
            try {
               uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "Pinvent App", resource_type: "image" })
            } catch(error) {
                  res.status(500)
                  throw new Error("Image could not be uploaded")
            }

            fileData = {
                  fileName : req.file.originalname,
                  filePath : uploadedFile.secure_url,
                  fileType : req.file.mimetype,
                  fileSize: formatFileSize(req.file.size, 2),
            }
      }

      
      // Create Product
      const product = await Product.create({
            user: req.user.id,
            name, 
            sku, 
            category,
            quantity, 
            price, 
            description,
            image: fileData
      })

      res.status(201).json(product)

});

// Get all products
const getProducts = asyncHandler( async (req, res) => {
      const products = await Product.find({user: req.user.id}).sort("-createdAt")
      res.status(200).json(products)
})

// Get a single prooduct
const getProduct = asyncHandler( async (req, res) => {
      const product = await Product.findById(req.params.id)
      
      // If product doesnt exist
      if(!product) {
            res.status(404)
            throw new Error("Product not found");
      }

      // Match product to its user
      if(product.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error("User not authorized");
      }
      
      res.status(200).json(product)
});

// Delete Product
const deleteProduct = asyncHandler( async (req, res) => {
      // Get a product using id
      const product = await Product.findById(req.params.id)
      
      // If product doesnt exist
      if(!product) {
            res.status(404)
            throw new Error("Product not found");
      }

      // Match product to its user who created the product 
      if(product.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error("User not authorized");
      }
      
      await product.remove();
      res.status(200).json({message: "Product Deleted."});
});

//Update Product
const updateProduct = asyncHandler(async (req, res) => {
        
      // Destructure the properties
      const {name, sku, category, quantity, price, description} = req.body

      // Get the id from req.params
      const {id} = req.params
 
      // Find the product using id
      const product = await Product.findById(id)

      // If product doesnt exist
      if(!product) {
            res.status(404)
            throw new Error("Product not found");
      }

      // Match product to its user who created the product 
      if(product.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error("User not authorized");
      }

      // Handle Image Upload - Upload to cloudinary
      let fileData = {}
      if (req.file) {

            // Save image to cloudinary
            let uploadedFile 
            try {
               uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "Pinvent App", resource_type: "image" })
            } catch(error) {
                  res.status(500)
                  throw new Error("Image could not be uploaded")
            }

            fileData = {
                  fileName : req.file.originalname,
                  filePath : uploadedFile.secure_url,
                  fileType : req.file.mimetype,
                  fileSize: formatFileSize(req.file.size, 2),
            }
      }

      // Update the product
      const updatedProduct = await Product.findByIdAndUpdate(
             {_id: id },
             {
                  name,
                  category,
                  quantity,
                  price,
                  description,
                  image: Object.keys(fileData).length === 0 ? product?.image :
                         fileData,
             },
             {
                  new: true,
                  runValidators: true
             }
      )

      res.status(200).json(updatedProduct);

});


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
}