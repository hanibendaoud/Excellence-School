import { useState, useEffect, useCallback, memo } from "react";
import { 
  Settings, Plus, UserPlus, BookOpen, Clock, School, 
  AlertCircle, CheckCircle, Trash2 
} from "lucide-react";

const baseUrl = "https://excellenceschool.onrender.com";

const MessageAlert = memo(({ message }) => {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium mb-4 ${
      message.type === "error" 
        ? "bg-red-50 text-red-800 border border-red-200" 
        : "bg-green-50 text-green-800 border border-green-200"
    }`}>
      {message.type === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
      <span>{message.message}</span>
    </div>
  );
});

const SubmitButton = memo(({ loading, children, loadingText, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-medium rounded-lg hover:from-orange-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
  >
    {loading ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        {loadingText}
      </>
    ) : (
      <>
        <Icon className="w-4 h-4" />
        {children}
      </>
    )}
  </button>
));

const CardWrapper = memo(({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl text-white shadow-lg">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
));

const ItemsList = memo(({ items, type, onDelete }) => {
  if (!items || items.length === 0) return null;

  const getLabel = (item) => {
    if (typeof item === "string") return item;
    switch (type) {
      case "levels": return item.level || "";
      case "classrooms": return item.classroom || "";
      case "timings": return item.timing || "";
      case "materials": return item.material || "";
      default: return JSON.stringify(item);
    }
  };

  return (
    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Current Items:</h4>
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-700">{getLabel(item)}</span>
          <button
            onClick={() => onDelete && onDelete(item)}
            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
});

const LevelCard = memo(({ onUpdate }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [items, setItems] = useState([]);

  const showMessage = useCallback((msg, type = "success") => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/getlevels`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.log("Error fetching levels:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async () => {
    if (!value.trim()) {
      showMessage("Please fill in the field", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/addlevels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: value }),
      });

      if (response.ok) {
        showMessage("Academic level added successfully!");
        setValue("");
        fetchItems();
        if (onUpdate) onUpdate();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showMessage(errorData.message || "Operation failed", "error");
      }
    } catch {
      showMessage("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;

  const payload = { level: item.level || item };
  console.log("Deleting level with payload:", payload);

  try {
    const response = await fetch(`${baseUrl}/deletelevel`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: item.level || item }),
    });

    console.log("Delete level response status:", response.status);
    const data = await response.json().catch(() => ({}));
    console.log("Delete level response data:", data);

    if (response.ok) {
      showMessage("Level deleted successfully!");
      fetchItems();
      if (onUpdate) onUpdate();
    } else {
      showMessage(data.message || "Delete failed", "error");
    }
  } catch (error) {
    console.error("Delete level error:", error);
    showMessage("Network error occurred", "error");
  }
};


  return (
    <CardWrapper title="Academic Levels" icon={BookOpen}>
      <MessageAlert message={message} />
      <div className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g., Primary, Secondary, Grade 9..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <SubmitButton 
          loading={loading} 
          loadingText="Adding Level..." 
          icon={Plus}
          onClick={handleSubmit}
        >
          Add Academic Level
        </SubmitButton>
      </div>
      <ItemsList items={items} type="levels" onDelete={handleDelete} />
    </CardWrapper>
  );
});

const ClassroomCard = memo(({ onUpdate }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [items, setItems] = useState([]);

  const showMessage = useCallback((msg, type = "success") => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/getclassroom`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.log("Error fetching classrooms:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async () => {
    if (!value.trim()) {
      showMessage("Please fill in the field", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/addclassroom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroom: value }),
      });

      if (response.ok) {
        showMessage("Classroom added successfully!");
        setValue("");
        fetchItems();
        if (onUpdate) onUpdate();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showMessage(errorData.message || "Operation failed", "error");
      }
    } catch {
      showMessage("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (item) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;

  const payload = { classroom: item.classroom || item };
  console.log("Deleting classroom with payload:", payload);

  try {
    const response = await fetch(`${baseUrl}/deleteclassroom`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classrom: item.classroom || item }),
    });

    console.log("Delete classroom response status:", response.status);
    const data = await response.json().catch(() => ({}));
    console.log("Delete classroom response data:", data);

    if (response.ok) {
      showMessage("Classroom deleted successfully!");

      await fetchItems();
      const checkResponse = await fetch(`${baseUrl}/getclassroom`);
      const checkData = await checkResponse.json();
      console.log("Classrooms after delete:", checkData);

      if (onUpdate) onUpdate();
    } else {
      showMessage(data.message || "Delete failed", "error");
    }
  } catch (error) {
    console.error("Delete classroom error:", error);
    showMessage("Network error occurred", "error");
  }
};



  return (
    <CardWrapper title="Classrooms" icon={School}>
      <MessageAlert message={message} />
      <div className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g., Room A1, Computer Lab..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <SubmitButton 
          loading={loading} 
          loadingText="Adding Classroom..." 
          icon={Plus}
          onClick={handleSubmit}
        >
          Add Classroom
        </SubmitButton>
      </div>
      <ItemsList items={items} type="classrooms" onDelete={handleDelete} />
    </CardWrapper>
  );
});

const TimingCard = memo(({ onUpdate }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [items, setItems] = useState([]);

  const showMessage = useCallback((msg, type = "success") => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/getteming`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.log("Error fetching timings:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async () => {
    if (!value.trim()) {
      showMessage("Please fill in the field", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/addteming`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teming: value }),
      });

      if (response.ok) {
        showMessage("Time slot added successfully!");
        setValue("");
        fetchItems();
        if (onUpdate) onUpdate();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showMessage(errorData.message || "Operation failed", "error");
      }
    } catch {
      showMessage("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;

  const payload = { teming: item.timing || item };
  console.log("Deleting timing with payload:", payload);

  try {
    const response = await fetch(`${baseUrl}/deletetiming`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timing: item.timing || item }),
    });

    console.log("Delete timing response status:", response.status);
    const data = await response.json().catch(() => ({}));
    console.log("Delete timing response data:", data);

    if (response.ok) {
      showMessage("Time slot deleted successfully!");
      fetchItems();
      if (onUpdate) onUpdate();
    } else {
      showMessage(data.message || "Delete failed", "error");
    }
  } catch (error) {
    console.error("Delete timing error:", error);
    showMessage("Network error occurred", "error");
  }
};


  return (
    <CardWrapper title="Time Slots" icon={Clock}>
      <MessageAlert message={message} />
      <div className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g., 08:00 AM - 09:30 AM..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <SubmitButton 
          loading={loading} 
          loadingText="Adding Time Slot..." 
          icon={Plus}
          onClick={handleSubmit}
        >
          Add Time Slot
        </SubmitButton>
      </div>
      <ItemsList items={items} type="timings" onDelete={handleDelete} />
    </CardWrapper>
  );
});

const MaterialCard = memo(({ onUpdate }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [items, setItems] = useState([]);

  const showMessage = useCallback((msg, type = "success") => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/getmaterials`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.log("Error fetching materials:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async () => {
    if (!value.trim()) {
      showMessage("Please fill in the field", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/addmaterials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material: value }),
      });

      if (response.ok) {
        showMessage("Subject added successfully!");
        setValue("");
        fetchItems();
        if (onUpdate) onUpdate();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showMessage(errorData.message || "Operation failed", "error");
      }
    } catch {
      showMessage("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;

  const payload = { material: item.material || item };
  console.log("Deleting material with payload:", payload);

  try {
    const response = await fetch(`${baseUrl}/deletematerial`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Delete material response status:", response.status);
    const data = await response.json().catch(() => ({}));
    console.log("Delete material response data:", data);

    if (response.ok) {
      showMessage("Subject deleted successfully!");
      fetchItems();
      if (onUpdate) onUpdate();
    } else {
      showMessage(data.message || "Delete failed", "error");
    }
  } catch (error) {
    console.error("Delete material error:", error);
    showMessage("Network error occurred", "error");
  }
};


  return (
    <CardWrapper title="Subjects & Materials" icon={BookOpen}>
      <MessageAlert message={message} />
      <div className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g., Mathematics, Physics..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <SubmitButton 
          loading={loading} 
          loadingText="Adding Subject..." 
          icon={Plus}
          onClick={handleSubmit}
        >
          Add Subject/Material
        </SubmitButton>
      </div>
      <ItemsList items={items} type="materials" onDelete={handleDelete} />
    </CardWrapper>
  );
});

const AdminCard = memo(({ onUpdate }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((msg, type = "success") => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const handleSubmit = async () => {
    if (!fullname.trim() || !email.trim() || !password.trim()) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/Creatmanagemrnt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });

      if (response.ok) {
        showMessage("Admin created successfully!");
        setFullname("");
        setEmail("");
        setPassword("");
        if (onUpdate) onUpdate();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showMessage(errorData.message || "Operation failed", "error");
      }
    } catch {
      showMessage("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 lg:col-span-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl text-white shadow-lg">
          <UserPlus className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Admin Management</h3>
      </div>
      <MessageAlert message={message} />
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Enter full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a secure password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <SubmitButton 
          loading={loading} 
          loadingText="Creating Admin Account..." 
          icon={UserPlus}
          onClick={handleSubmit}
        >
          Create Administrator Account
        </SubmitButton>
      </div>
    </div>
  );
});

// Main Component
const AdminSettings = () => {
  // Optional: If you need to track global updates
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  const handleUpdate = useCallback(() => {
    setLastUpdate(Date.now());
  }, []);

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LevelCard onUpdate={handleUpdate} />
        <ClassroomCard onUpdate={handleUpdate} />
        <TimingCard onUpdate={handleUpdate} />
        <MaterialCard onUpdate={handleUpdate} />
      </div>

    </div>
  );
};

export default AdminSettings;