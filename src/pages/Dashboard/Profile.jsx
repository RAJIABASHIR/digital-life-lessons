import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

function InitialAvatar({ name = "User" }) {
  const letter = (name?.trim()?.[0] || "U").toUpperCase();
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-2xl font-bold text-slate-600 shadow sm:h-24 sm:w-24 sm:text-3xl">
      {letter}
    </div>
  );
}

export default function Profile() {
  const { appUser, firebaseUser, refetchAppUser } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);

  const currentName =
    appUser?.displayName || appUser?.name || firebaseUser?.displayName || "";
  const currentEmail = appUser?.email || firebaseUser?.email || "";
  const currentPhoto = appUser?.photoURL || firebaseUser?.photoURL || "";

  useEffect(() => {
    setDisplayName(currentName || "");
    setPhotoURL(currentPhoto || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appUser, firebaseUser]);

  const hasChanges = useMemo(() => {
    return (
      displayName !== (currentName || "") ||
      photoURL !== (currentPhoto || "")
    );
  }, [displayName, photoURL, currentName, currentPhoto]);

  const headerAvatarSrc = photoURL || currentPhoto;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axiosInstance.patch("/users/me", { displayName, photoURL });
      toast.success("Profile updated");
      await refetchAppUser();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 self-start sm:self-auto"
          >
            <span className="mr-1 text-lg">←</span>
            
          </Link>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
       
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
         

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            {headerAvatarSrc ? (
              <img
                src={headerAvatarSrc}
                alt={displayName || currentName || "User"}
                className="h-20 w-20 rounded-full border-4 border-white object-cover shadow sm:h-24 sm:w-24"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <InitialAvatar name={displayName || currentName || "User"} />
            )}

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {displayName || currentName || "User"}
              </h1>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                {currentEmail || "—"}
              </p>
            </div>
          </div>
        </div>

        
        <div className="mt-2 flex justify-center sm:mt-4">
          <div className="w-full max-w-3xl">
            <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-violet-600 p-[2px] shadow-lg">
              <div className="rounded-2xl bg-white px-4 py-6 sm:px-8 sm:py-8">
                <h2 className="text-lg font-bold text-slate-900 sm:text-2xl">
                  Profile
                </h2>

                <form
                  onSubmit={handleSave}
                  className="mt-5 space-y-5 sm:mt-6 sm:space-y-6"
                >
                  
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Name
                    </label>
                    <div className="relative">
                      <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-sky-400 sm:px-4 sm:py-3"
                      />
                      <div className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-sm text-slate-500 sm:right-3 sm:h-9 sm:w-9 sm:text-lg">
                        …
                      </div>
                    </div>
                  </div>

                  
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>
                    <input
                      value={currentEmail}
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 sm:px-4 sm:py-3"
                    />
                  </div>

                  
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Photo URL
                    </label>
                    <input
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-violet-400 sm:px-4 sm:py-3"
                    />
                  </div>

                  
                  <div className="pt-1 sm:pt-2">
                    <button
                      type="submit"
                      disabled={saving || !hasChanges}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-500 disabled:opacity-60 disabled:hover:bg-sky-600 sm:w-auto sm:px-6 sm:py-3"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-slate-500 sm:mt-6 sm:text-left sm:text-sm">
              Tip: Use a clear profile photo and a name that helps others
              recognize you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}