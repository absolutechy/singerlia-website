import { useEffect, useId, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useLanguage } from "@/i18n/LanguageContext";

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
  const id = useId();
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
  const selectClass = "w-full min-w-0 h-12 rounded-lg border border-gray-300 bg-white px-3 text-start text-gray-900 disabled:opacity-60";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full" dir={dir}>
      <div className="min-w-0">
        <label htmlFor={id + "-province"} className="block text-sm text-start mb-2">{t("common.province")}</label>
        <select id={id + "-province"} required className={selectClass}
          disabled={disabled || loading || failed} value={value.regionId}
          onChange={(event) => onChange({ regionId: event.target.value, cityId: "", city: "", province: data.regions.find((region) => region.id === event.target.value)?.name || "" })}>
          <option value="">{loading ? t("common.loading") : t("common.selectProvince")}</option>
          {data.regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
        </select>
      </div>
      <div className="min-w-0">
        <label htmlFor={id + "-city"} className="block text-sm text-start mb-2">{t("common.city")}</label>
        <select id={id + "-city"} required className={selectClass}
          disabled={disabled || loading || failed || !value.regionId} value={value.cityId}
          onChange={(event) => onChange({ ...value, cityId: event.target.value, city: cities.find((city) => city.id === event.target.value)?.name || "" })}>
          <option value="">{!value.regionId && legacyCity ? legacyCity : t("common.selectCity")}</option>
          {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
        </select>
      </div>
      {failed && <div role="alert" className="sm:col-span-2 text-red-600 text-sm text-start">
        {t("common.locationsError")}
        <button type="button" className="ms-2 underline" onClick={() => setAttempt((count) => count + 1)}>{t("common.retry")}</button>
      </div>}
    </div>
  );
}

