import { getAdminDashboardData } from "../../../../../../data/adminDashboard";

export async function GET(
  _request: Request,
  context: { params: Promise<{ companyId: string }> },
) {
  const { companyId: rawCompanyId } = await context.params;
  const companyId = Number(rawCompanyId);

  if (!Number.isSafeInteger(companyId) || companyId <= 0) {
    return Response.json(
      { error: "company_idには正の整数を指定してください。" },
      { status: 400 },
    );
  }

  const data = getAdminDashboardData(companyId);

  if (data.company.companyId !== companyId) {
    return Response.json(
      { error: `company_id: ${companyId} の企業は見つかりません。` },
      { status: 404 },
    );
  }

  return Response.json(data, {
    headers: {
      "Cache-Control": "private, max-age=300",
    },
  });
}
