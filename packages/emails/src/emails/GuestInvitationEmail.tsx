import {
  Mjml,
  MjmlBody,
  MjmlColumn,
  MjmlSection,
  MjmlSpacer,
} from "@faire/mjml-react";
import { render } from "@faire/mjml-react/utils/render";
import { env } from "@typebot.io/env";
import type { SendMailOptions } from "nodemailer";
import type { ComponentProps } from "react";
import * as React from "react";
import { Button } from "../components/Button";
import { Head } from "../components/Head";
import { HeroImage } from "../components/HeroImage";
import { Text } from "../components/Text";
import { sendEmail } from "../sendEmail";

type GuestInvitationEmailProps = {
  workspaceName: string;
  botName: string;
  url: string;
  hostEmail: string;
  guestEmail: string;
};

export const GuestInvitationEmail = ({
  workspaceName,
  botName,
  url,
  hostEmail,
  guestEmail,
}: GuestInvitationEmailProps) => (
  <Mjml>
    <Head />
    <MjmlBody width={600}>
      <MjmlSection padding="0">
        <MjmlColumn>
          <HeroImage src={`${env.NEXTAUTH_URL}/images/invitationBanner.png`} />
        </MjmlColumn>
      </MjmlSection>
      <MjmlSection padding="0 24px" cssClass="smooth">
        <MjmlColumn>
          <Text>
            Você foi convidado pelo e-mal {hostEmail} para participar do desenvolvimento de um bot{" "}
            <strong>{botName}</strong>.
          </Text>
          <Text>
            Navegue pelo bot no seu dashboard: &quot;{workspaceName}&quot; 👍
          </Text>
          <Text>
            Tenha certeza de logar com o e-mail: <i>{guestEmail}</i>.
          </Text>
          <MjmlSpacer height="24px" />
          <Button link={url}>Ver bot</Button>
        </MjmlColumn>
      </MjmlSection>
    </MjmlBody>
  </Mjml>
);

export const sendGuestInvitationEmail = ({
  to,
  ...props
}: Pick<SendMailOptions, "to"> & ComponentProps<typeof GuestInvitationEmail>) =>
  sendEmail({
    to,
    replyTo: props.hostEmail,
    subject: "Você foi convidado para um bot 🤝",
    html: render(<GuestInvitationEmail {...props} />).html,
  });
