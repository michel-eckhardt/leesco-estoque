import { WithdrawalsTable } from "@/components/tables/withdrawals-table";
import { getWithdrawals } from "@/actions/withdrawals";

export default async function DashboardPage() {
  const withdrawals = await getWithdrawals(undefined, 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Histórico de retiradas de produtos
        </p>
      </div>

      <WithdrawalsTable withdrawals={withdrawals} />
    </div>
  );
}
