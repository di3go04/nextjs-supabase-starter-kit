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
import * as React from "react";

export function WelcomeEmail({
  name,
  loginUrl = "https://starter-kit-di3go04.vercel.app/login",
}: {
  name?: string;
  loginUrl?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>¡Bienvenido al Starter Kit!</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-0 max-w-xl rounded-lg border border-solid border-gray-200 bg-white p-6">
            <Heading className="mb-4 text-2xl font-bold">
              ¡Bienvenido{name ? `, ${name}` : ""}! 👋
            </Heading>
            <Text className="mb-4 text-sm leading-6">
              Tu cuenta ha sido creada correctamente. Ya puedes entrar a tu
              dashboard con Magic Link o con tu proveedor OAuth favorito
              (Google o GitHub).
            </Text>
            <Section className="mb-6 text-center">
              <Button
                className="rounded bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white"
                href={loginUrl}
              >
                Iniciar sesión
              </Button>
            </Section>
            <Hr className="my-4 border-gray-200" />
            <Text className="text-xs text-gray-500">
              Si no creaste esta cuenta, puedes ignorar este correo.{" "}
              <Link href="https://starter-kit-di3go04.vercel.app" className="text-gray-700 underline">
                starter-kit-di3go04.vercel.app
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default WelcomeEmail;
