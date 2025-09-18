import React, { useState, useContext } from "react";
import { Edit3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OptionsContext } from "../Context/optionsContext";

export default function StudentProfile() {
  const { t } = useTranslation();
  const token = localStorage.getItem("accessToken");
  const storedId = localStorage.getItem("id");
  const { levels } = useContext(OptionsContext);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [original, setOriginal] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    academiclevel: "",
    _id: storedId || "",
  });

  const [form, setForm] = useState({ ...original });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const body = {
      _id: original._id,
      firstname: form.firstname !== original.firstname ? form.firstname || "" : "",
      lastname: form.lastname !== original.lastname ? form.lastname || "" : "",
      phonenumber: form.phonenumber !== original.phonenumber ? form.phonenumber || "" : "",
      academiclevel: form.academiclevel !== original.academiclevel ? form.academiclevel || "" : "",
      email: form.email !== original.email ? form.email || "" : "",
    };

    try {
      setSaving(true);
      const res = await fetch("https://excellenceschool.onrender.com/updatestudent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Error");

      setMessage({ type: "success", text: t("studentProfile.updateSuccess") });

      const updated = {
        ...original,
        ...Object.fromEntries(
          Object.entries(body).map(([key, val]) => [key, val === "" ? original[key] : val])
        ),
      };

      setOriginal(updated);
      setForm(updated);
    } catch (err) {
      setMessage({ type: "error", text: err.message || t("studentProfile.updateError") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 md:p-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["firstname", "lastname", "email", "phonenumber"].map((field) => (
          <label key={field} className="flex flex-col">
            <span className="text-xs text-gray-600">
              {t(`studentProfile.${field}`)}
            </span>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className={`mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 ${
                errors[field] ? "border-red-300" : "border-gray-200"
              }`}
              placeholder={t(`studentProfile.${field}Placeholder`)}
            />
            {errors[field] && (
              <p className="text-red-600 text-xs mt-1">{errors[field]}</p>
            )}
          </label>
        ))}

        {/* Academic Level */}
        <label className="flex flex-col">
          <span className="text-xs text-gray-600">
            {t("studentProfile.academiclevel")}
          </span>
          <select
            name="academiclevel"
            value={form.academiclevel}
            onChange={handleChange}
            className={`mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 ${
              errors.academiclevel ? "border-red-300" : "border-gray-200"
            }`}
          >
            <option value="">{t("studentProfile.selectLevel")}</option>
            {levels.map((level) => (
              <option key={level.value || level} value={level.value || level}>
                {level.label || level}
              </option>
            ))}
          </select>
          {errors.academiclevel && (
            <p className="text-red-600 text-xs mt-1">{errors.academiclevel}</p>
          )}
        </label>

        {/* Message */}
        {message.text && (
          <div
            className={`md:col-span-2 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Buttons */}
        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setForm(original);
              setErrors({});
              setMessage({ type: "", text: "" });
            }}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            {t("studentProfile.reset")}
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm disabled:opacity-70 flex items-center gap-2"
          >
            {saving ? t("studentProfile.saving") : t("studentProfile.save")}
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
