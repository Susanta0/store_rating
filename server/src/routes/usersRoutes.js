const {Router}=require("express")
const { userController } = require("../controllers/userController")
const { authenticate, requireRole } = require("../middlewares/auth")
const router= Router()

router.post("/signup", userController.signup)
router.post("/signup/system_administrator", authenticate, requireRole("system_administrator"), userController.signup)
router.post("/login", userController.login)
router.put("/update_password", authenticate, userController.updatePassword)
router.get("/", authenticate, requireRole("system_administrator"), userController.getUsers)

module.exports={userRoutes: router}