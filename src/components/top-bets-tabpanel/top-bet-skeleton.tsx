export const TopBetSkeleton = () => {
    return (
        <li className="grid grid-cols-[1fr_4fr] grid-rows-[auto_auto] place-items-center overflow-hidden rounded-md bg-[#101112] text-xs text-[#9ea0a3] sm:grid-cols-[3fr_7fr]">
            <div className="h-[68px] space-y-2">
                <div className="size-10 animate-pulse rounded-full bg-slate-400" />
                <p className="h-3 animate-pulse rounded-full bg-slate-400" />
            </div>
            <table className="w-full table-fixed">
                <tbody>
                    <tr>
                        <td className="h-7 px-1 py-0 text-right">
                            <p className="inline-block h-3 w-20 animate-pulse rounded-full bg-slate-400" />
                        </td>
                        <td className="h-7 px-1 py-0 text-left">
                            <p className="inline-block h-3 w-14 animate-pulse rounded-full bg-slate-400" />
                        </td>
                    </tr>
                    <tr>
                        <td className="h-6 px-1 py-0 text-right">
                            <p className="inline-block h-3 w-20 animate-pulse rounded-full bg-slate-400" />
                        </td>
                        <td className="h-6 px-1 py-0 text-left">
                            <p className="inline-block h-3 w-14 animate-pulse rounded-full bg-slate-400" />
                        </td>
                    </tr>
                    <tr>
                        <td className="h-7 px-1 py-0 text-right">
                            <p className="inline-block h-3 w-20 animate-pulse rounded-full bg-slate-400" />
                        </td>
                        <td className="h-7 px-1 py-0 text-left">
                            <p className="inline-block h-3 w-14 animate-pulse rounded-full bg-slate-400" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="col-span-2 flex h-8 w-full items-center space-x-4 bg-black text-start">
                <p className="ml-2 inline-block h-3 w-25 animate-pulse rounded-full bg-slate-400" />
                <p className="inline-block h-3 w-20 animate-pulse rounded-full bg-slate-400" />
            </div>
        </li>
    );
};
