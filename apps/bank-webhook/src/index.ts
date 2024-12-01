import express from "express";
import db from "@repo/db/client";
import { z } from 'zod';

const app = express();

app.use(express.json())

const paymentInformationSchema = z.object({
    token: z.string().min(1),
    amount: z.number().min(1),
    userId: z.number().min(1),
})

app.post("/hdfcWebhook", async (req: any, res: any) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    
    try {
        const paymentInformation = paymentInformationSchema.parse({
            token: req.body.token,
            userId: req.body.user_identifier,
            amount: req.body.amount,
        });

        const status = await db.onRampTransaction.findFirst({
            where: {
                userId: paymentInformation.userId,
                amount: paymentInformation.amount,
                token: paymentInformation.token,
            },
            select: { status: true },
        });
        
        if (status?.status !== "Processing") {
            return res.status(400).json({ message: "Transaction not in Processing state" });
        }

        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch (e) {
        console.error("Error while processing HDFC webhook:", {
            error: e,
            body: req.body,
        });
    
        res.status(500).json({
            message: "Error while processing webhook",
            error: e instanceof Error ? e.message : e,
        });
    }

})

app.listen(3003);