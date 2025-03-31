import React, { useState, useEffect, useRef } from "react";

const previewCache = {};

const LinkPreview = ({ url }) => {
    const [preview, setPreview] = useState(previewCache[url] || null);
    const [isHovered, setIsHovered] = useState(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!url || previewCache[url] || hasFetched.current) return;

        const fetchPreview = async () => {
            hasFetched.current = true;
            const apiKey = process.env.REACT_APP_JSON_LINK_API_KEY;
            const apiUrl = `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}&api_key=${apiKey}`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`Error: ${response.status}`);

                const data = await response.json();
                previewCache[url] = data;
                setPreview(data);
            } catch (error) {
                console.error("Error fetching preview:", error);
            }
        };

        // fetchPreview();
    }, [url]);

    return (
        <div className="relative inline-block">
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 underline"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {url}
            </a>

            {isHovered && preview && (
                <div className="absolute left-0 top-6 z-50 p-3 bg-white shadow-lg border rounded-lg w-64">
                    {preview.images?.length > 0 && (
                        <img src={preview.images[0]} alt="Preview" className="object-cover rounded w-50" />
                    )}
                    <div className="mt-2">
                        <div className="font-semibold">{preview.title}</div>
                        <div className="text-sm text-gray-600">{preview.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{new URL(url).hostname}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkPreview;
