import React from 'react';
import {ChevronRight, Home} from "lucide-react";
import {useNavigate} from "react-router-dom";

function BreadCrumb({primary,secondary}) {
    const navigate = useNavigate()
    return (
        <div>
            <div className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
                <span className="hover:text-gray-900 transition-colors cursor-pointer" onClick={() => navigate(primary?.path)}>{primary?.title}</span>
                <ChevronRight className="w-4 h-4"/>
                <span className="text-gray-700 font-medium" onClick={() => navigate(secondary?.path)}>{secondary?.title}</span>
            </div>

        </div>
    );
}

export default BreadCrumb;