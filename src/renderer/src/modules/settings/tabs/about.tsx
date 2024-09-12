import { license, repository } from "@pkg"
import { Logo } from "@renderer/components/icons/logo"
import { Button } from "@renderer/components/ui/button"
import { styledButtonVariant } from "@renderer/components/ui/button/variants"
import { Divider } from "@renderer/components/ui/divider"
import { SocialMediaLinks } from "@renderer/constants/social"
import { getNewIssueUrl } from "@renderer/lib/issues"
import { Trans,useTranslation } from "react-i18next"

import { SettingsTitle } from "../title"

export const SettingAbout = () => {
  const { t } = useTranslation()

  return (
    <div>
      <SettingsTitle />
      <section className="mt-4">
        <div className="flex gap-3">
          <Logo className="size-[52px]" />

          <div className="flex grow flex-col">
            <div className="text-lg font-bold">
              {APP_NAME} {!import.meta.env.PROD ? `(${import.meta.env.MODE})` : ""}
            </div>
            <div>
              <span className="rounded bg-muted px-2 py-1 text-xs">{APP_VERSION}</span>
            </div>
          </div>

          <div className="shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                window.open(`${repository.url}/releases`, "_blank")
              }}
            >
              {t("settings.about.changelog")}
            </Button>
          </div>
        </div>

        <p className="mt-6 text-balance text-sm">
          {t("settings.about.licenseInfo", { appName: APP_NAME, license })}
        </p>
        <p className="mt-3 text-balance text-sm">
          <Trans
            i18nKey="settings.about.iconLibrary"
            components={{
              IconLibraryLink: (
                <a
                  className="follow-link--underline inline-flex items-center"
                  href="https://mgc.mingcute.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://mgc.mingcute.com/
                </a>
              ),
              ExternalLinkIcon: <i className="i-mgc-external-link-cute-re translate-y-px" />,
            }}
           />
        </p>

        <p className="mt-3 text-sm">
          <Trans
            i18nKey="settings.about.feedbackInfo"
            values={{ appName: APP_NAME, commitSha: GIT_COMMIT_SHA.slice(0, 7).toUpperCase() }}
            components={{
              OpenIssueLink: (
                <a
                  className="inline-flex cursor-pointer items-center gap-1 hover:underline"
                  href={getNewIssueUrl()}
                  target="_blank"
                >
                  open an issue
                  <i className="i-mgc-external-link-cute-re" />
                </a>
              ),
              ExternalLinkIcon: <i className="i-mgc-external-link-cute-re" />,
            }}
           />
        </p>

        <Divider className="scale-x-50" />

        <h2 className="text-base font-semibold">{t("settings.about.socialMedia")}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {SocialMediaLinks.map((link) => (
            <span
              key={link.url}
              className={styledButtonVariant({
                variant: "outline",
                className: "flex-1",
              })}
            >
              <a
                href={link.url}
                className="center flex w-full gap-1"
                target="_blank"
                rel="noreferrer"
              >
                <i className={link.icon} />
                {link.label}
              </a>
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
