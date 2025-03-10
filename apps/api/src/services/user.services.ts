import prisma from "@/prisma"

export const findUserEmail = async (email: string): Promise<Users | null> => {
    return await prisma.users.findUnique({
        where: {
            email
        }
    })
}

export const findUserUsername = async (username: string, excludeUserId?: number): Promise<any> => {
    return await prisma.users.findFirst({
        where: {
            username,
            NOT: excludeUserId ? { id: excludeUserId } : undefined // Pastikan tipe id sesuai dengan database
        }
    });
}


