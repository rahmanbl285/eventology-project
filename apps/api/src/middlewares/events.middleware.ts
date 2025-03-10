import { responseError } from "@/helpers/resError"
import prisma from "@/prisma"
import { NextFunction, Request, Response } from "express"

export class EventsMiddleware {
    async verifyEventOwner (req: Request, res: Response, next: NextFunction) {
        try {
            const eventsId = +req.params.id || +req.params.eventsId

            if (isNaN(eventsId)) {
                return res.status(400).json({
                    status: 'Error',
                    message: 'Invalid event ID!'
                });
            }
            
            const usersId = req.users?.id

            const event = await prisma.events.findUnique({
                where: { id: eventsId }
            })
            if (!event) {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Event not Found!'
                })
            }

            if (event.usersId !== usersId) {
                return res.status(403).json({
                    status: 'Error',
                    message: 'You do not have permission to perform this action!'
                })
            }

            if (event.id !== eventsId) {
                return res.status(403).json({
                    status: 'Error',
                    message: 'You do not have permission to perform this action!'
                })
            }

            next()
        } catch (err) {
            responseError(res, err)
        }
    }

    async verifyEventTicket (req: Request, res: Response, next: NextFunction) {
    try {
        const usersId = req.users?.id; 
        const ticketsId = +req.params.ticketsId

        const ticket = await prisma.tickets.findUnique({
            where: { id: +ticketsId },
            include: { events: true }
        })
        if (!ticket) {
            return res.status(404).json({
                status: 'Error',
                message: 'Ticket not Found!'
            })
        }
        if (ticket.events.usersId !== usersId) {
            return res.status(403).json({
                status: 'Error',
                message: 'You do not have permission to access this ticket!'
            });
        }

        next()
    } catch (err) {
        responseError(res, err)
    }
    }

    async verifyEventPromo (req: Request, res: Response, next: NextFunction) {
        try {
            const usersId = req.users?.id;
            const { eventsId } = req.body; 
            
            if (!eventsId || eventsId.length === 0) {
                return res.status(400).json({
                    status: 'Error',
                    message: 'At least one event must be associated with the promo!'
                });
            }
    
            const events = await prisma.events.findMany({
                where: {
                    id: { in: eventsId },
                    usersId: usersId 
                }
            });
  
            if (events.length !== eventsId.length) {
                return res.status(403).json({
                    status: 'Error',
                    message: 'One or more events are not owned by you!'
                });
            }
    
            next(); 
        } catch (err) {
            responseError(res, err);
        }    }
}