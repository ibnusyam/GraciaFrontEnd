import {
  UserCircleIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useUsers } from "../Hooks/useUsers";

export function Users() {
  const { state, actions } = useUsers();
  const { users, loading, error, showModal, creating, formData } = state;
  const { setShowModal, handleDelete, handleCreate, handleChange } = actions;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 relative">
      <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
        <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 shadow-lg -mt-6 mb-8 p-6 flex justify-between items-center">
          <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
            Daftar Pengguna
          </h6>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white py-2 px-4 rounded-lg transition-all font-bold text-xs uppercase"
          >
            <PlusIcon className="h-4 w-4" />
            Tambah User
          </button>
        </div>

        <div className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["No", "NIK", "Nama Lengkap"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <p className="block antialiased font-sans text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center text-sm text-gray-500"
                  >
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center text-sm text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map(({ id, nik, full_name }, key) => {
                  const className = `py-3 px-5 ${
                    key === users.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={nik || key} className="hover:bg-gray-50">
                      <td className={className}>
                        <p className="block antialiased font-sans text-xs font-semibold text-blue-gray-600">
                          {key + 1}
                        </p>
                      </td>
                      <td className={className}>
                        <p className="block antialiased font-sans text-xs font-semibold text-blue-gray-600">
                          {nik}
                        </p>
                      </td>
                      <td className={className}>
                        <div className="flex items-center justify-between pr-4">
                          <div className="flex items-center gap-4">
                            <UserCircleIcon className="h-8 w-8 text-gray-400" />
                            <div>
                              <p className="block antialiased font-sans text-sm font-semibold text-blue-gray-900">
                                {full_name}
                              </p>
                              <p className="block antialiased font-sans text-xs font-normal text-blue-gray-500">
                                Karyawan
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDelete(id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Hapus Pengguna"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center text-sm text-gray-500"
                  >
                    Tidak ada data pengguna ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Tambah Pengguna Baru</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIK (Nomor Induk Karyawan)
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="Contoh: 5163"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Contoh: Siapa Aja Boleh"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all"
                  required
                />
              </div>

              <div className="mt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {creating ? "Processing..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
