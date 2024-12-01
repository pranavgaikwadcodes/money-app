import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { Transactions } from "../../../components/Transactions";

async function getP2P_SentTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            toUserId: Number(session?.user?.id),
        },
        orderBy: { timestamp: "desc" }, // Sort by latest first
    });
    return txns.map((t) => ({
        time: t.timestamp,
        amount: t.amount,
    }));
}

async function getP2P_ReceivedTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id),
        },
        orderBy: { timestamp: "desc" }, // Sort by latest first
    });
    return txns.map((t) => ({
        time: t.timestamp,
        amount: t.amount,
    }));
}

export default async function HomePage() {
    const transactionsSent = await getP2P_SentTransactions();
    const transactionsReceived = await getP2P_ReceivedTransactions();

    return (
        <div className="w-full max-w-5xl mx-auto p-6 space-y-8 flex items-center justify-between">
            <div>
            <SendCard />
            </div>

            <div className="space-y-6 w-[60%]">
                <Transactions
                    transactions={transactionsReceived}
                    name="Transactions Sent"
                />
                <Transactions
                    transactions={transactionsSent}
                    name="Transactions Received"
                />
            </div>
        </div>
    );
}
