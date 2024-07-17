export const WinToast = ({ toast }) => {
    <div className="flex h-14 w-[300px] items-center rounded-[26px] border border-[#427f00] bg-[#123405] text-white">
        <div className="pl-3 pr-2.5">
            <p className="text-xs text-[#9ea0a3]">Вы вывели средства</p>
            <p className="mt-1 text-xl font-bold leading-none">1.10x</p>
        </div>
        <div className="min-w-[120px] max-w-[120px] rounded-3xl bg-[#4eaf11] py-0.5 font-bold">
            <p className="text-xs">Выигрыш, USZ</p>
            <p className="mt-1 text-xl leading-none">111100.00</p>
        </div>
        <button
            onClick={() => toast.dismiss(t)}
            className="flex-auto"
        >
            x
        </button>
    </div>;
};
