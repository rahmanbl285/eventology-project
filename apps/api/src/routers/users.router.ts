import { UsersController } from "@/controllers/users.controller";
import { UsersMiddleware } from "@/middlewares/users.middleware";
import { Router } from "express";

export class UsersRouter {
    private router: Router
    private usersController: UsersController
    private usersMiddleware: UsersMiddleware

    constructor() {
        this.router = Router()
        this.usersController = new UsersController()
        this.usersMiddleware = new UsersMiddleware()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/', this.usersController.getUsers)
        this.router.post('/register', this.usersController.userRegister)
        this.router.post('/login', this.usersController.userLogin)
        this.router.post('/activate', this.usersMiddleware.verifyToken, this.usersController.userActivate)
        this.router.get('/keep-login', this.usersMiddleware.verifyToken, this.usersController.keepLogin)
        this.router.patch('/deactivate-account', this.usersMiddleware.verifyToken, this.usersController.deactivateAccount)
        this.router.patch('/update-organizer', this.usersMiddleware.verifyToken, this.usersController.updateOrganizer)
    }

    getRouter() {
        return this.router
    }
}