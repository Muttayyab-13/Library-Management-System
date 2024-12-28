const express = require("express");
const { getAllBooks, addBook, getFeaturedBooks } = require("../controllers/bookController");


const router = express.Router();

router.get("/allBooks", getAllBooks);
router.get("/featured", getFeaturedBooks);


module.exports = router;
