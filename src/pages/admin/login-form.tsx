import { Navigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLoginMutation } from "@/store";

export const AdminLoginForm = () => {
    const [login, { isSuccess }] = useAdminLoginMutation();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement
    > = async event => {
        event.preventDefault();

        await login({ login: "test123", password: "123456" });
    };

    if (isSuccess) {
        return <Navigate to="/admin/dashboard/replenishments" />;
    }

    return (
        <form onSubmit={onSubmitHandler}>
            <Label>
                <span>Login</span>
                <Input />
            </Label>
            <Label>
                <span>Password</span>
                <Input type="password" />
            </Label>
            <button>Login</button>
        </form>
    );
};
