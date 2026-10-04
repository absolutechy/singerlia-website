import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useLanguage } from "@/i18n/LanguageContext";
import Select from "./Select";

export interface LocationSelection {
  regionId: string;
  cityId: string;
  city?: string;
  province?: string;
}

interface Locations {
  regions: { id: string; name: string }[];
  cities: { id: string; name: string; regionId: string }[];
}

interface Props {
  value: LocationSelection;
  onChange: (value: LocationSelection) => void;
  disabled?: boolean;
  legacyCity?: string;
}

export default function LocationFields({ value, onChange, disabled = false, legacyCity }: Props) {
  const { t, dir } = useLanguage();
  const [data, setData] = useState<Locations>({ regions: [], cities: [] });
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    axiosInstance.get<Locations>("/locations").then((response) => {
      if (active) setData(response.data);
    }).catch(() => {
      if (active) setFailed(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [attempt]);

  const cities = data.cities.filter((city) => city.regionId === value.regionId);
  const provincePlaceholder = loading ? t("common.loading") : t("common.selectProvince");
  const cityPlaceholder = !value.regionId && legacyCity ? legacyCity : t("common.selectCity");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full" dir={dir}>
      <Select
        label={t("common.province")}
        placeholder={provincePlaceholder}
        value={value.regionId}
        disabled={disabled || loading || failed}
        options={data.regions.map((region) => ({ value: region.id, label: region.name }))}
        onChange={(regionId) => onChange({
          regionId,
          cityId: "",
          city: "",
          province: data.regions.find((region) => region.id === regionId)?.name || "",
        })}
      />
      <Select
        label={t("common.city")}
        placeholder={cityPlaceholder}
        value={value.cityId}
        disabled={disabled || loading || failed || !value.regionId}
        options={cities.map((city) => ({ value: city.id, label: city.name }))}
        onChange={(cityId) => onChange({
          ...value,
          cityId,
          city: cities.find((city) => city.id === cityId)?.name || "",
        })}
      />
      {failed && <div role="alert" className="sm:col-span-2 text-red-600 text-sm text-start">
        {t("common.locationsError")}
        <button type="button" className="ms-2 underline" onClick={() => setAttempt((count) => count + 1)}>{t("common.retry")}</button>
      </div>}
    </div>
  );
}

