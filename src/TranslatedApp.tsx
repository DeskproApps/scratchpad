import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import locale_en_GB from "../translations/en-GB.json";
import locale_es_ES from "../translations/es-ES.json";

const locales = {
  'en-GB': locale_en_GB,
  'es-ES': locale_es_ES,
} as const;

export default function TranslatedApp(props: { children: ReactNode }) {
  const { context } = useDeskproLatestAppContext();
  const locale = context?.data?.app?.locale ?? 'en-GB';
  const messages = locales[locale as keyof typeof locales];

  return <IntlProvider messages={messages} locale={locale}>
    <>{props.children}</>
  </IntlProvider>
}