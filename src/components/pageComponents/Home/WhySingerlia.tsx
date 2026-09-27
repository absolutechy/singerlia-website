import { Button } from "@/components/common";
import React from "react";
import logo from "@/assets/images/common/grid.png";
import { useLanguage } from "@/i18n/LanguageContext";

const WhySingerlia: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <div className="custom-container pt-14 lg:pt-28 px-24 flex flex-col lg:flex-row justify-between">
        <div className="w-fit space-y-6">
          <h1 className="font-bold text-4xl lg:text-7xl">{t("home.whyTitle")}</h1>
          <p className="text-lg text-[#B8860B]">
            {t("home.whySubtitle")}
          </p>
          <p className="text-lg max-w-xl">
            {t("home.whyBody")}
          </p>
          <Button
            variant="primary"
            size="large"
            className="flex items-center gap-2 col-span-2 mb-10 lg:mb-0"
          >
            <p className="font-medium">{t("home.getStarted")}</p>
          </Button>
        </div>
        <img
          src={logo}
          alt={t("home.whyTitle")}
          className="w-full max-w-xl object-contain object-center"
        />
      </div>
    </div>
  );
};

export default WhySingerlia;
