import  Express  from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.ts";
import upload from "../middleware/multer.ts";
import { addMenu, editMenu } from "../Controller/menu.controller.ts";




const router = Express.Router()
router.route('/').post(isAuthenticated,upload.single("image"),addMenu)
router.route('/:id').put(isAuthenticated,upload.single("image"),editMenu)

export default router
