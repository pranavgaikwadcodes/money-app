import { Card } from "@repo/ui/card";

export const Transactions = ({
    transactions,
    name,
}: {
    transactions: {
        time: Date;
        amount: number;
        user: any;
    }[];
    name: string;
}) => {
    if (!transactions.length) {
        return (
            <Card title={name}>
                <div className="text-center py-8 text-gray-500">
                    No recent transactions.
                </div>
            </Card>
        );
    }

    return (
        <Card title={name}>
            <div className="space-y-4">
                {transactions.map((t, index) => (
                    <div
                        key={index}
                        className="p-4 mt-1 bg-gray-100 rounded-lg flex justify-between items-center"
                    >
                        <div>
                            <div className="text-sm font-medium text-gray-700">
                                {name === "Transactions Sent"
                                    ? `Sent to User : ${t.user}`
                                    : `Received from User : ${t.user}`}
                            </div>
                            <div className="text-xs text-gray-500">
                                {new Date(t.time).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </div>
                        </div>
                        <div
                            className={`text-lg font-semibold ${
                                name === "Transactions Sent" ? "text-red-500" : "text-green-500"
                            }`}
                        >
                            ₹{(t.amount / 100).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
