import { Response, Request } from "express";
import prisma from "@/prisma";
import { hash, genSalt, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'
import handlebars from 'handlebars'
import { transporter } from "@/helpers/nodemailer";
import ReferralCode from '@/controllers/referralCode.controller'
import { responseError } from "@/helpers/resError";
import { findUserEmail, findUserUsername } from "@/services/user.services";

export class UsersController {
    async getUsers (req: Request, res: Response) {
        try {
            const user = await prisma.users.findMany({
                include: {
                    Referral: true,
                    Points: true,
                    Discounts: true
                }
            })
            res.status(200).json(user)
        } catch (err) {
            responseError(res, err)
        }
    }
    async userRegister (req: Request, res: Response) {
        try {
            const { name, username, email, password, useReferral } = req.body
            const salt = await genSalt(10)
            const hashPassword = await hash(password, salt)
            const findEmail = await findUserEmail(email)
            const findUsername = await findUserUsername(username)

            if (findUsername) throw ('This username has been taken by another user, please change your username')
            if (findEmail) throw 'This email has been taken by another user, please change your email'
                
            let createdUser
    
            if (useReferral !== undefined && useReferral !== null && useReferral !== '') {
                const reffUser = await prisma.referral.findUnique({
                    where: {
                        myReferralCode: useReferral,
                    }
                })
            
                if (!reffUser) throw 'Wrong referral code!'
    
                if (reffUser.referralStatus !== 'ACTIVE') throw 'Wrong referral code!'

                    createdUser = await prisma.users.create({
                        data: {
                            name: name,
                            username: username,
                            email: email,
                            password: hashPassword
                        }
                    })
            } else {
                createdUser = await prisma.users.create({
                    data: {
                        name,
                        username,
                        email,
                        password: hashPassword
                    }
                })
            }
    
            const payload = {
                id: createdUser?.id,
                useReferral: useReferral || null
            }
            const token = sign(payload, process.env.KEY_JWT!, {})
            const link = `http://localhost:3000/verify/activate/${token}`
            const templatePath = path.join(__dirname, "../templates", "register.html")
            const templateSource = fs.readFileSync(templatePath, 'utf-8')
            const compiledTemplate = handlebars.compile(templateSource)
            const html = compiledTemplate({
                name: createdUser?.username,
                link
            })
    
            await transporter.sendMail({
                from: process.env.MAIL_USER!,
                to: createdUser?.email,
                subject: 'Verify as User',
                html
            })
    
            res.status(201).json({
                status: 'OK',
                user: createdUser,
                link
            })
        } catch (err) {
            responseError(res, err)
    }
}

    async userActivate (req: Request, res: Response) {
        try {
            const activateUser = await prisma.users.update({
                where: { id: req.users?.id },
                data: { isActive: true, status: 'ACTIVE' }
            })

            const myReferralCode = await ReferralCode()
            if (activateUser) {
                await prisma.referral.create({
                    data: {
                        myReferralCode,
                        usersId: req.users?.id!
                    }
                })
            }
 
            if (req.users?.useReferral) {
                const reffUsers = await prisma.referral.findUnique({
                    where: { myReferralCode: req.users?.useReferral }
                })

                if (!reffUsers) throw 'Wrong Referral Code!'

                const existingPoints = await prisma.points.findUnique({
                    where: { usersId: reffUsers.usersId }
                })


                if (existingPoints) {
                // Update jumlah poin yang ada dengan menambahkannya
                await prisma.points.update({
                    where: { usersId: reffUsers.usersId },
                    data: {
                        amount: existingPoints.amount + 10000, // Menambahkan 10000 poin
                    }
                })
            } else {
                // Jika belum ada poin, buat poin baru
                await prisma.points.create({
                    data: {
                        amount: 10000,
                        expiredPoints: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
                        usersId: reffUsers.usersId 
                    }
                })
            }

                await prisma.discounts.create({
                    data: {
                        discount: 10,
                        expiredDiscount: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
                        usersId: req.users?.id
                    }
                })
            }
            res.status(200).json({
                status: 'OK',
                message: 'Account successfully activated!',
            })
        } catch (err) {
            responseError (res, err)
        }
    }

    async userLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const users = await prisma.users.findFirst({
                where: {
                    email
                }
            });
    
            if (users == null) throw 'User not Found!';
            if (users.isActive === false && users.status === 'INACTIVE') throw 'Please activate your account!';
            if (users.status === 'DEACTIVATE') {
                await prisma.users.update({
                    where: { id: users.id},
                    data: { status: 'ACTIVE', deactivateAt: null }
                })

                const userId = await prisma.referral.findUnique({
                    where: { usersId: users.id }
                });
                
                if (userId) {
                    await prisma.referral.update({
                        where: { usersId: userId.usersId },
                        data: { referralStatus: "ACTIVE" }
                    });
                }                    
            }
    
            const isValidPass = await compare(password, users.password);
            if (isValidPass == false) throw 'Wrong Password!';
    
            const payload = {
                id: users.id,
                isOrganizer: users.isOrganizer
            };
            const token = sign(payload, process.env.KEY_JWT!, {});
    
            res.status(200).json({
                status: 'OK',
                users,
                token
            });
        } catch (err) {
            responseError(res, err)
        }
    }

    async keepLogin (req: Request, res: Response) {
        try {
            const users = await prisma.users.findUnique({
                where: { id: req.users?.id },
                select: {
                    id: true,
                    username: true,
                    isOrganizer: true
                }
            })
            res.status(200).json(users)
        } catch (err) {
            responseError (res, err)
        }
    }

    async deactivateAccount (req: Request, res: Response) {
        try {
            const userId = req.users?.id
            if (!userId) throw 'User not authenticated.'

            const users = await prisma.users.update({
                where: { id: userId },
                data: { 
                    status: 'DEACTIVATE',
                    deactivateAt: new Date()
                }
            })

            if (!users) {
                return res.status(404).json({ error: 'User not found!'})
            }

            await prisma.referral.update({
                where: { usersId: userId },
                data: { referralStatus: 'INACTIVE' }
            })

            await prisma.points.deleteMany({
                where: { usersId: userId }
            })

            await prisma.discounts.deleteMany({
                where: { usersId: userId }
            })
            
            res.status(200).json({
                status: 'OK',
                message: 'Account successfully deactivated!'
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    async updateOrganizer (req: Request, res: Response) {
        try {
            const usersId = req.users?.id
            if (!usersId) {
                return res.status(400).json({
                    status: 'Error',
                    message: 'User ID required!'
                })
            }

            const users = await prisma.users.findFirst({
                where: {
                    id: usersId,
                }
            })

            if (!users) {
                return res.status(404).json({
                    statsu: 'Error',
                    message: 'User not found!'
                })
            }

            const updatedOrganizer = await prisma.users.update({
                where: { id: usersId },
                data: { isOrganizer: !users.isOrganizer}
            })

           
            res.status(200).json({
                status: 'OK',
                message: 'Updated!',
                isOrganizer: updatedOrganizer.isOrganizer
            })
        } catch (err) {
            responseError(res, err)
        }
    }
}
