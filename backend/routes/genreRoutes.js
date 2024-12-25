const express = require("express");
const { getGenres, addGenre } = require("../controllers/genreController");

const router = express.Router();

router.get("/", getGenres);
router.post("/", addGenre);

module.exports = router;
