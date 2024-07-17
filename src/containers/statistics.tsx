import { Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";
import GridLoader from "react-spinners/GridLoader";

import { useAuth } from "@/store";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AllBetsTabpanel = lazy(() =>
    import("@/components/all-bets-tabpanel/all-bets-tabpanel").then(module => ({
        default: module.AllBetsTabpanel
    }))
);

const MyBetsTabpanel = lazy(() =>
    import("@/components/my-bets-tabpanel").then(module => ({
        default: module.MyBetsTabpanel
    }))
);

const TopBetsTabpanel = lazy(() =>
    import("@/components/top-bets-tabpanel/top-bets-tabpanel").then(module => ({
        default: module.TopBetsTabpanel
    }))
);

export const Statistics = () => {
    const { isAuthenticated } = useAuth();

    const { ref, inView } = useInView({
        triggerOnce: true,
        fallbackInView: true,
        threshold: 0
    });

    return (
        <Tabs
            defaultValue="all"
            className="min-h-3 rounded-2.5xl"
        >
            <>
                <TabsList ref={ref}>
                    <TabsTrigger value="all">Все ставки</TabsTrigger>
                    {isAuthenticated ? (
                        <TabsTrigger value="my">Мои</TabsTrigger>
                    ) : null}

                    <TabsTrigger value="top">Топ</TabsTrigger>
                </TabsList>
                <Suspense
                    fallback={
                        <div className="mt-5 min-h-[305px]">
                            <GridLoader color="red" />
                        </div>
                    }
                >
                    {inView ? (
                        <>
                            <TabsContent
                                value="all"
                                className="mt-5 gap-x-1 gap-y-2 rounded-2.5xl bg-black-50 py-5"
                            >
                                <AllBetsTabpanel />
                            </TabsContent>
                            {isAuthenticated ? (
                                <TabsContent
                                    value="my"
                                    className="mt-5 gap-x-1 gap-y-2 overflow-hidden rounded-2.5xl bg-black-50 pb-5 text-lg"
                                >
                                    <MyBetsTabpanel />
                                </TabsContent>
                            ) : null}
                            <TabsContent
                                value="top"
                                className="mt-5 gap-x-1 gap-y-2 overflow-hidden rounded-2.5xl bg-black-50 pb-5 text-lg"
                            >
                                <TopBetsTabpanel />
                            </TabsContent>
                        </>
                    ) : (
                        <div className="h-10" />
                    )}
                </Suspense>
            </>
        </Tabs>
    );
};
