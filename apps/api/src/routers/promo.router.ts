 import { PromoController } from "@/controllers/promo.controllers";
import { EventsMiddleware } from "@/middlewares/events.middleware";
import { UsersMiddleware } from "@/middlewares/users.middleware";
import { Router } from "express";

export class PromoRouter {
    private router: Router
    private promoController: PromoController
    private usersMiddleware: UsersMiddleware
    private eventsMiddleware: EventsMiddleware

    constructor() {
        this.router = Router()
        this.promoController = new PromoController()
        this.usersMiddleware = new UsersMiddleware()
        this.eventsMiddleware = new EventsMiddleware()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post('/create-promo', this.usersMiddleware.verifyToken, this.usersMiddleware.verifyOrganizer, this.eventsMiddleware.verifyEventPromo, this.promoController.createPromo)
        // this.router.patch('/update-promo/:id', this.usersMiddleware.verifyToken, this.usersMiddleware.verifyOrganizer, this.promoController.updatePromo)
        this.router.get('/:id', this.promoController.getPromoById)
        this.router.delete('/:id', this.usersMiddleware.verifyToken, this.usersMiddleware.verifyOrganizer, this.promoController.deletePromo)
    }

    getRouter() {
        return this.router
    }
}