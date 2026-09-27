import { Button } from "@/components/common";
import { useLanguage } from "@/i18n/LanguageContext";
import React from "react";

const Welcome: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-primary text-white">
      <div className="custom-container py-10 lg:py-28 px-10 lg:px-24 flex flex-col lg:flex-row justify-between">
        <div className="w-fit space-y-6">
          <h1 className="font-bold text-4xl lg:text-7xl leading-none max-w-xl">
            {t("home.welcomeTitle")}
          </h1>
          <p className="text-lg">{t("home.welcomeSubtitle")}</p>
          <p className="text-lg max-w-md">
            {t("home.welcomeBody")}
          </p>
          <Button
            variant="primary"
            size="large"
            className="flex items-center gap-2 col-span-2 mb-5 lg:mb-0"
          >
            <p className="font-medium">{t("home.listYourSpace")}</p>
          </Button>
        </div>
        <div className="bg-white text-black rounded-2xl max-w-md p-5">
          <div className="w-full h-64 rounded-xl bg-primary" />
          <p className="font-semibold text-2xl my-10 max-w-sm">
            “{t("home.welcomeQuote")}”
          </p>
          <p className="font-semibold">{t("home.welcomePerson")}</p>
          <p>{t("home.welcomeRole")}</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
