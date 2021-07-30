declare module "react-netlify-identity-gotrue" {
  /* eslint-disable one-var */
  import { User as GoTrueUser, UserData } from "gotrue-js";

  export const useIdentityContext: () => {
    user: User | undefined;
    login: ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => Promise<undefined>;
    logout: () => Promise<User | undefined>;
    update: ({
      email,
      password,
      user_metadata,
    }: {
      email: string;
      password: string;
      user_metadata: User["user_metadata"];
    }) => Promise<User | undefined>;
    signup: ({
      email,
      password,
      user_metadata,
    }: {
      email: string;
      password: string;
      user_metadata: User["user_metadata"];
    }) => Promise<User | undefined>;
    urlToken?: {
      type: "confirmation" | "invite" | "email_change" | "passwordRecovery";
    };
    refreshUser: () => void;
    authorizedFetch: (
      url: String,
      options: Record<string, string>
    ) => Promise<Response>;
    provisionalUser?: UserData;
    pendingEmailUpdate?: string;
    sendPasswordRecovery?: ({ email }: { email: string }) => Promise<undefined>;
    completeUrlTokenTwoStep: ({
      password,
      user_metadata,
    }: {
      password: string;
      user_metadata: User["user_metadata"];
    }) => Promise<User | undefined>;
  };

  export type User = GoTrueUser;

  const NetlifyIdentityContext = ({
    url,
    children,
  }: {
    url: string;
    children: ReactNode;
  }) => children;

  export default NetlifyIdentityContext;
}
