import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

export function InvoiceReceiptEmail({
  name,
  amount,
  currency = "USD",
  invoiceUrl,
  period,
}: {
  name?: string;
  amount: number;
  currency?: string;
  invoiceUrl?: string;
  period?: string;
}) {
  const formatted = new Intl.NumberFormat("es", {
    style: "currency",
    currency,
  }).format(amount / 100);

  return (
    <Html>
      <Head />
      <Preview>Recibo de pago · {formatted}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-0 max-w-xl rounded-lg border border-solid border-gray-200 bg-white p-6">
            <Heading className="mb-4 text-2xl font-bold">Recibo de pago 📄</Heading>
            <Text className="mb-4 text-sm leading-6">
              Hola{name ? `, ${name}` : ""}: confirmamos el cobro de tu suscripción.
            </Text>
            <Hr className="my-4 border-gray-200" />
            <Text className="text-sm">
              <strong>Monto:</strong> {formatted}
              {period && (
                <>
                  <br />
                  <strong>Período:</strong> {period}
                </>
              )}
            </Text>
            {invoiceUrl && (
              <Text className="mt-4 text-xs">
                <a
                  href={invoiceUrl}
                  className="text-emerald-700 underline"
                >
                  Ver factura completa en Stripe
                </a>
              </Text>
            )}
            <Hr className="my-4 border-gray-200" />
            <Text className="text-xs text-gray-500">
              Gracias por tu confianza. Este recibo se generó automáticamente.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default InvoiceReceiptEmail;
