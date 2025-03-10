import { responseError } from "@/helpers/resError";
import prisma from "@/prisma";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export class UsersMiddleware {
    verifyToken (req: Request, res: Response, next: NextFunction) {
        
        try {
            let token = req.headers.authorization?.replace("Bearer ", "")
            if (!token) throw 'Token Empty!'

            const verifyUsers = verify(token, process.env.KEY_JWT!)
            req.users = verifyUsers as Users

            next()
        } catch (err) {
            responseError(res, err)
        }
    }

    async verifyOrganizer (req: Request, res: Response, next: NextFunction) {
        try {
            const usersId = req.users?.id
            if(!usersId) {
                return res.status(400).json({
                    status: 'Error',
                    message: 'User ID required!'
                })
            }
            const users = await prisma.users.findFirst({
                where: { id: usersId }
            })

            if (!users) {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Users not found!'
                })
            }

            if (!users.isOrganizer) {
                return res.status(403).json({
                    status: 'Error',
                    message: "You do not have permission to perform this action!"
                })
            }

            next()
        } catch (err) {
            responseError(res, err)
        }
    }

}