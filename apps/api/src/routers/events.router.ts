import { EventsController } from "@/controllers/events.controller";
import { uploader } from "@/helpers/uploader";
import { EventsMiddleware } from "@/middlewares/events.middleware";
import { UsersMiddleware } from "@/middlewares/users.middleware";
import { Router } from "express";

export class EventsRouter {
    private router: Router
    private eventsController: EventsController
    private usersMiddleware: UsersMiddleware
    private eventsMiddleware: EventsMiddleware

    constructor() {
        this.router = Router()
        this.eventsController = new EventsController()
        this.usersMiddleware = new UsersMiddleware()
        this.eventsMiddleware = new EventsMiddleware()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/', this.eventsController.getEvent)
        this.router.get("/top-events-all-time", this.eventsController.getTopEventsAllTime)
        this.router.get('/by-organizer', this.usersMiddleware.verifyToken, this.eventsController.getEventByOrganizer)
        this.router.get('/ticket', this.eventsController.getTickets)
        this.router.get('/title', this.eventsController.getEventTitle)
        this.router.get('/:slug', this.eventsController.getEventSlug)
        this.router.post('/create-event', this.usersMiddleware.verifyToken, this.usersMiddleware.verifyOrganizer, uploader('IMG', '/images/events').single('file'), this.eventsController.createEvent)
        this.router.patch('/update-event/:id', this.usersMiddleware.verifyToken, this.usersMiddleware.verifyOrganizer, this.eventsMiddleware.verifyEventOwner, uploader('IMG', '/images/events').single('file'), this.eventsController.updateEvent)
        this.router.patch('/:id/delete', this.usersMiddleware.verifyToken, this.usersMiddleware.verifyOrganizer, this.eventsMiddleware.verifyEventOwner, this.eventsController.deleteEvent)
    }

    getRouter() {
        return this.router
    }
}