import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">

        <div className="pt-2">
            {transactions.map(t => <div className={`${(t.status === 'Success' ? 'bg-green-100' : ( (t.status === 'Failure') ? 'bg-red-100' : 'bg-yellow-100'))} flex justify-between mt-1 p-2` }>
                
                    <div>
                        <div className="text-sm">
                            Received INR - {t.status}
                        </div>
                        <div className="text-slate-600 text-xs">
                            {t.time.toDateString()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        + Rs {t.amount / 100}
                    </div>


            </div>)}
        </div>
    </Card>
}