const {Router}=require('express');
const { authenticate, requireRole } = require('../middlewares/auth');
const { ratingController } = require('../controllers/ratingsController');
const router= Router();

router.post("/",authenticate, requireRole("user"), ratingController.submitRating)
router.put("/:ratingId", authenticate, requireRole("user"), ratingController.updateRating)

module.exports= {ratingRoutes: router}