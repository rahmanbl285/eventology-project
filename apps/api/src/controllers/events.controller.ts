import { responseError } from "@/helpers/resError";
import prisma from "@/prisma";
import { Request, Response } from "express";

export class EventsController {
    async getEvent (req: Request, res: Response) {
        try {
            const event = await prisma.events.findMany({
                where: {
                    NOT: {
                        slug: { startsWith: "deleted-"}
                    }
                },
                include: {
                    Tickets: true,
                    EventPromo: {
                        include: {
                            promo: {
                                include: {
                                    PromoItems: true
                                }
                            }
                        }
                    },
                    Transaction: true
                }
            })
            res.status(200).json(event)
        } catch (err) {
            responseError(res, err)
        }
    }

    async getTopEventsAllTime(req: Request, res: Response) {
        try {
            const topEvents = await prisma.events.findMany({
                where: {
                    NOT: {
                        slug: { startsWith: "deleted-" }
                    }
                },
                include: {
                    Transaction: true,
                    Tickets: true,
                    EventPromo: {
                        include: {
                            promo: {
                                include: {
                                    PromoItems: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    Transaction: { _count: 'desc' } // Urutkan berdasarkan jumlah transaksi terbanyak
                },
                take: 3 // Ambil 3 event teratas
            });
    
            res.status(200).json({ status: "OK", topEvents });
        } catch (err) {
            responseError(res, err);
        }
    }
    
    

    async getEventByOrganizer(req: Request, res: Response) {
        try {
            const userId = req.users?.id;
    
            if (!userId) {
                return res.status(400).json({ error: "User ID not found" });
            }
    
            const event = await prisma.events.findMany({
                where: { 
                    usersId: userId,
                    NOT: {
                        slug: { startsWith: 'deleted-' }
                    }
                }
            });
            
            const today = new Date();
            
            const activeEvents = await prisma.events.findMany({
                where: { 
                    usersId: userId,
                    endDate: { gte: today },
                    NOT: {
                        slug: { startsWith: 'deleted-' }
                    }
                }
            });
            
            const nonActiveEvents = await prisma.events.findMany({
                where: { 
                    usersId: userId,
                    endDate: { lt: today },
                    NOT: {
                        slug: { startsWith: 'deleted-' }
                    }
                }
            });
            

            res.status(200).json({
                status: 'OK',
                totalEvent: event.length,
                activeEvent: activeEvents.length,
                nonactiveEvent: nonActiveEvents,
                event
            });
        } catch (err) {
            responseError(res, err);
        }
    }
    

    async getEventTitle (req: Request, res: Response) {
        try {
            const { t } = req.query
            const query: any = {
                select: {
                    id: true,
                    title: true,
                    slug: true
                },
                where: {
                    AND: [
                        t ? { title: { contains: String(t) } } : { title: { not: undefined} },
                        { NOT: { slug: { startsWith: 'deleted-' }}}
                    ]
                },
                orderBy: {
                    title: 'asc'
                }
            }
            if (t) {
                query.take = 6
            }
            const eventTitleList = await prisma.events.findMany(query)
            console.log('Fetched events:', eventTitleList); 
            res.status(200).json({
                status: 'OK',
                eventTitleList
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    async getEventSlug (req: Request, res: Response) {
        try {
            const { slug } = req.params
            const { id } = req.query
            const event = await prisma.events.findFirst({
                where: {
                    slug: slug,
                    ...(id && { id: +id }),
                    NOT: {
                        slug: { startsWith: 'deleted-' }
                    }
                },
                include: {
                    Tickets: true,
                    users: true
                }
            })

            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            
            res.status(200).json({
                status: 'OK',
                event
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    async getTickets (req: Request, res: Response) {
        try {
            const ticket = await prisma.tickets.findMany()

            res.status(200).json(ticket)
        } catch (err) {
            responseError(res, err)
        }
    }

    async createEvent (req: Request, res: Response) {
        const { title, startDate, endDate, description, city, address, category, tickets } = req.body
        
        const validCategories = ['Festival', 'Konser', 'Pertandingan', 'Pameran', 'Konferensi', 'Workshop', 'Pertunjukan', 'Seminar'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Invalid category provided.'
            });
        }

        const usersId = req.users?.id
        
        if (!usersId) {
            return res.status(404).json({
                status: 'Error',
                message: 'User not found!'
            })
        }

        try {
            const slug = req.body.title.toString().toLowerCase().replaceAll(" ", "-")
            const { file } = req
            const imageEvent = `http://localhost:8000/public/images/events/${file?.filename}`

            const newEvent = await prisma.events.create({
                data: {
                    usersId,
                    title,
                    address,
                    city,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    image: imageEvent,
                    description,
                    slug,
                    category,
                }
            })

            if (tickets && Array.isArray(tickets)) {
                const ticketPromises = tickets.map((ticket: any) => {
                    if (!ticket.type || !ticket.availableSeat || !ticket.price || !ticket.startSaleDate || !ticket.endSaleDate) {
                        throw new Error('Missing ticket data');
                    }
    
                    const { type, availableSeat, price, startSaleDate, endSaleDate } = ticket;
                    const isPaid = price > 0;
    
                    return prisma.tickets.create({
                        data: {
                            eventsId: newEvent.id,
                            type,
                            availableSeat: parseInt(availableSeat),
                            price: parseInt(price),
                            isPaid,
                            startSaleDate: new Date(startSaleDate),
                            endSaleDate: new Date(endSaleDate)
                        }
                    });
                });
    
                await Promise.all(ticketPromises).catch((error) => {
                    console.error("Error saving tickets:", error);
                  });
            }

            const eventWithTickets = await prisma.events.findUnique({
                where: { id: newEvent.id },
                include: {
                  Tickets: true
                }
              });

            
            res.status(201).json({
                status: 'OK',
                message: 'Event created!',
                newEvent: eventWithTickets
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    async updateEvent (req: Request, res: Response) {
        try {
            const { title, startDate, endDate, description, address, city, category } = req.body
            const { file } = req
            const slug = req.body.title.toString().toLowerCase().replaceAll(" ", "-")
            const eventId = req.params.id

            const currentEvent = await prisma.events.findUnique({
                where: { id: +eventId }
            })

            if (!currentEvent) {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Event not found!'
                });
            }


            const imageEvent = file ? `http://localhost:8000/public/images/events/${file?.filename}` : currentEvent?.image

            const updatedEvent = await prisma.events.update({
                where: { id: +eventId },
                data: {
                    slug: slug,
                    title: title || currentEvent.title,
                    startDate: startDate || currentEvent.startDate,
                    endDate: endDate || currentEvent.endDate, 
                    description: description || currentEvent.description, 
                    address: address || currentEvent.address, 
                    city: city || currentEvent.city,
                    category: category || currentEvent.category, 
                    image: imageEvent
                }
            })

            res.status(200).json({
                status: 'OK',
                message: 'Profile Updated!',
                updatedEvent
            })
        } catch (err) {
        responseError(res, err);
        }
    }

    async deleteEvent (req: Request, res: Response) {
        try {
            const eventId = +req.params.id
            await prisma.events.update({
                where: { id: eventId },
                data: {
                    slug: `deleted-${eventId}-${Date.now()}`
                }
            })
            res.status(200).json({
                status: 'OK',
                message: 'Event Deleted!'
            })
        } catch (err) {
            responseError(res, err)
        }
    }
}