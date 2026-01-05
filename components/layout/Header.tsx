import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";

export const Header = () => {
    return (
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="hover:text-slate-800 cursor-pointer">
                    Workflows
                </span>
                <span className="text-slate-300">/</span>
                <span className="hover:text-slate-800 cursor-pointer">
                    Flight Search
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-medium">
                    Execution #8291
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search execution..."
                        className="bg-transparent border-none text-sm outline-none w-48 text-slate-600 placeholder:text-slate-400"
                    />
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="text-slate-400 hover:text-slate-600 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
};
