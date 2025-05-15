import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";
import type { SendMailOptions } from "nodemailer";
import type { ComponentProps } from "react";
import { sendEmail } from "../helpers/sendEmail";
import { Logo } from "./components/Logo";
import {
  codeStyle,
  container,
  footerText,
  heading,
  hr,
  main,
  paragraph,
} from "./styles";

interface Props {
  url: string;
  code: string;
}

export const LoginCodeEmail = ({ url, code }: Props) => (
  <Html>
    <Head />
    <Preview>Seu código de login para OneHelp</Preview>
    <Body style={main}>
      <Container style={container}>
        <Logo />
        <Heading style={heading}>Seu código de login para OneHelp</Heading>
        <code style={codeStyle}>{code}</code>
        <Text style={paragraph}>
          Este código é válido por 5 minutos. Se você não solicitou este código,
          não se preocupe, ele não pode ser usado por ninguém além de você.
        </Text>
        <Text style={paragraph}>
          Você também pode se logar <Link href={url}>clicando aqui</Link>.
        </Text>
        <Hr style={hr} />
        <Text style={footerText}>Bots da OneHelp</Text>
      </Container>
    </Body>
  </Html>
);

LoginCodeEmail.PreviewProps = {
  url: "https://typebot.io",
  code: "654778",
} as Props;

export default LoginCodeEmail;

export const sendLoginCodeEmail = async ({
  to,
  ...props
}: Pick<SendMailOptions, "to"> & ComponentProps<typeof LoginCodeEmail>) =>
  sendEmail({
    to,
    subject: "Seu código de login para OneHelp",
    html: await render(<LoginCodeEmail {...props} />),
  });
