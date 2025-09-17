import { useState } from "react";
import { useTranslation } from "react-i18next";

const AdminPublications = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("image");

  const handlePublish = async () => {
    if (!content.trim()) return alert(t("adminPublications.alertEmpty"));
    if (!file) return alert(t("adminPublications.alertNoFile"));

    try {
      const formData = new FormData();
      formData.append("title", content);
      formData.append("type", type);
      formData.append("file", file);

      const response = await fetch("https://excellenceschool.onrender.com/addpublication", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert(t("adminPublications.success"));
        setContent("");
        setFile(null);
        document.getElementById("file-input").value = "";
      } else {
        alert(t("adminPublications.error"));
      }
    } catch (error) {
      alert(t("adminPublications.fail"));
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
    const allowedTypes = type === "image" ? allowedImageTypes : allowedVideoTypes;

    if (!allowedTypes.includes(selectedFile.type)) {
      alert(
        t("adminPublications.invalidFile", { fileType: type === "image" ? t("adminPublications.image") : t("adminPublications.video") })
      );
      e.target.value = "";
      return;
    }

    const maxSizeMB = 10;
    const maxSize = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      alert(t("adminPublications.maxSize", { size: maxSizeMB }));
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="type" className="text-sm font-medium text-gray-700">
          {t("adminPublications.type")}
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setFile(null);
            document.getElementById("file-input").value = "";
          }}
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="image">{t("adminPublications.image")}</option>
          <option value="video">{t("adminPublications.video")}</option>
        </select>
      </div>

      <textarea
        rows="6"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("adminPublications.placeholder")}
        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
      />

      <input
        id="file-input"
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        onChange={handleFileChange}
        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
      />

      {file && (
        <div className="text-sm text-gray-600">
          {t("adminPublications.selectedFile")}: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

      <button
        onClick={handlePublish}
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
      >
        {t("adminPublications.publish")}
      </button>
    </div>
  );
};

export default AdminPublications;
