import Link from "next/link";
import { listCompanyNames } from "@/lib/companyRepository";

export const dynamic = "force-dynamic";

export default async function CompanyNamesPage() {
  const { dbConnected, companies } = await listCompanyNames(100);

  return (
    <main className="mx-auto w-full max-w-[960px] px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#182b45]">
          企業名一覧（company_name）
        </h1>
        <Link
          href="/"
          className="rounded border border-[#0066cc] px-4 py-2 text-sm font-bold text-[#0066cc] hover:bg-sky-50"
        >
          トップへ戻る
        </Link>
      </div>

      <div className="mb-4 rounded border border-gray-200 bg-gray-50 p-3 text-sm">
        DB接続状態: {dbConnected ? "接続中" : "未接続（表示は空になります）"}
      </div>

      <div className="overflow-hidden rounded border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-[#eef4f9] text-left text-[#182b45]">
            <tr>
              <th className="px-4 py-3 font-bold">company_id</th>
              <th className="px-4 py-3 font-bold">company_name</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.company_id} className="border-t border-gray-100">
                <td className="px-4 py-2 text-gray-600">{company.company_id}</td>
                <td className="px-4 py-2">{company.company_name}</td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={2}>
                  企業データを取得できませんでした。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
