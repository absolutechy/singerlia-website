import React, { useState } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import SelectableCard from "@/components/auth/SelectableCard";
import { Button } from "@/components/common";
import IAMSingerImage from "@/assets/images/common/iamanartist.png";
import IAMCustomerImage from "@/assets/images/common/iamcustomer.png";
import { useLanguage } from "@/i18n/LanguageContext";

type RoleOption = "artist" | "customer";

const roleOptions = [
  {
    id: "artist" as RoleOption,
    titleKey: "auth.artistRole",
    icon: <img src={IAMSingerImage} alt="Artist" className="w-40 h-28 object-cover" />,
  },
  {
    id: "customer" as RoleOption,
    titleKey: "auth.customerRole",
    icon: <img src={IAMCustomerImage} alt="Customer" className="w-36 h-28 object-cover" />,
  },
];

const ChooseRole: React.FC = () => {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const navigate = useNavigate();

  return (
    <AuthModalLayout size="lg" title={t("auth.chooseRole")}>
      <div className="space-y-10">
        <LogoBadge size="md" />
        <div className="flex items-center justify-center gap-6 md:gap-12">
          {roleOptions.map((option) => (
            <SelectableCard
              key={option.id}
              title={t(option.titleKey as any)}
              icon={option.icon}
              selected={selectedRole === option.id}
              onClick={() => {
                setSelectedRole(option.id);
              }}
            />
          ))}
        </div>
        <Button
          variant="secondary"
          size="large"
          className="mx-auto w-full max-w-sm rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
          disabled={!selectedRole}
          onClick={() => {
            if (!selectedRole) return;
            navigate(
              selectedRole === "artist" ? "/auth/singer-signup" : "/auth/signup"
            );
          }}
        >
          <span className="font-semibold">
            {t("auth.continue")}
          </span>
        </Button>
      </div>
    </AuthModalLayout>
  );
};

export default ChooseRole;
