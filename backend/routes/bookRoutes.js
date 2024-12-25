const express = require("express");
const { getBooks, addBook, getFeaturedBooks } = require("../controllers/bookController");

const router = express.Router();

router.get("/", getBooks);
router.get("/featured", getFeaturedBooks);
router.post("/", addBook);

module.exports = router;
