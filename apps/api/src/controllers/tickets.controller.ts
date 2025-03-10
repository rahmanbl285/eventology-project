import { responseError } from "@/helpers/resError"
import prisma from "@/prisma"
import { Request, Response } from "express"

export class TicketController {
    async createTickets (req: Request, res: Response) {
        try {
            const { type, availableSeat, price, startSaleDate, endSaleDate } = req.body
            const eventsId = +req.params.eventsId

            const event = await prisma.events.findUnique({
                where: { id: eventsId }
            })
            

            if (!event) {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Event not Found!'
                })
            }

            const isPaid = price > 0

            const ticket = await prisma.tickets.create ({
                data: {
                    eventsId: eventsId,
                    type,
                    availableSeat: parseInt(availableSeat),
                    price: parseInt(price),
                    isPaid,
                    startSaleDate: new Date(startSaleDate),
                    endSaleDate: new Date(endSaleDate)
                }
            })
            res.status(201).json({
                status: 'OK',
                message: 'Ticket successfully created!',
                ticket
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    async updateTickets (req: Request, res: Response) {
        try {
            const { type, availableSeat, price, startSaleDate, endSaleDate } = req.body
            const ticketsId = req.params.ticketsId

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

             const usersId = req.users?.id; // Ambil user id dari token
        if (ticket.events.usersId !== usersId) {
            return res.status(403).json({
                status: 'Error',
                message: 'You do not have permission to update this ticket!'
            });
        }

            const isPaid = price > 0

            const updatedTicket = await prisma.tickets.update ({
                where: { id: +ticketsId },
                data: {
                    type: type || ticket.type,
                    availableSeat: availableSeat || ticket.availableSeat,
                    price: price || ticket.price,
                    isPaid: isPaid || ticket.isPaid,
                    startSaleDate: startSaleDate || ticket.startSaleDate,
                    endSaleDate: endSaleDate || ticket.endSaleDate
                }
            })

            res.status(200).json({
                status: 'OK',
                message: 'Ticket successfully updated!',
                updatedTicket
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    async deleteTickets (req: Request, res: Response) {
        try {
            const ticketsId = +req.params.ticketsId
             
            const deletedTicket = await prisma.tickets.delete({
                where: { id: ticketsId }
            })
            res.status(200).json({
                status: 'OK',
                message: 'Ticket Deleted!',
                deletedTicket
            })
        } catch (err) {
            responseError(res, err)
        }
    }

}