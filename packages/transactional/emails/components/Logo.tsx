import { Img } from "@react-email/components";
import { env } from "@typebot.io/env";

export const Logo = () => (
  <Img
    src={`${env.NEXTAUTH_URL}/images/logo.png`}
    width="90"
    alt="OneHelp Logo"
    style={{
      margin: "24px 0",
      borderRadius: "3px",
    }}
  />
);
