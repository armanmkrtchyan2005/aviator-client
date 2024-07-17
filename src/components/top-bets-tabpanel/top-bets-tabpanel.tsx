import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TopBetsTab } from "./top-bets-tab";

export const TopBetsTabpanel = () => {
    return (
        <Tabs defaultValue="day">
            <TabsList className="mt-4">
                <TabsTrigger value="day">День</TabsTrigger>
                <TabsTrigger value="month">Месяц</TabsTrigger>
                <TabsTrigger value="year">Год</TabsTrigger>
            </TabsList>
            <TabsContent value="day">
                <TopBetsTab dateSort="day" />
            </TabsContent>
            <TabsContent value="month">
                <TopBetsTab dateSort="month" />
            </TabsContent>
            <TabsContent value="year">
                <TopBetsTab dateSort="year" />
            </TabsContent>
        </Tabs>
    );
};
