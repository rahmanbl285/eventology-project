import { TicketController } from "@/controllers/tickets.controller";
import { EventsMiddleware } from "@/middlewares/events.middleware";
import { UsersMiddleware } from "@/middlewares/users.middleware";
import { Router } from "express";

export class TicketsRouter {
    private router: Router
    private ticketController: TicketController
    private usersMiddleware: UsersMiddleware
    private eventsMiddleware: EventsMiddleware

    constructor() {
        this.router = Router()
        this.ticketController = new TicketController()
        this.usersMiddleware = new UsersMiddleware()
        this.eventsMiddleware = new EventsMiddleware()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post('/:eventsId/tickets', this.usersMiddleware.verifyToken, this.usersMiddleware.verifyOrganizer, this.eventsMiddleware.verifyEventOwner, this.ticketController.createTickets)
        this.router.patch('/:eventsId/tickets/:ticketsId', this.usersMiddleware.verifyToken, this.usersMiddleware.verifyOrganizer, this.eventsMiddleware.verifyEventOwner, this.eventsMiddleware.verifyEventTicket, this.ticketController.updateTickets)
        this.router.delete('/:eventsId/delete-ticket/:ticketsId', this.usersMiddleware.verifyToken, this.usersMiddleware.verifyOrganizer, this.eventsMiddleware.verifyEventOwner, this.eventsMiddleware.verifyEventTicket, this.ticketController.deleteTickets)

    }

    getRouter() {
        return this.router
    }
}