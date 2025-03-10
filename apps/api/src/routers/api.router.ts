import { Router } from "express";
import { UsersRouter } from "./users.router";
import { ProfileRouter } from "./profile.router";
import { EventsRouter } from "./events.router";
import { TicketsRouter } from "./tickets.router";
import { PromoRouter } from "./promo.router";
import { LocationRouter } from "./city.router";
import { TransactionRouter } from "./transaction.router";

export class ApiRouter {
    private usersRouter: UsersRouter
    private profileRouter: ProfileRouter
    private eventsRouter: EventsRouter
    private ticketsRouter: TicketsRouter
    private promoRouter: PromoRouter
    private locationRouter: LocationRouter
    private transactionRouter: TransactionRouter
    private router: Router

    constructor() {
        this.usersRouter = new UsersRouter()
        this.profileRouter = new ProfileRouter()
        this.eventsRouter = new EventsRouter()
        this.ticketsRouter = new TicketsRouter()
        this.promoRouter = new PromoRouter()
        this.locationRouter = new LocationRouter()
        this.transactionRouter = new TransactionRouter()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.use('/users', this.usersRouter.getRouter())
        this.router.use('/profiles', this.profileRouter.getRouter())
        this.router.use('/events', this.eventsRouter.getRouter())
        this.router.use('/event', this.ticketsRouter.getRouter())
        this.router.use('/promo', this.promoRouter.getRouter())
        this.router.use('/location', this.locationRouter.getRouter())
        this.router.use('/orders', this.transactionRouter.getRouter())
    }

    getRouter() {
        return this.router
    }
}