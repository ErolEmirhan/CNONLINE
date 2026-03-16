import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getOrderConfirmationHtml(data: {
  customerName: string;
  email: string;
  address: string;
  items: { productName: string; price: number; quantity: number }[];
  totalPrice: number;
}) {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 16px 20px; border-bottom: 1px solid #f0f0f0; color: #1d1d1f; font-size: 15px; line-height: 1.4;">${item.productName}</td>
      <td style="padding: 16px 20px; border-bottom: 1px solid #f0f0f0; color: #6e6e73; font-size: 14px; text-align: center;">${item.quantity}</td>
      <td style="padding: 16px 20px; border-bottom: 1px solid #f0f0f0; color: #1d1d1f; font-size: 15px; font-weight: 500; text-align: right;">₺${item.price.toLocaleString("tr-TR")}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sipariş Onayı - CN Toptan Gıda</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7; color: #1d1d1f;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px 40px; background-color: #ffffff; border-bottom: 1px solid #e8e8ed;">
              <p style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; color: #1d1d1f;">CN Toptan Gıda</p>
              <p style="margin: 6px 0 0 0; font-size: 14px; color: #86868b;">Sipariş Onayı</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; letter-spacing: -0.3px; color: #1d1d1f;">Sayın ${data.customerName},</p>
              <p style="margin: 0 0 32px 0; font-size: 16px; color: #6e6e73; line-height: 1.5;">Siparişiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.</p>
              
              <!-- Address Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e8e8ed; border-radius: 12px; overflow: hidden; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 20px 24px; background-color: #fafafa;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; color: #86868b; letter-spacing: 0.5px;">TESLİMAT ADRESİ</p>
                    <p style="margin: 0; font-size: 15px; color: #1d1d1f; line-height: 1.5;">${data.address}</p>
                  </td>
                </tr>
              </table>

              <!-- Order Items -->
              <p style="margin: 0 0 16px 0; font-size: 11px; font-weight: 600; color: #86868b; letter-spacing: 0.5px;">SİPARİŞ DETAYI</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e8e8ed; border-radius: 12px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #fafafa;">
                    <th style="padding: 14px 20px; text-align: left; font-size: 11px; font-weight: 600; color: #86868b; letter-spacing: 0.5px;">Ürün</th>
                    <th style="padding: 14px 20px; text-align: center; font-size: 11px; font-weight: 600; color: #86868b; letter-spacing: 0.5px;">Adet</th>
                    <th style="padding: 14px 20px; text-align: right; font-size: 11px; font-weight: 600; color: #86868b; letter-spacing: 0.5px;">Fiyat</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 24px 0 0 0; text-align: right;">
                    <p style="margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.3px; color: #1d1d1f;">Toplam: ₺${data.totalPrice.toLocaleString("tr-TR")}</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 32px 0 0 0; font-size: 15px; color: #6e6e73; line-height: 1.5;">Teşekkür ederiz.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #e8e8ed;">
              <p style="margin: 0; font-size: 12px; color: #a1a1a6; text-align: center;">© ${new Date().getFullYear()} CN Toptan Gıda</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "E-posta servisi yapılandırılmamış. RESEND_API_KEY ekleyin." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const { customerName, email, address, items, totalPrice } = body;

    if (!customerName || !email || !address || !items || !totalPrice) {
      return NextResponse.json(
        { error: "Eksik sipariş bilgisi" },
        { status: 400 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
      from: `CN Toptan Gıda <${fromEmail}>`,
      to: [email],
      subject: `Sipariş Onayı - ${customerName}`,
      html: getOrderConfirmationHtml({
        customerName,
        email,
        address,
        items: items.map((i: { productName: string; price: number; quantity: number }) => ({
          productName: i.productName,
          price: i.price,
          quantity: i.quantity,
        })),
        totalPrice,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "E-posta gönderilemedi" },
      { status: 500 }
    );
  }
}
