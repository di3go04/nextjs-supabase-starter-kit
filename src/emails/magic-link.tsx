import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export function MagicLinkEmail({
  email,
  url,
  expiresIn = "10 minutos",
}: {
  email: string;
  url: string;
  expiresIn?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Tu link mágico para entrar</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-0 max-w-xl rounded-lg border border-solid border-gray-200 bg-white p-6">
            <Heading className="mb-4 text-2xl font-bold">Tu link mágico ✨</Heading>
            <Text className="mb-4 text-sm leading-6">
              Hiciste clic para entrar con <strong>{email}</strong>. El link
              expira en {expiresIn}.
            </Text>
            <Section className="mb-6 text-center">
              <Button
                className="rounded bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white"
                href={url}
              >
                Entrar a mi cuenta
              </Button>
            </Section>
            <Text className="text-xs text-gray-500">
              Si no pediste este link, puedes ignorar este correo.{" "}
              <Link href="https://starter-kit-di3go04.vercel.app" className="text-gray-700 underline">
                starter-kit-di3go04.vercel.app
              </Link>
            </Text>
            <Hr className="my-4 border-gray-200" />
            <Text className="text-xs text-gray-500">
              O copia y pega esta URL en tu navegador:
            </Text>
            <Text className="break-all text-xs text-gray-700">{url}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default MagicLinkEmail;
