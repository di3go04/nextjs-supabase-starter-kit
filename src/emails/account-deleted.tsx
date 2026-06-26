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

export function AccountDeletedEmail({
  name,
  reactivateUrl = "https://your-app.com/register",
}: {
  name?: string;
  reactivateUrl?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Tu cuenta fue eliminada</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-0 max-w-xl rounded-lg border border-solid border-gray-200 bg-white p-6">
            <Heading className="mb-4 text-2xl font-bold">
              Tu cuenta fue eliminada 👋
            </Heading>
            <Text className="mb-4 text-sm leading-6">
              Hola{name ? `, ${name}` : ""}: confirmamos que tu cuenta fue
              eliminada correctamente. Tus datos personales fueron borrados de
              nuestros sistemas según nuestra política de retención.
            </Text>
            <Hr className="my-4 border-gray-200" />
            <Text className="text-xs text-gray-500">
              ¿Cambio de opinión? Puedes crear una cuenta nueva en{" "}
              <a href={reactivateUrl} className="text-emerald-700 underline">
                {reactivateUrl}
              </a>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default AccountDeletedEmail;
