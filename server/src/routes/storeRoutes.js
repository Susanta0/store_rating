const {Router}= require("express")
const { authenticate, requireRole } = require("../middlewares/auth")
const { storeController } = require("../controllers/storeController")
const router= Router()


router.post("/addstore", authenticate, requireRole("system_administrator"), storeController.addStore)
router.get("/", authenticate, storeController.getStores)
router.get("/:storeId/ratings", authenticate, requireRole("store_owner"), storeController.getStoreRatings)

module.exports= {storeRoutes: router}