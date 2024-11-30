import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("Creating Alice...");
    const alice = await prisma.user.upsert({
        where: { number: '9999999999' },
        update: {},
        create: {
            number: '9999999999',
            password: await bcrypt.hash('alice', 10),
            name: 'alicee',
            OnRampTransaction: {
                create: {
                    startTime: new Date(),
                    status: "Success",
                    amount: 20000,
                    token: "122",
                    provider: "HDFC Bank",
                },
            },
        },
    })
    console.log("Alice created:", alice);

    console.log("Creating Bob...");
    const bob = await prisma.user.upsert({
        where: { number: '9999999998' },
        update: {},
        create: {
            number: '9999999998',
            password: await bcrypt.hash('bob', 10),
            name: 'bob',
            OnRampTransaction: {
                create: {
                    startTime: new Date(),
                    status: "Failure",
                    amount: 2000,
                    token: "123",
                    provider: "HDFC Bank",
                },
            },
        },
    })
    console.log("Bob created:", bob);
    console.log({ alice, bob })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })