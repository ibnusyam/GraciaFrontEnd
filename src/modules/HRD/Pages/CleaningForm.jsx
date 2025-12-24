import React from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCleaningForm } from "../Hooks/useCleaningForm";

const customDatePickerStyle = `
  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    display: block;
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 100%;
    height: 42px;
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 0.5rem;
    border: 1px solid #d1d5db;
    outline: none;
    background-color: white;
  }
  .react-datepicker__input-container input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  .react-datepicker-popper {
    z-index: 9999 !important;
  }
`;

export function CleaningForm() {
  const navigate = useNavigate();
  const { state, actions } = useCleaningForm();
  const { formData, loading, message, error, locationTypes, locations } = state;
  const { handleChange, handleFileChange, handleSubmit, setFormData } = actions;

  // 3. Fungsi Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredLocations = locations.filter(
    (loc) =>
      loc.location_type_id.toString() === formData.location_type_name.toString()
  );

  const handleDateChange = (date, name) => {
    const fakeEvent = {
      target: {
        name: name,
        value: date,
      },
    };
    handleChange(fakeEvent);
  };

  const inputClass =
    "mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out bg-white";

  const ImageUploadSection = ({ label, name, currentFile }) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <label className="flex-1 flex flex-col items-center justify-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm font-semibold">Kamera</span>
            <input
              type="file"
              name={name}
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <label className="flex-1 flex flex-col items-center justify-center px-4 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-semibold">Galeri</span>
            <input
              type="file"
              name={name}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="mt-2 text-xs">
          {currentFile ? (
            <p className="text-green-600 font-medium flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              File Terpilih:{" "}
              <span className="truncate ml-1">{currentFile.name}</span>
            </p>
          ) : (
            <p className="text-gray-400 italic">Belum ada foto diambil</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{customDatePickerStyle}</style>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
        {/* CONTAINER TOMBOL LOGOUT (Di atas card utama) */}
        <div className="w-full max-w-4xl flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition shadow-sm border border-red-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-100">
          <div className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Log Kebersihan Harian
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Silakan isi formulir di bawah ini dengan lengkap.
            </p>
          </div>

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Cleaner
              </label>
              <input
                type="text"
                name="cleaner_name"
                value={formData.cleaner_name}
                readOnly
                className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipe Lokasi <span className="text-red-500">*</span>
              </label>
              <select
                name="location_type_name"
                value={formData.location_type_name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    location_type_name: e.target.value,
                    location_name: "",
                  }));
                }}
                className={inputClass}
                required
              >
                <option value="">Pilih Tipe</option>
                {locationTypes.map((type) => (
                  <option
                    key={type.location_type_id}
                    value={type.location_type_id}
                  >
                    {type.type_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Lokasi Detail <span className="text-red-500">*</span>
              </label>
              <select
                name="location_name"
                value={formData.location_name}
                onChange={handleChange}
                className={`${inputClass} disabled:bg-gray-100`}
                required
                disabled={!formData.location_type_name}
              >
                <option value="" disabled>
                  {!formData.location_type_name
                    ? "Pilih Tipe Lokasi Terlebih Dahulu"
                    : "Pilih Lokasi"}
                </option>
                {filteredLocations.map((loc) => (
                  <option key={loc.location_id} value={loc.location_id}>
                    {loc.location_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Mulai <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={
                  formData.start_time ? new Date(formData.start_time) : null
                }
                onChange={(date) => handleDateChange(date, "start_time")}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                dateFormat="dd/MM/yyyy HH:mm"
                placeholderText="Pilih waktu mulai"
                required
                autoComplete="off"
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Selesai <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={
                  formData.end_time ? new Date(formData.end_time) : null
                }
                onChange={(date) => handleDateChange(date, "end_time")}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                dateFormat="dd/MM/yyyy HH:mm"
                placeholderText="Pilih waktu selesai"
                required
                autoComplete="off"
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>

            <ImageUploadSection
              label="Foto Sebelum"
              name="image_before"
              currentFile={formData.image_before}
            />
            <ImageUploadSection
              label="Foto Sesudah"
              name="image_after"
              currentFile={formData.image_after}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Catatan
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className={inputClass}
                placeholder="Tambahkan catatan penting..."
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400 shadow-lg cursor-pointer transform hover:-translate-y-0.5"
              >
                {loading ? "Mengirim Data..." : "Submit Log Kebersihan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CleaningForm;
