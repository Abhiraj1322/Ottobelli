import React, { useState } from "react";
import api from "../../api/axios"; // Uses your pre-configured Axios instance with JWT interceptor

const AdminBulkUpload = () => {
  // Step 1 State: Images
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageMessage, setImageMessage] = useState("");

  // Step 2 State: Excel
  const [selectedExcel, setSelectedExcel] = useState(null);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [excelMessage, setExcelMessage] = useState("");
  const [importedProducts, setImportedProducts] = useState([]);
const [uploadStats, setUploadStats] = useState({ createdCount: 0, updatedCount: 0 });
const [errors, setErrors] = useState([]);
  // Active step navigation tab
  const [activeStep, setActiveStep] = useState(1);

  // --- STEP 1 HANDLERS (Images) ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedImages(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
      setImageMessage("");
    }
  };

  const handleUploadImages = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) return;

    const formData = new FormData();
    selectedImages.forEach((file) => formData.append("images", file));

    try {
      setUploadingImages(true);
      setImageMessage("");

      const response = await api.post("/api/admin/upload-bulk-images", formData);

      if (response.data.success) {
        setUploadedImageUrls(response.data.imageUrls);
        setImageMessage(`Successfully uploaded ${response.data.count} images to Cloudinary!`);
      }
    } catch (error) {
      console.error(error);
      setImageMessage(error.response?.data?.message || "Failed to upload images.");
    } finally {
      setUploadingImages(false);
    }
  };

  // --- STEP 2 HANDLERS (Excel File) ---
  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedExcel(file);
      setExcelMessage("");
      setImportedProducts([]);
    }
  };

const handleUploadExcel = async (e) => {
  e.preventDefault();
  if (!selectedExcel) return;

  const formData = new FormData();
  formData.append("excelFile", selectedExcel);

  try {
    setUploadingExcel(true);
    setExcelMessage("");

    const response = await api.post("/api/admin/upload-products-excel", formData);

    console.log("Response Data:", response.data);

    if (response.data.success) {
      setExcelMessage(response.data.message);

      // Extract created/updated counts directly from backend JSON
      setUploadStats({
        createdCount: response.data.createdCount || 0,
        updatedCount: response.data.updatedCount || 0,
      });

      // Save any row errors if returned
      setErrors(response.data.errors || []);
    }
  } catch (error) {
    console.error("Upload error:", error);
    setExcelMessage(error.response?.data?.message || "Failed to upload Excel sheet.");
    setUploadStats({ createdCount: 0, updatedCount: 0 });
    setErrors(error.response?.data?.errors || []);
  } finally {
    setUploadingExcel(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ottobelli Store Admin</h1>
        <p className="text-sm text-gray-500">
          Bulk product creation dashboard: Upload product media and Excel catalog spreadsheets.
        </p>
      </div>

      {/* Admin Visual Instructions Banner */}
      <div className="mb-8 p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl">
        <h2 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-1">
          <span>📌</span> How Bulk Upload Works (3 Easy Steps)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-indigo-950">
          <div className="p-2.5 bg-white rounded-lg shadow-sm border border-indigo-100">
            <span className="font-bold text-indigo-600 block mb-0.5">Step 1: Media</span>
            Upload product photos to Cloudinary to generate CDN URLs. Copy the URLs you need.
          </div>
          <div className="p-2.5 bg-white rounded-lg shadow-sm border border-indigo-100">
            <span className="font-bold text-indigo-600 block mb-0.5">Step 2: Spreadsheet</span>
            Fill out your Excel file with SKUs, titles, prices, and paste the image URLs into the sheet columns.
          </div>
          <div className="p-2.5 bg-white rounded-lg shadow-sm border border-indigo-100">
            <span className="font-bold text-indigo-600 block mb-0.5">Step 3: Import</span>
            Upload the completed `.xlsx` file below to bulk-create all items inside MongoDB instantly.
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveStep(1)}
          className={`py-2 px-6 font-medium text-sm transition-colors border-b-2 ${
            activeStep === 1
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          1. Upload Product Photos
        </button>
        <button
          onClick={() => setActiveStep(2)}
          className={`py-2 px-6 font-medium text-sm transition-colors border-b-2 ${
            activeStep === 2
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          2. Upload Excel Catalog
        </button>
      </div>

      {/* STEP 1 PANEL: BULK IMAGE UPLOAD */}
      {activeStep === 1 && (
        <section className="space-y-6">
          <form onSubmit={handleUploadImages} className="space-y-4">
            <div className="flex flex-col items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-1 text-sm text-gray-600 font-medium">
                    Click to select product photos (WEBP, PNG, JPG)
                  </p>
                  <p className="text-xs text-gray-400">Select multiple files at once</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Selected Files ({imagePreviews.length}):
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {imagePreviews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploadingImages || selectedImages.length === 0}
              className={`w-full py-2.5 rounded-lg font-medium text-white text-sm transition ${
                uploadingImages || selectedImages.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {uploadingImages ? "Uploading Images..." : `Upload ${selectedImages.length} Photos to Cloudinary`}
            </button>
          </form>

          {imageMessage && (
            <p className={`text-center text-sm font-medium ${uploadedImageUrls.length > 0 ? "text-green-600" : "text-red-500"}`}>
              {imageMessage}
            </p>
          )}

          {uploadedImageUrls.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-gray-700">Uploaded Image CDN URLs:</p>
                <span className="text-gray-400">Copy these into your Excel file</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono bg-white p-2.5 rounded border">
                {uploadedImageUrls.map((url, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-1 last:border-0">
                    <span className="truncate pr-4 text-gray-600">{url}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(url)}
                      className="text-indigo-600 hover:text-indigo-800 font-sans text-xs font-semibold shrink-0"
                    >
                      Copy URL
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* STEP 2 PANEL: EXCEL SPREADSHEET UPLOAD */}
      {activeStep === 2 && (
        <section className="space-y-6">
          <form onSubmit={handleUploadExcel} className="space-y-4">
            <div className="flex flex-col items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50/40 hover:bg-indigo-50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-1 text-sm text-gray-700 font-medium">
                    {selectedExcel ? selectedExcel.name : "Click to select .xlsx or .xls Excel template"}
                  </p>
                  <p className="text-xs text-indigo-400">Standard Ottobelli product upload sheet</p>
                </div>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={handleExcelChange}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={uploadingExcel || !selectedExcel}
              className={`w-full py-2.5 rounded-lg font-medium text-white text-sm transition ${
                uploadingExcel || !selectedExcel
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {uploadingExcel ? "Processing & Saving Products..." : "Import Products to Database"}
            </button>
          </form>

        {excelMessage && (
  <div className="text-center my-4">
    {/* Success / Error Header */}
    <p className={`text-sm font-semibold ${uploadStats.createdCount > 0 || uploadStats.updatedCount > 0 ? "text-green-600" : "text-red-500"}`}>
      {excelMessage}
    </p>

    {/* Created & Updated Count Display */}
    {uploadStats.createdCount > 0 && (
      <p className="text-xs text-gray-600 mt-1">
        🎉 Successfully created <span className="font-bold text-gray-800">{uploadStats.createdCount}</span> new product(s)!
      </p>
    )}

    {uploadStats.updatedCount > 0 && (
      <p className="text-xs text-gray-600 mt-1">
        🔄 Updated <span className="font-bold text-gray-800">{uploadStats.updatedCount}</span> existing product(s).
      </p>
    )}
  </div>
)}

          {/* Results Table */}
        {uploadStats.createdCount > 0 || uploadStats.updatedCount > 0 ? (
  <div className="border rounded-xl p-4 bg-white shadow-sm mt-4">
    <div className="flex justify-between items-center border-b pb-3 mb-3">
      <span className="font-semibold text-xs text-gray-700">Import Summary</span>
      <span className="text-xs font-bold text-green-600">
        {uploadStats.createdCount + uploadStats.updatedCount} Processed
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="p-3 bg-green-50 rounded-lg border border-green-100">
        <p className="text-2xl font-bold text-green-700">{uploadStats.createdCount}</p>
        <p className="text-xs text-green-600 font-medium">New Products Created</p>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-2xl font-bold text-blue-700">{uploadStats.updatedCount}</p>
        <p className="text-xs text-blue-600 font-medium">Existing Products Updated</p>
      </div>
    </div>
  </div>
) : null}
        </section>
      )}
    </div>
  );
};

export default AdminBulkUpload;