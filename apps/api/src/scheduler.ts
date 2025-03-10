import cron from 'node-cron'
import prisma from './prisma'
import { responseError } from './helpers/resError'

async function deleteInactiveAccount () {
    const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = new Date (Date.now() - THIRTY_DAYS_IN_MS)

    try {
        const usersToDelete = await prisma.users.findMany({
            where: {
                status: 'DEACTIVATE',
                deactivateAt: {
                    lt: thirtyDaysAgo
                }
            }
        })

        for (const user of usersToDelete) {
            await prisma.points.deleteMany({
              where: { usersId: user.id },
            });
      
            await prisma.discounts.deleteMany({
              where: { usersId: user.id },
            });
      
            await prisma.referral.deleteMany({
              where: { usersId: user.id },
            });

            await prisma.events.deleteMany({
                where: { usersId: user.id },
              });
      
            await prisma.users.delete({
              where: { id: user.id },
            });
          }

        console.log(`${usersToDelete.length} inactive accounts deleted.`);
    } catch (err) {
      responseError
    }
}

async function cancelOrders() {
  const HALF_HOUR = 5 * 60 * 1000;
  const expiredTime = new Date(Date.now() - HALF_HOUR);

  try {
    // 1️⃣ Cari transaksi yang sudah expired
    const orderToCancel = await prisma.transaction.findMany({
      where: {
        status: "waitingPayment",
        createdAt: { lt: expiredTime },
      },
      select: {
        id: true,
        eventId: true,
        quantity: true, // Pastikan ada field ini di transaksi
      },
    });

    if (orderToCancel.length > 0) {
      // 2️⃣ Batalkan transaksi dengan update status jadi 'cancelled'
      await prisma.transaction.updateMany({
        where: {
          status: "waitingPayment",
          createdAt: { lte: expiredTime },
        },
        data: {
          status: "cancelled",
        },
      });

      // 3️⃣ Update `availableSeat` di tabel event
      for (const order of orderToCancel) {
        await prisma.tickets.update({
          where: { id: order.eventId },
          data: {
            availableSeat: {
              increment: order.quantity, // Kembalikan jumlah tiket yang dipesan
            },
          },
        });
      }
    }

    console.log(`${orderToCancel.length} transaction(s) cancelled and seats restored.`);
  } catch (err) {
    console.log("Error cancelling orders:", err);
  }
}

cron.schedule('0 0 * * *', deleteInactiveAccount);
cron.schedule('*/5 * * * *', cancelOrders);

export default {deleteInactiveAccount, cancelOrders}