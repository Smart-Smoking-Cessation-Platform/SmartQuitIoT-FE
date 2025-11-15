// src/services/uploadService.js
/**
 * Simple Cloudinary upload helper (unsigned preset).
 * - Uses VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET
 * - Returns the parsed Cloudinary response (including secure_url)
 *
 * Note: unsigned uploads => no secret needed. Works for quick dev.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME) {
  // eslint-disable-next-line no-console
  console.warn("VITE_CLOUDINARY_CLOUD_NAME not set — upload will fail");
}
if (!UPLOAD_PRESET) {
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_CLOUDINARY_UPLOAD_PRESET not set — upload will fail unless you supply preset in opts"
  );
}

/**
 * uploadUnsigned
 * - file: File
 * - opts: { folder, upload_preset }   (upload_preset overrides env)
 * returns: { secure_url, resource_type, public_id, raw }
 */
export async function uploadUnsigned(file, opts = {}) {
  if (!file) throw new Error("No file provided for upload");
  const cloud = CLOUD_NAME || opts.cloudName;
  const preset = opts.upload_preset || UPLOAD_PRESET;

  if (!cloud)
    throw new Error(
      "Cloudinary cloud name missing (VITE_CLOUDINARY_CLOUD_NAME)."
    );
  if (!preset)
    throw new Error(
      "Cloudinary upload preset missing (VITE_CLOUDINARY_UPLOAD_PRESET)."
    );

  const url = `https://api.cloudinary.com/v1_1/${cloud}/auto/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);
  if (opts.folder) fd.append("folder", opts.folder);
  // optional timestamp (not required)
  fd.append("timestamp", Math.floor(Date.now() / 1000));

  const res = await fetch(url, {
    method: "POST",
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || JSON.stringify(data);
    const e = new Error("Cloudinary upload failed: " + msg);
    e.raw = data;
    throw e;
  }

  return {
    secure_url: data.secure_url,
    url: data.secure_url,
    public_id: data.public_id,
    resource_type: data.resource_type,
    raw: data,
  };
}

/**
 * uploadMultipleUnsigned(files, opts) => Promise<results[]>
 */
export async function uploadMultipleUnsigned(files = [], opts = {}) {
  if (!Array.isArray(files)) files = [files];
  const tasks = files.map((f) => uploadUnsigned(f, opts));
  return Promise.all(tasks);
}

export default {
  uploadUnsigned,
  uploadMultipleUnsigned,
};
