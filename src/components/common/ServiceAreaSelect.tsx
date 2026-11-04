import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { useLanguage } from "@/i18n/LanguageContext";

export interface ServiceAreaValue {
  availableAcrossKsa: boolean;
  serviceCityIds: string[];
}

type City = { id: string; name: string; regionId: string };

interface Props {
  value: ServiceAreaValue;
  onChange: (value: ServiceAreaValue) => void;
  disabled?: boolean;
  error?: string;
}

// The dataset spells cities with transliteration marks ("‘Abāssah"); fold those away so typing
// "abassah" or "riyadh" still finds them.
const fold = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[‘’'`ʿʾ]/g, "")
    .toLowerCase()
    .trim();

const MAX_RESULTS = 30;

// Saudi Arabia is the only market, so singers pick the cities they perform in (or the whole
// Kingdom) instead of a country/province/city chain. Province is derived from each city server-side.
export default function ServiceAreaSelect({ value, onChange, disabled = false, error }: Props) {
  const { t, dir } = useLanguage();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    axiosInstance
      .get<{ cities: City[] }>("/locations")
      .then((response) => {
        if (active) setCities(response.data.cities || []);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const indexedCities = useMemo(() => cities.map((city) => ({ ...city, key: fold(city.name) })), [cities]);

  const matches = useMemo(() => {
    const needle = fold(query);
    if (!needle) return [];
    const selected = new Set(value.serviceCityIds);
    const startsWith: City[] = [];
    const contains: City[] = [];
    for (const city of indexedCities) {
      if (selected.has(city.id)) continue;
      if (city.key.startsWith(needle)) startsWith.push(city);
      else if (city.key.includes(needle)) contains.push(city);
      if (startsWith.length >= MAX_RESULTS) break;
    }
    return [...startsWith, ...contains].slice(0, MAX_RESULTS);
  }, [indexedCities, query, value.serviceCityIds]);

  const cityName = (id: string) => cities.find((city) => city.id === id)?.name || id;

  const addCity = (city: City) => {
    onChange({ ...value, serviceCityIds: [...value.serviceCityIds, city.id] });
    setQuery("");
  };

  const removeCity = (id: string) =>
    onChange({ ...value, serviceCityIds: value.serviceCityIds.filter((cityId) => cityId !== id) });

  return (
    <div className="w-full text-start" dir={dir}>
      <p className="text-sm font-medium text-[#2E1B4D] mb-1">
        {t("serviceArea.label")} <span className="text-red-500">*</span>
      </p>
      <p className="text-xs text-[#6F5D9E] mb-3">{t("serviceArea.help")}</p>

      <label className="flex items-start gap-3 rounded-lg border border-[#D4D7E3] bg-[#F7FBFF] px-3 py-2.5 cursor-pointer mb-3">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4"
          checked={value.availableAcrossKsa}
          disabled={disabled}
          onChange={(event) => onChange({ ...value, availableAcrossKsa: event.target.checked })}
        />
        <span>
          <span className="block text-sm font-semibold text-[#2E1B4D]">{t("serviceArea.nationwide")}</span>
          <span className="block text-xs text-[#6F5D9E]">{t("serviceArea.nationwideHelp")}</span>
        </span>
      </label>

      {!value.availableAcrossKsa && (
        <>
          {value.serviceCityIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {value.serviceCityIds.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {cityName(id)}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeCity(id)}
                    aria-label={t("serviceArea.removeCity", { city: cityName(id) })}
                    className="rounded-full hover:bg-primary/20 p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-[#6F5D9E]" />
            <input
              type="text"
              value={query}
              disabled={disabled || loading || failed}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && matches[0]) {
                  event.preventDefault();
                  addCity(matches[0]);
                }
              }}
              placeholder={loading ? t("common.loading") : t("serviceArea.search")}
              className={`w-full rounded-lg border bg-[#F7FBFF] py-3 ps-9 pe-3 text-sm outline-none focus:border-primary ${
                error ? "border-red-400" : "border-[#D4D7E3]"
              }`}
            />
            {query.trim() && (
              <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#D4D7E3] bg-white shadow-lg">
                {matches.length > 0 ? (
                  matches.map((city) => (
                    <li key={city.id}>
                      <button
                        type="button"
                        onClick={() => addCity(city)}
                        className="w-full px-3 py-2 text-start text-sm hover:bg-[#F7F4FF]"
                      >
                        {city.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-[#6F5D9E]">{t("serviceArea.noResults")}</li>
                )}
              </ul>
            )}
          </div>
        </>
      )}

      {failed && (
        <div role="alert" className="mt-2 text-sm text-red-600">
          {t("common.locationsError")}
          <button type="button" className="ms-2 underline" onClick={() => setAttempt((count) => count + 1)}>
            {t("common.retry")}
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
