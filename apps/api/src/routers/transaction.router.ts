import { TransactionController } from "@/controllers/transaction.controller";
import { UsersMiddleware } from "@/middlewares/users.middleware";
import { Router } from "express";

export class TransactionRouter {
    private router: Router
    private transactionController: TransactionController
    private usersMiddleware: UsersMiddleware

    constructor() {
        this.router = Router()
        this.transactionController = new TransactionController()
        this.usersMiddleware = new UsersMiddleware()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post('/create-order', this.usersMiddleware.verifyToken, this.transactionController.createOrder)
        this.router.post('/create-payment/:transactionIds', this.usersMiddleware.verifyToken, this.transactionController.createPayment)
        this.router.post('/confirm-order', this.usersMiddleware.verifyToken, this.transactionController.confirmOrder)
        this.router.get('/event-order-sum', this.usersMiddleware.verifyToken, this.transactionController.getEventOrderSummary)
        this.router.get('/:transactionIds', this.usersMiddleware.verifyToken, this.transactionController.getTransaction)
    }

    getRouter() {
        return this.router
    }
}