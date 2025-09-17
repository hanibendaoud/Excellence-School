import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const BASE_URL = "https://excellenceschool.onrender.com";

const AdminTeacherAccount = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    specialit: "",
  });

  const [materials, setMaterials] = useState([]);

  // Fetch materials for dropdown
  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getmaterials`);
      const data = await response.json();
      setMaterials(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!form.fullName || !form.phone || !form.email || !form.password || !form.specialit) {
      alert(t("adminTeachers.errors.fillFields"));
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/creatteacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: form.fullName,
          phonenumber: form.phone,
          email: form.email,
          password: form.password,
          specialit: form.specialit,
        }),
      });

      if (response.ok) {
        alert(t("adminTeachers.success.created", { name: form.fullName }));
        setForm({
          fullName: "",
          phone: "",
          email: "",
          password: "",
          specialit: "",
        });
      } else {
        alert(t("adminTeachers.errors.create"));
      }
    } catch (error) {
      alert(t("adminTeachers.errors.network"));
      console.log(error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder={t("adminTeachers.form.fullName")}
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder={t("adminTeachers.form.phone")}
          className="p-2 border rounded-lg"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t("adminTeachers.form.email")}
          className="p-2 border rounded-lg"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder={t("adminTeachers.form.password")}
          className="p-2 border rounded-lg"
        />

        {/* Specialit dropdown */}
        <select
          name="specialit"
          value={form.specialit}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        >
          <option value="">{t("adminTeachers.form.selectSpeciality")}</option>
          {materials.map((mat, index) => (
            <option key={index} value={mat}>
              {mat}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleCreate}
        className="px-6 py-2 bg-orange-400 text-white rounded-lg"
      >
        {t("adminTeachers.actions.create")}
      </button>
    </div>
  );
};

export default AdminTeacherAccount;
