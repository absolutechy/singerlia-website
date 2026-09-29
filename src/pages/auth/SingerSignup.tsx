import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button, Input, Select } from "@/components/common";
import authService from "@/api/services/authService";
import genreService, { type Genre } from "@/api/services/genreService";
import { SAUDI_CITIES } from "@/constants/cities";
import { useLanguage, type TranslationKey } from "@/i18n/LanguageContext";

const genderOptions = [
  { value: "male", labelKey: "auth.gender.male" },
  { value: "female", labelKey: "auth.gender.female" },
  { value: "other", labelKey: "auth.gender.other" },
];

const selects = [
    { id: "gender", labelKey: "auth.gender", type: "gender" },
    { id: "city", labelKey: "auth.city", type: "city" },
  ];

const fields = [
    { id: "firstName", labelKey: "auth.firstName", placeholderKey: "auth.typeHere", required: true },
    { id: "lastName", labelKey: "auth.lastName", placeholderKey: "auth.typeHere", required: true },
    { id: "phone", labelKey: "auth.phone", type: "tel", placeholderKey: "auth.typeHere", required: true },
    { id: "email", labelKey: "auth.email", type: "email", placeholderKey: "auth.typeHere", required: true },
    { id: "dateOfBirth", labelKey: "auth.dateOfBirth", type: "date", placeholderKey: "auth.typeHere", required: true },
    { id: "iqamaNumber", labelKey: "auth.iqama", type: "text", placeholderKey: "auth.typeHere", required: true },
    { id: "introVideo", labelKey: "auth.introVideo", type: "url", placeholderKey: "auth.introVideoPlaceholder" },
    { id: "location", labelKey: "auth.location", placeholderKey: "auth.typeHere" },
    { id: "password", labelKey: "auth.password", type: "password", placeholderKey: "auth.typeHere", required: true },
    { id: "confirmPassword", labelKey: "auth.confirmPassword", type: "password", placeholderKey: "auth.typeHere", required: true },
  ];

const SingerSignup: React.FC = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    iqamaNumber: "",
    introVideo: "",
    location: "",
    password: "",
    confirmPassword: "",
    gender: "",
    city: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);

  const cityLabel = (value: string, fallback: string) => {
    const key = `city.${value}` as TranslationKey;
    return t(key) || fallback;
  };

  const selectOptions = (type: string) => {
    if (type === "gender") {
      return genderOptions.map((option) => ({
        value: option.value,
        label: t(option.labelKey as TranslationKey),
      }));
    }

    return SAUDI_CITIES.map((city) => ({
      value: city.value,
      label: cityLabel(city.value, city.label),
    }));
  };

  useEffect(() => {
    genreService
      .getAllGenres()
      .then((res) => setGenres(res.genres || []))
      .catch((err) => console.error("Failed to fetch genres:", err));
  }, []);

  const toggleGenre = (genreId: string) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Special handling for Iqama number - only allow numbers and max 10 digits
    if (id === "iqamaNumber") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-digits
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [id]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
    
    setError("");
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSignup = async () => {
    // Validation for required fields
    if (!formData.firstName || !formData.lastName || !formData.phone || 
        !formData.email || !formData.dateOfBirth || !formData.iqamaNumber || 
        !formData.password || !formData.confirmPassword) {
      setError(t("auth.fillRequired"));
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError(t("auth.invalidEmail"));
      return;
    }

    // Validate date of birth (must be 18 years or older)
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setError(t("auth.minimumAge"));
      return;
    }

    // Validate Iqama number (must be exactly 10 digits)
    const iqamaRegex = /^\d{10}$/;
    if (!iqamaRegex.test(formData.iqamaNumber)) {
      setError(t("auth.invalidIqama"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    if (!agreedToTerms) {
      setError(t("auth.agreeRequired"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.register("singer", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phonenumber: formData.phone,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        intro_vid_link: formData.introVideo,
        city: formData.city,
        address: formData.location,
        DOB: formData.dateOfBirth,
        iqama_number: formData.iqamaNumber,
        genreIds: selectedGenreIds,
      });

      // Store userId and phone for verification page
      sessionStorage.setItem("userId", response.userId);
      sessionStorage.setItem("userPhone", formData.phone);
      sessionStorage.setItem("userEmail", formData.email);
      sessionStorage.setItem("userRole", "singer");
      
      // Navigate directly to verification code page
      // navigate("/auth/verification-code");
      navigate("/auth/verification-method");
    } catch (err: any) {
      setError(err.response?.data?.message || t("auth.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModalLayout
      title={t("auth.artistSignupTitle")}
      footerNote={
        <p className="text-center text-sm text-[#6F5D9E]">
          {t("auth.haveAccount")}{" "}
          <button
            type="button"
            className="font-semibold cursor-pointer text-primary underline-offset-4 hover:underline"
            onClick={() => navigate("/auth/login")}
          >
            {t("auth.login")}
          </button>
        </p>
      }
      size="xl"
    >
      <div className="space-y-2 pt-[800px] lg:pt-0">
        {/* <LogoBadge size="md" /> */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {fields.map((field) => (
            <Input 
              key={field.id}
              id={field.id}
              label={t(field.labelKey as TranslationKey)}
              type={field.type}
              placeholder={t(field.placeholderKey as TranslationKey)}
              className={`bg-[#F7FBFF] border border-[#D4D7E3] ${dir === "rtl" ? "!pr-2" : "!pl-2"} !py-6`}
              value={formData[field.id as keyof typeof formData]}
              onChange={handleInputChange}
              required={field.required}
              maxLength={field.id === "iqamaNumber" ? 10 : undefined}
              pattern={field.id === "iqamaNumber" ? "[0-9]*" : undefined}
              inputMode={field.id === "iqamaNumber" ? "numeric" : undefined}
            />
          ))}
          {selects.map((select) => (
            <Select 
              key={select.id}
              label={t(select.labelKey as TranslationKey)}
              options={selectOptions(select.type)}
              placeholder={t("auth.selectOption")}
              className={`bg-[#F7FBFF] border border-[#D4D7E3] ${dir === "rtl" ? "!pr-2" : "!pl-2"} !py-6`}
              value={formData[select.id as keyof typeof formData]}
              onChange={(value) => handleSelectChange(select.id, value)}
            />
          ))}
        </div>

        {genres.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-[#2E1B4D] mb-2">
              {t("auth.genres")} <span className="text-[#6F5D9E] font-normal">({t("auth.selectAllApply")})</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const selected = selectedGenreIds.includes(genre.genreId);
                return (
                  <button
                    key={genre.genreId}
                    type="button"
                    onClick={() => toggleGenre(genre.genreId)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selected
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-[#2E1B4D] border-[#D4D7E3]"
                    }`}
                  >
                    {genre.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <label className="flex items-center gap-3 text-sm text-[#6F5D9E] mb-10">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#D5CAFF] text-primary focus:ring-[#B8860B]"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <span>
            {t("auth.agreePrefix")}{" "}
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline hover:text-primary/80"
            >
              {t("auth.termsService")}
            </a>
            {" "}{t("auth.and")}{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline hover:text-primary/80"
            >
              {t("auth.privacyPolicy")}
            </a>
            .
          </span>
        </label>

        <Button
          variant="secondary"
          size="large"
          className="mx-auto w-full max-w-md rounded-full bg-primary text-white hover:bg-[#4A1F6B] mb-5"
          onClick={handleSignup}
          disabled={loading}
        >
          <span className="font-semibold">{loading ? t("auth.signingUp") : t("auth.signup")}</span>
        </Button>

        {/* <div className="grid gap-3 md:grid-cols-2">
          <SocialButton
            label="Sign in with Google" 
            icon={
              <img src={GoogleIcon} alt="Google" className="h-6 w-6" />
            }
          />
          <SocialButton
            label="Sign in with Facebook"
            icon={<img src={FacebookIcon} alt="Facebook" className="h-7 w-7" />}
          />
        </div> */}
      </div>
    </AuthModalLayout>
  );
};

export default SingerSignup;
