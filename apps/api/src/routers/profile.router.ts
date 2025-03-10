import { ProfileController } from "@/controllers/profile.controller";
import { uploader } from "@/helpers/uploader";
import { UsersMiddleware } from "@/middlewares/users.middleware";
import { Router } from "express";

export class ProfileRouter {
    private router: Router
    private profileController: ProfileController
    private usersMiddleware: UsersMiddleware

    constructor() {
        this.router = Router()
        this.profileController = new ProfileController()
        this.usersMiddleware = new UsersMiddleware()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/user-profile', this.usersMiddleware.verifyToken, this.profileController.userProfile)
        this.router.patch('/update', this.usersMiddleware.verifyToken, uploader('IMG', '/images').single('file'), this.profileController.updateUserProfile)
        this.router.patch('/update/password', this.usersMiddleware.verifyToken, this.profileController.updatePassword)
        this.router.patch('/update/email', this.usersMiddleware.verifyToken, this.profileController.verifyEmail)
        this.router.get('/update/email/:token', this.usersMiddleware.verifyToken, this.profileController.updateEmail)
        this.router.post('/verify/password', this.usersMiddleware.verifyToken, this.profileController.verifyPassword)
    }

    getRouter() {
        return this.router
    }
}