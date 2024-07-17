import { useChangeProfileImageMutation } from "@/store";
import { toast } from "@/components/toasts/toast";

export const UploadImage = () => {
    const [uploadImage, { isLoading }] = useChangeProfileImageMutation();

    const changeImageProfile: React.ChangeEventHandler<
        HTMLInputElement
    > = async event => {
        const input = event.currentTarget;

        if (!input.files) return;

        const file = input.files[0];

        if (file.size > 1024 * 1024) {
            toast.error("Размер файла не должен превышать 1 мб");
            input.value = "";
            return;
        }

        await uploadImage(file);
    };

    return (
        <label className="flex cursor-pointer items-center gap-x-1.5 rounded-full border border-[#414148] bg-[#252528] px-2.5 py-1.5 text-[#83878e]">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="h-5 w-5 shrink-0"
            >
                <g
                    fill="#767b85"
                    fillRule="nonzero"
                >
                    <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10a10.047 10.047 0 0 0 1.726-.151l.105-.019A10 10 0 0 0 10 0zm-.803 19.298h-.024a9.245 9.245 0 0 1-.772-.102l-.043-.007c-.25-.045-.496-.1-.74-.165l-.06-.015a9.302 9.302 0 0 1-.706-.223l-.072-.025a9.156 9.156 0 0 1-.672-.279l-.082-.037a8.437 8.437 0 0 1-.635-.33l-.089-.05a9.451 9.451 0 0 1-.6-.383l-.089-.061a9.374 9.374 0 0 1-.563-.433L4 17.144v-2.81a3.671 3.671 0 0 1 3.667-3.667h4.666A3.671 3.671 0 0 1 16 14.333v2.811l-.044.037a9.06 9.06 0 0 1-.574.442l-.079.053a9.32 9.32 0 0 1-.609.39l-.079.044a9.014 9.014 0 0 1-1.396.65l-.067.023a9.37 9.37 0 0 1-.71.224l-.057.015a9.39 9.39 0 0 1-.741.165l-.043.006c-.255.045-.513.08-.772.103h-.024a9.345 9.345 0 0 1-1.608.002zm7.47-2.772v-2.193A4.338 4.338 0 0 0 12.333 10H7.667a4.338 4.338 0 0 0-4.334 4.333v2.193a9.333 9.333 0 1 1 13.334 0z" />
                    <path d="M10 2.667a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666zm0 6a2.667 2.667 0 1 1 0-5.334 2.667 2.667 0 0 1 0 5.334z" />
                </g>
            </svg>
            <p className="grow-0 text-center text-xs leading-none">
                <span>Изменить</span>
                <br />
                <span>аватар</span>
            </p>
            <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                hidden
                disabled={isLoading}
                multiple={false}
                onChange={changeImageProfile}
            />
        </label>
    );
};
