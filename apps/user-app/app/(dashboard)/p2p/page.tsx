import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { SendCard } from "../../../components/SendCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { Transactions } from "../../../components/Transactions";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id),
        },
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0,
    };
}

async function getP2PTransactions() {
    const session = await getServerSession(authOptions);

    const sentTransactions = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id),
        },
        include: {
            toUser: true, // Include the related user
        },
        orderBy: { timestamp: "desc" },
    });

    const receivedTransactions = await prisma.p2pTransfer.findMany({
        where: {
            toUserId: Number(session?.user?.id),
        },
        include: {
            fromUser: true, // Include the related user
        },
        orderBy: { timestamp: "desc" },
    });

    return {
        sent: sentTransactions.map((t) => ({
            time: t.timestamp,
            amount: t.amount,
            user: t.toUser.number, // Use the `number` of the recipient
        })),
        received: receivedTransactions.map((t) => ({
            time: t.timestamp,
            amount: t.amount,
            user: t.fromUser.number, // Use the `number` of the sender
        })),
    };
}

export default async function P2PPage() {
    const balance = await getBalance();
    const { sent, received } = await getP2PTransactions();

    return (
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Peer-to-Peer Transfers
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                {/* Left Section */}
                <div>
                    <SendCard />
                </div>

                {/* Right Section */}
                <div>
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                    <div className="pt-4">
                        <Transactions transactions={sent} name="Transactions Sent"/>
                    </div>
                    <div className="pt-4">
                        <Transactions transactions={received} name="Transactions Received" />
                    </div>
                </div>
            </div>
        </div>
    );
}
