const {Router}= require("express")
const { authenticate, requireRole } = require("../middlewares/auth")
const { dashboardController } = require("../controllers/dashboardController")
const router= Router()
router.get("/dashboard", authenticate, requireRole("system_administrator"), dashboardController.getDashboard)

module.exports= {dashboardRoutes: router}