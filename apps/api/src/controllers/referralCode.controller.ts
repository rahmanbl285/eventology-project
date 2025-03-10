import prisma from "@/prisma";

export default async function ReferralCode () {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const length = 8 
    let referralCode = ''

    for (let i = 0; i < length; i++) {
        referralCode += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    const existingReferral = await prisma.referral.findUnique({
        where: {
            myReferralCode: referralCode
        }
    })

    if (existingReferral) {
        return ReferralCode()
    }

    return referralCode
}