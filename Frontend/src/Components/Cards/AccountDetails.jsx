import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { ChevronRight, Star, Pencil, X, Check, Loader2 } from "lucide-react";

function AccountDetails() {
  const { user, token, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
  });

  // Enter edit mode: pre-fill form with current user values
  const handleEditClick = () => {
    setFormData({
      username: user?.username ?? "",
      age: user?.age ?? "",
      gender: user?.gender ?? "",
      weight: user?.weight ?? "",
      height: user?.height ?? "",
    });
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  // Cancel: exit edit mode without saving
  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username || !formData.age || !formData.gender || !formData.weight || !formData.height) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/v1/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        updateUser(data.user); // sync to AuthContext + localStorage
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setError(data.message || "Update failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Shared input class depending on edit state
  const inputClass = (editable) =>
    `w-full py-3.5 pl-4 pr-10 rounded-2xl shadow-sm border font-medium text-base outline-none transition-all duration-200 ${
      editable
        ? "bg-white dark:bg-surface-container text-on-surface border-primary focus:ring-2 focus:ring-primary/30 cursor-text"
        : "bg-surface-container-lowest text-on-surface border-separator cursor-default"
    }`;

  const fields = [
    { id: "fullName", label: "Full Name", field: "username", type: "text", editable: true },
    { id: "email", label: "Email", field: "email", type: "email", editable: false },
    { id: "age", label: "Age", field: "age", type: "number", editable: true },
    { id: "gender", label: "Gender", field: "gender", type: "text", editable: true },
    { id: "weight", label: "Weight", field: "weight", type: "number", editable: true },
    { id: "height", label: "Height", field: "height", type: "number", editable: true },
  ];

  return (
    <div>
      <div className="bg-surface-container-low w-full rounded-2xl border border-separator">
        {/* Header */}
        <div className="flex flex-row justify-between items-center px-6 md:px-10 mt-5">
          <p className="font-medium text-xl text-on-surface">Your Profile</p>
          <div className="flex items-center gap-3">
            <p className="bg-primary py-1 px-2.5 rounded-full text-white text-xs font-bold">
              Pro
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-6 rounded-xl w-full">

            {/* Status messages */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm font-medium">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {fields.map(({ id, label, field, type, editable }) => {
                const isFieldEditable = isEditing && editable;
                const displayValue = field === "email"
                  ? (user?.email ?? "Email not set")
                  : isEditing
                  ? formData[field]
                  : (user?.[field] ?? "Not set");

                return (
                  <div key={id} className="flex flex-col gap-2">
                    <label htmlFor={id} className="text-sm font-medium text-secondary flex items-center gap-1.5">
                      {label}
                      {field === "email" && (
                        <span className="text-xs text-secondary/60 font-normal">(cannot be changed)</span>
                      )}
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id={id}
                        type={type}
                        className={inputClass(isFieldEditable)}
                        value={displayValue}
                        readOnly={!isFieldEditable}
                        onChange={isFieldEditable ? handleChange(field) : undefined}
                        min={type === "number" ? 0 : undefined}
                      />
                      {!isFieldEditable && (
                        <span className="absolute right-4 text-secondary pointer-events-none">
                          <ChevronRight size={18} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-separator text-on-surface font-semibold text-sm hover:bg-surface-container transition-colors"
                  >
                    <X size={15} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>

        {/* Subscription banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 bg-primary-muted border border-primary/20 m-4 md:m-10 rounded-xl text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div>
              <Star className="p-3 h-12 w-12 rounded-full bg-primary text-white" />
            </div>
            <div>
              <p className="font-bold text-primary">Elite Annual Plan</p>
              <p className="text-sm text-primary">renew on 1 june 2026</p>
            </div>
          </div>
          <div>
            <p className="text-primary font-bold cursor-pointer hover:underline text-sm">
              Manage Plans
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;
