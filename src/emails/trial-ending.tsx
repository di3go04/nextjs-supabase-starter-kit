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

export function TrialEndingEmail({
  name,
  daysLeft = 3,
  upgradeUrl = "https://YOUR-APP.com/dashboard/billing",
}: {
  name?: string;
  daysLeft?: number;
  upgradeUrl?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Tu trial termina en {String(daysLeft)} días</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-0 max-w-xl rounded-lg border border-solid border-gray-200 bg-white p-6">
            <Heading className="mb-4 text-2xl font-bold">
              ⏰ Tu trial termina en {String(daysLeft)} días
            </Heading>
            <Text className="mb-4 text-sm leading-6">
              Hola{name ? `, ${name}` : ""}: tu período de prueba del plan Pro
              termina en {daysLeft} días. Para mantener acceso a todas las
              funcionalidades, haz upgrade ahora.
            </Text>
            <Section className="mb-6 text-center">
              <Button
                className="rounded bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white"
                href={upgradeUrl}
              >
                Upgrade a Pro
              </Button>
            </Section>
            <Hr className="my-4 border-gray-200" />
            <Text className="text-xs text-gray-500">
              ¿No quieres continuar? Tu cuenta volverá automáticamente al plan Free.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default TrialEndingEmail;
