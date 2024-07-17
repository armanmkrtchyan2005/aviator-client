import { useState } from "react";

import { Popover } from "@/components/ui/popover/popover";
import { PaymentDrawDialog } from "@/components/dialogs/payment-draw-dialog";
import { DrawHistoryPopover } from "@/components/popovers";

import { useGetUserQuery } from "@/store/api/userApi";

import {
    useFetchRequisitesQuery,
    useFetchRecommendedRequisitesQuery
} from "@/api/requisite";

import { ClipboardCopy } from "@/components/ui/clipboard-copy";
import { PaymentMethod, TechnicalSupport } from "./components";
import { PreviousRouteLink } from "@/components/previous-route-link";

export const PaymentDrawPage = () => {
    const [renderElement, setRenderElement] = useState<HTMLDivElement | null>(
        null
    );
    const [paymentDrawDialogOpen, setPaymentDrawDialogOpen] = useState(false);
    const [selectedRequisiteId, setSelectedRequisiteId] = useState<
        string | null
    >(null);

    const { data: user } = useGetUserQuery();
    const { data: requisites, isSuccess: isRequisitesRequestSuccess } =
        useFetchRequisitesQuery({ type: "withdrawal" });
    const {
        data: recommendedRequisites,
        isSuccess: isRecommendedRequisitesRequestSuccess
    } = useFetchRecommendedRequisitesQuery({ type: "withdrawal" });

    return (
        <>
            <h1 className="relative text-2xl font-bold">
                <PreviousRouteLink
                    to="/main"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-2xl"
                />
                Вывод
            </h1>

            <article className="relative mt-6 flex-auto space-y-3 rounded-2.5xl bg-white px-2 pb-8 pt-4 text-black xs:px-4">
                <header className="grid grid-cols-2 grid-rows-2 items-start">
                    <p className="justify-self-start leading-5">Все методы</p>
                    <p className="justify-self-start text-sm leading-5 text-slate-400 ">
                        <span>ID</span>{" "}
                        <ClipboardCopy
                            textToCopy={user?.uid}
                            className="inline-block max-w-32 overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                        >
                            {user?.uid || ""}
                        </ClipboardCopy>
                    </p>
                    <div
                        ref={setRenderElement}
                        className="relative col-start-2 col-end-3 row-start-1 row-end-3 inline-block justify-self-end"
                    >
                        <Popover>
                            <Popover.Trigger className="bg-slate-300/70 px-3 py-1.5 leading-none transition-colors duration-300 mh:hover:bg-slate-300/60">
                                История
                            </Popover.Trigger>
                            <Popover.Portal renderElement={renderElement}>
                                <Popover.Content className="bg-transparent">
                                    <DrawHistoryPopover />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover>
                    </div>
                </header>
                <section>
                    <h2 className="text-lg uppercase text-slate-400">
                        Рекомендуемые методы
                    </h2>
                    {isRecommendedRequisitesRequestSuccess ? (
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {recommendedRequisites.map(requisite => (
                                <PaymentMethod
                                    key={requisite._id}
                                    requisite={requisite}
                                    onClick={() => {
                                        setPaymentDrawDialogOpen(true);
                                        setSelectedRequisiteId(requisite._id);
                                    }}
                                />
                            ))}
                        </ul>
                    ) : null}
                </section>

                {isRequisitesRequestSuccess
                    ? requisites.map(requisite => (
                          <section key={requisite.currency}>
                              <h2 className="text-lg uppercase text-slate-400">
                                  Методы {requisite.currency}
                              </h2>
                              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                  {requisite.requisites.map(method => (
                                      <PaymentMethod
                                          key={method._id}
                                          requisite={method}
                                          onClick={() => {
                                              setPaymentDrawDialogOpen(true);
                                              setSelectedRequisiteId(
                                                  method._id
                                              );
                                          }}
                                      />
                                  ))}
                              </ul>
                          </section>
                      ))
                    : null}

                <TechnicalSupport />

                <PaymentDrawDialog
                    open={paymentDrawDialogOpen}
                    setOpen={setPaymentDrawDialogOpen}
                    selectedRequisiteId={selectedRequisiteId}
                />
            </article>
        </>
    );
};
