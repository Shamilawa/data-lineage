import React from "react";
import {
    Home,
    Workflow,
    Settings,
    Users,
    BarChart3,
    Layers,
} from "lucide-react";
import clsx from "clsx";

const NavItem = ({
    icon: Icon,
    label,
    active = false,
}: {
    icon: any;
    label: string;
    active?: boolean;
}) => (
    <button
        className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full text-left text-sm font-medium",
            active
                ? "bg-slate-200 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

export const Sidebar = () => {
    return (
        <aside className="w-64 border-r border-slate-200 bg-white h-screen flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Layers className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-slate-800 tracking-tight">
                    AgentFlow
                </span>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                <div>
                    <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Platform
                    </div>
                    <div className="space-y-1">
                        <NavItem icon={Home} label="Dashboard" />
                        <NavItem icon={Workflow} label="Workflows" active />
                        <NavItem icon={BarChart3} label="Analytics" />
                    </div>
                </div>

                <div>
                    <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Management
                    </div>
                    <div className="space-y-1">
                        <NavItem icon={Users} label="Agents" />
                        <NavItem icon={Settings} label="Settings" />
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">
                            Admin User
                        </span>
                        <span className="text-xs text-slate-500">
                            acme-corp
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
