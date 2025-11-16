import { NextResponse } from "next/server";
//import { auth } from "../../../../../auth";
import { auth } from "../../../../auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/Empresas/downloadFormulario`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        Accept: "application/json, application/octet-stream",
      },
    }
  );

  if (!apiResponse.ok) {
    return NextResponse.json(
      { error: "Error al descargar el formulario" },
      { status: apiResponse.status }
    );
  }

  const buffer = await apiResponse.arrayBuffer();

  const contentType =
    apiResponse.headers.get("content-type") || "application/octet-stream";
  const contentDisposition =
    apiResponse.headers.get("content-disposition") ||
    'attachment; filename="Formulario.xlsb"';

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    },
  });
}
