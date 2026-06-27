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
import * as React from "react";

export function SubscriptionSuccessEmail({
  name,
  plan,
  dashboardUrl = "https://YOUR-APP.com/dashboard",
}: {
  name?: string;
  plan: string;
  dashboardUrl?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>¡Tu suscripción {plan} está activa!</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-0 max-w-xl rounded-lg border border-solid border-gray-200 bg-white p-6">
            <Heading className="mb-4 text-2xl font-bold">
              ¡Pago confirmado! 🎉
            </Heading>
            <Text className="mb-4 text-sm leading-6">
              Hola{name ? `, ${name}` : ""}: tu suscripción al plan{" "}
              <strong className="capitalize">{plan}</strong> está activa.
              Ya tienes acceso a todas las funcionalidades premium.
            </Text>
            <Section className="mb-6 text-center">
              <Button
                className="rounded bg-amber-600 px-6 py-3 text-center text-sm font-semibold text-white"
                href={dashboardUrl}
              >
                Ir al dashboard
              </Button>
            </Section>
            <Hr className="my-4 border-gray-200" />
            <Text className="text-xs text-gray-500">
              Si tienes alguna pregunta, responde a este correo.{" "}
              Puedes gestionar tu suscripción desde el panel de billing.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default SubscriptionSuccessEmail;
