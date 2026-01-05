import { AppShell } from "@/components/layout/AppShell";
import LineageGraph from "@/components/lineage/LineageGraph";

export default function Home() {
    return (
        <AppShell>
            <LineageGraph />
        </AppShell>
    );
}
