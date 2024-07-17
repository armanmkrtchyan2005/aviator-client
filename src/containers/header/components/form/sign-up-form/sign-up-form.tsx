import { useState, useRef, useId } from "react";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    registrationCredentialsSchema as formSchema,
    RegistrationCredentialsFormSchema as FormSchema
} from "@/utils/schemas";

import {
    useCreateNewUserAccountMutation,
    useConfirmNewUserEmailMutation
} from "@/store/api/authApi";
import { handleErrorResponse } from "@/store/services";
import { TelegramClient } from "@/store/api/types";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { DialogClose } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input, Password, ErrorMessage } from "@/components/ui/input";
import { EmailTooltip } from "@/components/tooltips/email-tooltip";
import {
    ResendCodeButton,
    ResendCodeElement
} from "@/components/ui/resend-code-button";

import { CurrenciesCombobox } from "./currencies-combobox";
import { PromoCodeAccordion } from "./promo-accordeon";

import { ImSpinner9 } from "react-icons/im";
import { toast } from "@/components/toasts/toast";

interface InputCode {
    code: HTMLInputElement;
}

export const SignUpForm = () => {
    const tg = (
        window as Window & typeof globalThis & { Telegram: TelegramClient }
    ).Telegram.WebApp;

    const [verificationState, setVerificationState] = useState<{
        enabled: boolean;
        token: string | null;
    }>({ enabled: false, token: null });
    const createNewUserFormId = useId();
    const verifyEmailFormId = useId();
    const codeId = useId();
    const dialogCloseRef = useRef<HTMLButtonElement>(null);
    const resendCodeButtonRef = useRef<ResendCodeElement>(null);
    const codeInputRef = useRef<HTMLInputElement>(null);

    const [createNewUser, { isLoading: isCreating, isError, error }] =
        useCreateNewUserAccountMutation();
    const [verifyNewUserEmail, { isLoading: isVerifying }] =
        useConfirmNewUserEmailMutation();
    const navigate = useNavigate();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: "",
            password: "",
            passwordConfirm: "",
            email: undefined,
            promocode: undefined,
            accepted_terms: undefined
        }
    });

    const onSubmit: SubmitHandler<FormSchema> = async ({
        currency,
        login,
        password,
        passwordConfirm,
        email,
        promocode
    }) => {
        try {
            const { isEmailToken, token } = await createNewUser({
                currency,
                login,
                password,
                passwordConfirm,
                email,
                promocode,
                from:
                    JSON.parse(sessionStorage.getItem("referral") || "{}")
                        ?.uid || undefined,
                telegramId: tg?.initDataUnsafe?.user?.id
            }).unwrap();

            if (isEmailToken) {
                setVerificationState(state => ({
                    ...state,
                    enabled: true,
                    token: token
                }));
                toast.notify("На ваш Email отправлен код");
                resendCodeButtonRef.current?.show();
                resendCodeButtonRef.current?.disable();
                codeInputRef.current?.focus();
                return;
            }

            sessionStorage.removeItem("referral");
            navigate("/main");
            dialogCloseRef?.current?.click();
        } catch (error) {
            // handleErrorResponse(error, message => {
            //     toast.error(message);
            // });
        }
    };

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & InputCode
    > = async event => {
        event.preventDefault();

        try {
            const { code } = event.currentTarget;
            const {
                currency,
                login,
                password,
                passwordConfirm,
                email,
                promocode
            } = form.getValues();

            if (email === undefined) return;

            await verifyNewUserEmail({
                currency,
                login,
                password,
                passwordConfirm,
                email,
                promocode,
                from:
                    JSON.parse(sessionStorage.getItem("referral") || "{}")
                        ?.uid || undefined,
                telegramId: tg?.initDataUnsafe?.user?.id,
                token: verificationState.token as string,
                code: Number(code.value)
            }).unwrap();

            setVerificationState(state => ({
                ...state,
                enabled: false,
                token: null
            }));
            sessionStorage.removeItem("referral");
            navigate("/main");
            dialogCloseRef?.current?.click();
        } catch (error) {
            handleErrorResponse(error, message => {
                toast.error(message);
            });
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    id={createNewUserFormId}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Валюта</FormLabel>
                                <CurrenciesCombobox
                                    form={form}
                                    field={field}
                                />

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="login"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Логин</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Введите Email (не обязательно)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Password {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="passwordConfirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Подтвердите пароль</FormLabel>
                                <FormControl>
                                    <Password {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="promocode"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <PromoCodeAccordion
                                        form={form}
                                        field={field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="accepted_terms"
                        render={({ field: { value, ...rest } }) => (
                            <FormItem className="flex items-center gap-4 ">
                                <FormControl>
                                    <Input
                                        type="checkbox"
                                        checked={value}
                                        className="flex-grow-0 cursor-pointer appearance-none border border-slate-300"
                                        {...rest}
                                    />
                                </FormControl>
                                <p className="inline select-none text-xs">
                                    Я подтверждаю, что я ознакомлен и полностью
                                    согласен с{" "}
                                    <a
                                        href="https://telegra.ph/Publichnaya-oferta-07-06-4"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer font-semibold text-blue-500 underline-offset-2 mh:hover:underline"
                                    >
                                        Публичной офертой
                                    </a>
                                    ,{" "}
                                    <a
                                        href="https://telegra.ph/Politika-konfidencialnosti-07-06-5"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer font-semibold text-blue-500 underline-offset-2 mh:hover:underline"
                                    >
                                        Политикой конфиденциальности
                                    </a>{" "}
                                    и{" "}
                                    <a
                                        href="http://"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer font-semibold text-blue-500 underline-offset-2 mh:hover:underline"
                                    >
                                        Правилами сервиса
                                    </a>
                                </p>
                            </FormItem>
                        )}
                    />

                    {isError ? (
                        <ErrorMessage message={error?.data?.message} />
                    ) : null}

                    <DialogClose
                        className="hidden"
                        ref={dialogCloseRef}
                    />
                </form>
            </Form>
            {verificationState.enabled ? (
                <form
                    id={verifyEmailFormId}
                    onSubmit={onSubmitHandler}
                    className="mt-2 space-y-2"
                >
                    <p className="flex items-center justify-between">
                        <label htmlFor={codeId}>Код из Email</label>
                        <EmailTooltip />
                    </p>
                    <Input
                        id={codeId}
                        inputMode="numeric"
                        required
                        name="code"
                        ref={codeInputRef}
                    />
                    <ResendCodeButton
                        type="submit"
                        form={createNewUserFormId}
                        disabled={isVerifying}
                        ref={resendCodeButtonRef}
                    />
                </form>
            ) : null}
            <Button
                type="submit"
                form={
                    verificationState.enabled
                        ? verifyEmailFormId
                        : createNewUserFormId
                }
                variant="confirm"
                disabled={isCreating || isVerifying}
            >
                {isCreating ? (
                    <ImSpinner9 className="mx-auto animate-spin text-[28px]" />
                ) : (
                    "Зарегистрироваться"
                )}
            </Button>
        </>
    );
};

// interface FormProps
//     extends UseFormReturn<
//         {
//             password: string;
//             passwordConfirm: string;
//             currency: string;
//             login: string;
//             accepted_terms: true;
//             email?: string | undefined;
//             promocode?: string | undefined;
//             telegramId?: number | undefined;
//         },
//         any,
//         undefined
//     > {}

// interface Currency
//     extends ControllerRenderProps<
//         {
//             currency: string;
//             login: string;
//             password: string;
//             passwordConfirm: string;
//             accepted_terms: true;
//             email?: string | undefined;
//             promocode?: string | undefined;
//             telegramId?: number | undefined;
//         },
//         "currency"
//     > {}

// interface CurrenciesPopoverProps {
//     form: FormProps;
//     field: Currency;
// }

// const CurrenciesPopover: React.FC<CurrenciesPopoverProps> = ({
//     form,
//     field
// }) => {
//     const [open, setOpen] = useState(false);

//     return (
//         <Popover
//             open={open}
//             onOpenChange={setOpen}
//         >
//             <PopoverTrigger asChild>
//                 <FormControl>
//                     <Button
//                         role="combobox"
//                         className={cn(
//                             "w-full justify-between border-2 border-gray-500 bg-none py-4 text-base aria-[invalid=true]:border-red-750 focus:aria-[invalid=true]:outline focus:aria-[invalid=true]:-outline-offset-2",
//                             !field.value && "text-muted-foreground"
//                         )}
//                         {...field}
//                     >
//                         {field.value
//                             ? currencies.find(
//                                   currency => currency.value === field.value
//                               )?.label
//                             : "Выберите валюту"}
//                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                 </FormControl>
//             </PopoverTrigger>
//             <PopoverContent className="w-[270px] p-0">
//                 <Command>
//                     <CommandInput placeholder="Поиск валюты..." />
//                     <CommandEmpty>Валюта не найдена</CommandEmpty>
//                     <CommandGroup>
//                         {currencies.map(currency => (
//                             <CommandItem
//                                 value={currency.label}
//                                 key={currency.value}
//                                 onSelect={() => {
//                                     form.resetField("currency", {
//                                         keepError: false
//                                     });
//                                     form.setValue("currency", currency.value);

//                                     setOpen(false);
//                                 }}
//                             >
//                                 <img
//                                     src={currency.icon}
//                                     alt={currency.label}
//                                     className="mr-2 h-6 w-6"
//                                 />{" "}
//                                 {currency.label}
//                             </CommandItem>
//                         ))}
//                     </CommandGroup>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     );
// };
