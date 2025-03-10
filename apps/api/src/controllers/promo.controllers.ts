import { responseError } from "@/helpers/resError";
import prisma from "@/prisma";
import { Request, Response } from "express";

export class PromoController {
    async createPromo (req: Request, res: Response) {
        try {
            const { eventsId, promoItems } = req.body

            if (!eventsId || !promoItems || promoItems.length === 0) {
                return res.status(400).json ({
                    status: 'Error',
                    message: 'eventsId and promoItems are required fields!'
                })
            }

            const newPromo = await prisma.promo.create({
                data: {
                    EventPromo: {
                        create: eventsId.map((eventId: number) => ({ eventsId: eventId }))
                    },
                    PromoItems: {
                        create: promoItems.map((item: { name: string, discount: number, startDate: Date, endDate: Date }) => ({
                            name: item.name,
                            discount: item.discount,
                            startDate: new Date(item.startDate),
                            endDate: new Date(item.endDate)
                        }))
                    }
                },
                include: {
                    EventPromo: {
                        include: {
                            events: true
                        }
                    },
                    PromoItems: true
                }
            })

            res.status(201).json({
                status: 'OK',
                message: 'Promo created successfully!',
                newPromo
            })

        } catch (err) {
            responseError(res, err)
        }
    }

    async getPromoById (req: Request, res: Response) {
        try {
            const promoId = +req.params.id
            const promo = await prisma.promo.findUnique({
                where: { id: promoId },
                include: {
                    EventPromo: {
                        include: {
                            events: true
                        }
                    },
                    PromoItems: true
                }
            })

            res.status(200).json({
                status: 'OK',
                promo
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    // async updatePromo(req: Request, res: Response) {
    //     try {
    //         const { eventsId, promoItems } = req.body;
    //         const promoId = +req.params.id;
    
    //         const promo = await prisma.promo.findUnique({
    //             where: { id: promoId },
    //             include: {
    //                 EventPromo: {
    //                     include: {
    //                         events: true
    //                     }
    //                 },
    //                 PromoItems: true
    //             }
    //         });
    
    //         if (!promo) {
    //             return res.status(404).json({
    //                 status: 'Error',
    //                 message: 'Promo not Found!'
    //             });
    //         }
    
    //         const oldEventPromo = promo.EventPromo;
    //         const oldPromoItems = promo.PromoItems;
    
    //         const updatedPromo = await prisma.promo.update({
    //             where: { id: promoId },
    //             data: {
    //                 EventPromo: eventsId && eventsId.length > 0 ? {
    //                     update: eventsId.map((eventId: number) => ({
    //                         where: {
    //                             id: oldEventPromo.find((ep) => ep.eventsId === eventId)?.id
    //                         },
    //                         data: {
    //                             eventsId: eventId
    //                         }
    //                     }))
    //                 } : {
    //                     update: oldEventPromo.map((ep: { id: number, eventsId: number}) => ({
    //                         where: { id: ep.id },
    //                         data: {
    //                             eventsId: ep.eventsId
    //                         }
    //                     }))
    //                 },
                    
    //                 PromoItems: promoItems && promoItems.length > 0 ? {
    //                     update: promoItems.map((item: { name: string, discount: number, startDate: Date, endDate: Date }, idx: number) => ({
    //                         where: {
    //                             id: oldPromoItems[idx].id
    //                         },
    //                         data: {
    //                             name: item.name,
    //                             discount: item.discount,
    //                             startDate: item.startDate,
    //                             endDate: item.endDate
    //                         }
    //                     }))
    //                 } : {
    //                     update: oldPromoItems.map((item: { id: number, name: string, discount: number, startDate: Date, endDate: Date }) => ({
    //                         where: { id: item.id },
    //                         data: {
    //                             name: item.name,
    //                             discount: item.discount,
    //                             startDate: item.startDate,
    //                             endDate: item.endDate
    //                         }
    //                     }))
    //                 }
    //             }
    //         });
    
    //         res.status(200).json({
    //             status: 'OK',
    //             message: 'Promo successfully updated!',
    //             updatedPromo
    //         });
    //     } catch (err) {
    //         responseError(res, err);
    //     }
    // }

    async deletePromo(req: Request, res: Response) {
        try {
            const promoId = +req.params.id

            await prisma.eventPromo.deleteMany({
                where: { promoId: promoId }
            })

            await prisma.promoItems.deleteMany({
                where: { promoId: promoId }
            })

            const deletedPromo = await prisma.promo.delete({
                where: { id: promoId }
            })

            res.status(200).json({
                status: 'OK',
                message: 'Promo successfully deleted!',
                deletedPromo,
            });
        } catch (err) {
            responseError(res, err)
        }
    }
    }