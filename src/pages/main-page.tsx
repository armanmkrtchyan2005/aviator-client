import { BettingZone } from "@/containers/betting-zone";
import { Statistics } from "@/containers/statistics";
import { Chart } from "@/components/chart/chart";
import { Header } from "@/containers/header/header";
import { Toaster } from "@/components/ui/sonner";
import { LatestRatiosList } from "@/components/latest-ratios-list";

export const MainPage = () => {
    // useEffect(() => {
    //     const onBeforeUnloadHandler = (event: BeforeUnloadEvent) => {
    //         event.preventDefault();
    //         return (event.returnValue = "");
    //     };

    //     window.addEventListener("beforeunload", onBeforeUnloadHandler, {
    //         capture: true
    //     });
    // }, []);

    return (
        <>
            <Header />
            <LatestRatiosList />

            <main className="content-wrapper flex flex-auto flex-col gap-y-4 pb-8">
                <Chart />
                <BettingZone />
                <Statistics />
            </main>

            <Toaster />
        </>
    );
};
