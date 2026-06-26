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

export function PasswordResetEmail({
  email,
  resetUrl,
  expiresIn = "1 hora",
}: {
  email: string;
  resetUrl: string;
  expiresIn?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Restablece tu contraseña</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-0 max-w-xl rounded-lg border border-solid border-gray-200 bg-white p-6">
            <Heading className="mb-4 text-2xl font-bold">Restablecer contraseña</Heading>
            <Text className="mb-4 text-sm leading-6">
              Recibimos una solicitud para restablecer la contraseña de{" "}
              <strong>{email}</strong>. El link expira en {expiresIn}.
            </Text>
            <Section className="mb-6 text-center">
              <Button
                className="rounded bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white"
                href={resetUrl}
              >
                Restablecer contraseña
              </Button>
            </Section>
            <Hr className="my-4 border-gray-200" />
            <Text className="text-xs text-gray-500">
              Si no pediste este cambio, ignora este correo. Tu cuenta está segura.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default PasswordResetEmail;
