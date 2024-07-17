import { MyBetsHistoryTable } from "@/components/tables";

export const MyBetsTabpanel = () => {
    return (
        <section>
            <h2 className="rounded-md bg-[#2c2d30] px-4 py-2 text-lg font-bold text-gray-300">
                История моих ставок
            </h2>

            <MyBetsHistoryTable />
        </section>
    );
};
