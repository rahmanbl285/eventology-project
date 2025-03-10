import { PrismaClient } from "@prisma/client";
import { listDiscounts, listPoints, listReferrals, listUsers } from "./models/users";
import { listEvent, listTicket } from "./models/events";

const prisma = new PrismaClient()

async function main() {
    try {
        const users = await listUsers()
        await prisma.users.createMany({
            data: users,
            skipDuplicates: true
        })

        const referrals = await listReferrals()
        await prisma.referral.createMany({
            data: referrals,
            skipDuplicates: true
        })

        const discount = await listDiscounts()
        await prisma.discounts.createMany({
            data: discount,
            skipDuplicates: true
        })

        const point = await listPoints()
        await prisma.points.createMany({
            data: point,
            skipDuplicates: true
        })

        const event = await listEvent()
        await prisma.events.createMany({
            data: event,
            skipDuplicates: true
        })

        const ticket = await listTicket()
        await prisma.tickets.createMany({
            data: ticket,
            skipDuplicates: true
        })

        console.log('Data successfully seeded.');
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect()
    }
}

main()
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect()
        process.exit(1)
    })