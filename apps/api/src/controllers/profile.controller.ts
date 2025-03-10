import { responseError } from "@/helpers/resError";
import prisma from "@/prisma";
import { compare, genSalt, hash } from "bcrypt";
import { Request, Response } from "express";
import path from 'path'
import fs from 'fs'
import handlebars from 'handlebars'
import { transporter } from "@/helpers/nodemailer";
import { sign, verify } from "jsonwebtoken";
import { TokenPayload } from "@/types/profile.types";
import EmailCensored from "@/helpers/emailCensored";
import { findUserUsername } from "@/services/user.services";

export class ProfileController {
    async userProfile (req: Request, res: Response) {
        try {
            const user = await prisma.users.findUnique({
                where: { id: req.users?.id },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    image: true,
                    isOrganizer: true,
                    status: true,
                    createdAt: true,
                    deactivateAt: true,
                    Referral: true,
                    Events: true,
                    Discounts: true,
                    Points: true
                }
            })
            res.status(200).json(user)
        } catch (err) {
            responseError(res, err)
        }
    }

    async updateUserProfile (req: Request, res: Response) {
        try {
            const { name, username, image } = req.body
            const { file } = req

            const currentUserProfile = await prisma.users.findUnique({
                where: { id: req.users?.id },
                select: { image: true }
            });

            if (username) {
                const currentUser = await prisma.users.findUnique({
                    where: { id: Number(req.users?.id) }, // Convert ke number
                    select: { username: true }
                });
            
                if (currentUser?.username !== username) {
                    const findUsername = await findUserUsername(username, Number(req.users?.id)); // Convert ke number
                    if (findUsername) throw 'Username not available!';
                }
            }
            
            

            const imageProfile = file ? `http://localhost:8000/public/images/${file?.filename}` : currentUserProfile?.image

            const result = await prisma.users.update ({
                where: {
                    id: req.users?.id
                },
                data: {
                    name,
                    username,
                    image: imageProfile
                }
            })
            res.status(200).json({
                status: 'OK',
                message: 'Profile Updated!',
                result
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    async verifyPassword (req: Request, res: Response) {
        try {
            const { password } = req.body
            const userId = req.users?.id

            if (!userId) throw 'User not logged in!'

            const user = await prisma.users.findUnique({
                where: { id: userId },
                select: { password: true }
            })

            if (!user) throw 'User not found!'

            const isPasswordValid = await compare(password, user.password)
            if (isPasswordValid) {
                res.status(201).json({ status: 'OK', message: 'Password Verified'})
            } else {
                res.status(401).json({ status: 'error', message: 'Invalid Password'})
            }
        } catch (err) {
            responseError(res, err)
        }
    }

    async updatePassword (req: Request, res: Response) {
        try {
            const { currentPassword, newPassword } = req.body
            const userId = req.users?.id

            if (!userId) throw 'User not logged in!'

            const user = await prisma.users.findUnique({
                where: {
                    id: userId
                },
                select: {
                    password: true
                }
            })

            if (!user) throw 'User not found!'

            const isPasswordValid = await compare(currentPassword, user.password)
            if (!isPasswordValid) {
                return res.status(401).json({ status: 'error', message: 'Invalid Current Password'})
            }

            const salt = await genSalt(10)
            const hashPassword = await hash(newPassword, salt)

            const updatedPassword = await prisma.users.update({
                where: {
                    id: userId
                },
                data: {
                    password: hashPassword
                }
            })

            const templatePath = path.join(__dirname, '../templates', 'update-password.html')
            const templateSource = fs.readFileSync(templatePath, 'utf-8')
            const compiledTemplate = handlebars.compile(templateSource)
            const html = compiledTemplate({
                name: updatedPassword?.name,
                username: updatedPassword?.username
            })

            await transporter.sendMail({
                from: process.env.MAIL_USER!,
                to: updatedPassword?.email,
                subject: 'Your password has been changed',
                html
            })

            res.status(200).json({
                status: 'OK',
                message: 'Password Updated!',
                result: updatedPassword
            })
        } catch (err) {
            responseError(res, err)
        }
    }

    async verifyEmail (req: Request, res: Response) {
    try {
        const { newEmail } = req.body;
        const userId = req.users?.id;
        const emailUser = await prisma.users.findUnique({
            where: { email: newEmail }
        })

        if (!userId) throw 'User ID not found in request.'

        if (!newEmail) throw 'New email address is required.'

        if (emailUser) throw 'Email not available!'


        const token = sign({ userId, newEmail }, process.env.KEY_JWT!, { expiresIn: '1h' });
        const link = `http://localhost:3000/verify/activate-new-email/${token}`;

        const templatePath = path.join(__dirname, '../templates', 'verify-new-email.html');
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const compiledTemplate = handlebars.compile(templateSource);
        const html = compiledTemplate({ name: req.users?.username, link });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: newEmail,
            subject: 'Verify Your New Email Address',
            html,
        });

        res.status(200).json({
            status: 'OK',
            message: 'Verification email sent to new address.',
        });
    } catch (err) {
        console.error(err);
        responseError(res, err)
    }
}

    async updateEmail (req: Request, res: Response) {
        try {
            const { token } = req.params
            const decoded = verify(token, process.env.KEY_JWT!) as TokenPayload

            const { userId, newEmail } = decoded

            const user = await prisma.users.findUnique({
                where: { id: userId }
            })

            if (!user) throw 'User not Found!'

            const oldEmail = user.email
            const censoredNewEmail = EmailCensored(newEmail)

            await prisma.users.update({
                where: { id: userId },
                data: { email: newEmail }
            })

            const notificationTemplatePath = path.join(__dirname, '../templates', 'notif-email-change.html')
            const notificationTemplateSource = fs.readFileSync(notificationTemplatePath, 'utf-8')
            const compiledNotificationTemplate = handlebars.compile(notificationTemplateSource)
            const notificationHtml = compiledNotificationTemplate({
                name: user.username,
                newEmail: censoredNewEmail
            })

            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: oldEmail,
                subject: 'Your Email Address has Been Changed',
                html: notificationHtml
            })

            res.status(200).json({
                status: 'OK',
                message: 'Email successfully updated and notification sent.',
            });
        } catch (err) {
            responseError(res, err)
        }
    }

}