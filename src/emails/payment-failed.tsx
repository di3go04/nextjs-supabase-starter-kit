import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export function PaymentFailedEmail({
  name,
  updateUrl = "https://YOUR-APP.com/dashboard/billing",
  attempt = 1,
  maxAttempts = 3,
}: {
  name?: string;
  updateUrl?: string;
  attempt?: number;
  maxAttempts?: number;
}) {
  const isLast = attempt >= maxAttempts;
  return (
    <Html>
      <Head />
      <Preview>
        {isLast ? "Último intento: actualiza tu método de pago" : "Tu pago falló"}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-0 max-w-xl rounded-lg border border-solid border-gray-200 bg-white p-6">
            <Heading className="mb-4 text-2xl font-bold">
              {isLast ? "⚠️ Último intento de cobro" : "Tu pago falló"}
            </Heading>
            <Text className="mb-4 text-sm leading-6">
              Hola{name ? `, ${name}` : ""}: no pudimos cobrar tu suscripción
              (intento {attempt} de {maxAttempts}).
            </Text>
            <Text className="mb-4 text-sm leading-6">
              {isLast
                ? "Si no actualizas tu método de pago en las próximas 24 horas, tu suscripción se cancelará."
                : "Intentaremos nuevamente en 24 horas. Mientras, actualiza tu tarjeta para evitar interrupciones."}
            </Text>
            <Section className="mb-6 text-center">
              <Button
                className="rounded bg-amber-600 px-6 py-3 text-center text-sm font-semibold text-white"
                href={updateUrl}
              >
                Actualizar método de pago
              </Button>
            </Section>
            <Hr className="my-4 border-gray-200" />
            <Text className="text-xs text-gray-500">
              Si crees que fue un error, contáctanos respondiendo a este correo.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default PaymentFailedEmail;
