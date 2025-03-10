import { responseError } from "@/helpers/resError";
import prisma from "@/prisma";
import { EventData } from "@/types/transaction.types";
import { Request, Response } from "express";

export class TransactionController {
    async createOrder(req: Request, res: Response) {
        const { eventsId, tickets, usedDiscount, usedPoint } = req.body;
        const userId = req.users?.id;
    
        try {
            if (!eventsId || !tickets || tickets.length === 0) {
                return res.status(400).json({
                    message: 'Invalid checkout data!'
                });
            }
    
            const points = await prisma.points.findUnique({
                where: { usersId: userId, expiredPoints: { gte: new Date() } }
            });
    
            const discount = await prisma.discounts.findUnique({
                where: { usersId: userId, expiredDiscount: { gte: new Date() } }
            });
    
            const transactionResult = await prisma.$transaction(async (tx) => {
                let grandTotal = 0;
                let transactionIds: number[] = []; 
    
                for (let i = 0; i < tickets.length; i++) {
                    const { type, quantity, price } = tickets[i];
    
                    const ticket = await tx.tickets.findFirst({
                        where: { eventsId, type }
                    });
    
                    if (!ticket || ticket.availableSeat < quantity) {
                        throw 'Invalid ticket or insufficient seats.'
                    }
    
                    const total = price * quantity;
                    const ticketDiscount = total * (usedDiscount ?? 0) / 100;
                    const ticketGrandTotal = total - ticketDiscount;
    
                    grandTotal += ticketGrandTotal; 

                    await tx.tickets.update({
                        where: { id: ticket.id },
                        data: { availableSeat: ticket.availableSeat - quantity }
                    });
    
                    const transaction = await tx.transaction.create({
                        data: {
                            eventId: eventsId,
                            usersId: userId!,
                            pointsId: usedPoint ? points?.id : null,
                            discountId: usedDiscount ? discount?.id : null,
                            quantity,
                            total,
                            grandTotal: ticketGrandTotal,
                            usedDiscount,
                            usedPoint,
                            status: "waitingPayment"
                        }
                    });
    
                    transactionIds.push(transaction.id);
                }
    
                if (usedPoint) {
                    if (!points || points.amount < usedPoint) {
                        throw 'Insufficient points.'
                    }
                    await tx.points.update({
                        where: { id: points.id },
                        data: { amount: points.amount - usedPoint }
                    });
                }
    
                if (usedDiscount) {
                    if (!discount || discount.discount < usedDiscount) {
                        throw 'Insufficient discount.'
                    }
                    await tx.discounts.update({
                        where: { id: discount.id },
                        data: { discount: discount.discount - usedDiscount }
                    });
                }

                grandTotal -= usedPoint ?? 0
    
                return { transactionIds, grandTotal };
            });
    
            return res.status(201).json({
                status: 'OK',
                message: "Transaction created successfully.",
                transactionIds: transactionResult.transactionIds, 
                data: transactionResult
            });
    
        } catch (err) {
            responseError(res, err);
        }
    }
    
    async getTransaction (req: Request, res: Response) {
        try {
            const { transactionIds } = req.params

            if (!transactionIds) {
                return res.status(400).json({ message: "Transaction IDs are required" });
            }
    
            const idsArray = transactionIds.split("-").map(id => parseInt(id, 10));
    
            if (idsArray.some(isNaN)) {
                return res.status(400).json({ message: "Invalid transaction IDs" });
            }

            const transactions = await prisma.transaction.findMany({
                where: { id: { in: idsArray }}
            })

            if (!transactions.length) {
                return res.status(404).json({ message: "Transactions not found" });
            }

            return res.status(200).json({
                status: 'OK',
                transactions
            })
        } catch (err) {
            responseError(res, err)
        }
    }
     

    async createPayment(req: Request, res: Response) {
        const transactionIds = req.params.transactionIds?.split("-").map(id => parseInt(id)); // Mengonversi string ke integer
        
        const userId = req.users?.id;
        const HALF_HOUR = 30 * 60 * 60 * 1000;
    
        if (!transactionIds || transactionIds.length === 0) {
            return res.status(400).json({ message: "Transaction IDs must be provided in the URL." });
        }
    
        try {
            const transactionResults = await prisma.$transaction(async (tx) => {
                const transactions = await tx.transaction.findMany({
                    where: { id: { in: transactionIds }, usersId: userId }
                });
    
                if (transactions.length !== transactionIds.length) {
                    return res.status(404).json({ message: "Some transactions not found" });
                }
    
                const now = new Date();
                for (const transaction of transactions) {
                    const expiredTime = new Date(transaction.createdAt.getTime() + HALF_HOUR);
                    if (now > expiredTime) {
                        throw 'Some transactions have expired, order is cancelled!';
                    }
                }
    
                await tx.transaction.updateMany({
                    where: { id: { in: transactionIds } },
                    data: { status: 'waitingConfirmation' }
                });
    
                return transactions;
            });
    
            return res.status(201).json({
                message: 'Payments submitted, waiting for admin confirmation!',
                transactions: transactionResults
            });
    
        } catch (err) {
            responseError(res, err);
        }
    }
    
    async confirmOrder (req: Request, res: Response) {
        const { transactionId, isConfirmed } = req.body
        const userId = req.users?.id
        try {
            const transactionResult = await prisma.$transaction(async(tx) => {
                const transaction = await tx.transaction.findUnique({
                    where: { id: transactionId },
                    include: {
                        events: true
                    }
                })

                if (!transaction) {
                    throw 'Transaction not found!'
                }

                if (transaction.events.usersId !== userId) {
                    return res.status(403).json({ message: "You are not authorized to confirm this order" })
                }

                if (transaction.status !== 'waitingConfirmation') {
                    throw 'Transaction is not in waiting confirmation state!'
                }

                let updatedTransaction;

                if (isConfirmed) {
                    updatedTransaction = await tx.transaction.update({
                        where: { id: transactionId },
                        data: { status: 'paid' }
                    })
                } else {
                    updatedTransaction = await tx.transaction.update({
                        where: { id: transactionId },
                        data: { status: 'declined' }
                    })
                }

                return updatedTransaction
            })
            return res.status(201).json({
                message: `Payment ${isConfirmed ? 'confirmed' : 'declined'}, order is now ${isConfirmed ? 'paid' : 'declined'}!`,
                transaction: transactionResult
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    async getUserOrderSummary (req: Request, res: Response) {
        const userId = req.users?.id
        try {
            if (!userId) {
                return res.status(401).json({
                    message: 'Unauthorized!'
                })
            }

            const transactions = await prisma.transaction.findMany({
                where: {
                    usersId: userId
                },
                include: {
                    events: true
                }
            })

            if (!transactions.length) {
                return res.status(404).json({ message: "No transactions found" });
            }

            const groupedTransactions = {
                success: transactions.filter(tx => tx.status === "paid"),
                failed: transactions.filter(tx => tx.status === "cancelled" || tx.status === "declined")
            };

            return res.status(200).json({
                status: 'OK',
                transactions: groupedTransactions
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    async getEventOrderSummary(req: Request, res: Response) {
        const userId = req.users?.id;
        try {
            const today = new Date();
    
            const events = await prisma.events.findMany({
                where: { usersId: userId, NOT: {
                    slug: { startsWith: 'deleted-' }
                } },
                select: { id: true, title: true, startDate: true, endDate: true, slug: true }
            });
    
            if (!events.length) {
                throw new Error("No events found for this admin");
            }
    
            const eventIds = events.map(event => event.id);
    
            const transaction = await prisma.transaction.findMany({
                where: {
                    eventId: { in: eventIds },
                    status: 'waitingConfirmation'
                },
                include: {
                    users: true
                }
            });
            
    
            const paidTransactions = await prisma.transaction.groupBy({
                by: ['eventId'],
                where: {
                    eventId: { in: eventIds },
                    status: 'paid'
                },
                _sum: {
                    quantity: true,
                    grandTotal: true
                }
            });
    
            const result = await prisma.transaction.findMany({
                where: { 
                    eventId: { in: eventIds },
                    status: 'paid'
                },
                include: {
                    users: true 
                }
            });
    
            const activeEvents: EventData[] = [];
            const nonActiveEvents: EventData[] = [];
    
            events.forEach(event => {
                const pending = transaction.filter(t => t.eventId === event.id).length;
                const paid = paidTransactions.find(t => t.eventId === event.id)?._sum.quantity || 0;
                const revenue = paidTransactions.find(t => t.eventId === event.id)?._sum.grandTotal || 0;
    
                const eventData: EventData = {
                    id: event.id,
                    title: event.title,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    slug: event.slug || '',
                    totalTransactionPending: pending,
                    totalTicketQtyPaid: paid,
                    totalPenjualanPaid: revenue
                };
    
                if (new Date(event.endDate) >= today) {
                    activeEvents.push(eventData);
                } else {
                    nonActiveEvents.push(eventData);
                }
            });
    
            res.status(200).json({
                status: 'OK',
                totalSuccessTransaction: result.length,
                totalActiveEvents: activeEvents.length,
                totalNonActiveEvents: nonActiveEvents.length,
                totalTicketTerjual: paidTransactions.reduce((total, event) => total + (event._sum.quantity || 0), 0),
                totalPenjualan: paidTransactions.reduce((total, event) => total + (event._sum.grandTotal || 0), 0),
                transaction,
                activeEvents,
                nonActiveEvents,
                paidOrders: result 
            });
    
        } catch (err) {
            responseError(res, err);
        }
    }
}