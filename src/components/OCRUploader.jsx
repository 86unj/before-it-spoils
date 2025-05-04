import React, { useState } from "react";

export default function OCRUploader({ setPantry }) {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageUpload = async () => {
        if (!image) return;

        setLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = async () => {
            const base64Image = reader.result.split(",")[1];
            try {
                const res = await fetch("https://gdsc-server-fy70.onrender.com/ocr", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64Image }),
                });

                if (!res.ok) {
                    const errorText = await res.text(); // Get the error message from the server
                    console.error("Server Response:", errorText);
                    throw new Error("Failed to process image");
                }

                const data = await res.json();
                const items = data.grocery_items.map((item) => item.name.toLowerCase());
                setPantry((prev) => [...new Set([...prev, ...items])]);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };
        reader.readAsDataURL(image);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="shadow-md rounded-lg p-6 max-w-md mx-auto bg-gray-50">
            <h2 className="font-bold mb-4 text-center text-gray-500">Upload Your Receipt</h2>

            <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500"
                onClick={() => document.getElementById("file-input").click()}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-md"
                    />
                ) : (
                    <p className="text-gray-500">Drag and drop an image here, <br /> or click to select a file</p>
                )}
            </div>

            <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <button
                onClick={handleImageUpload}
                disabled={loading || !image}
                className={`btn btn-primary w-full mt-4 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                {loading ? "Processing..." : "Upload Receipt"}
            </button>
        </div>
    );
}