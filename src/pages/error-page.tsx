import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
    const error = useRouteError();

    return (
        <section>
            <h1>Что-то пошло не так</h1>
            <p>Обратитесь к администрации сайта</p>
            <pre>{error?.message}</pre>
        </section>
    );
};
