import ReactDOM from "react-dom";

export interface PortalElement extends React.HTMLAttributes<HTMLElement> {
    renderElement?: HTMLElement | null;
}

export const Portal: React.FC<PortalElement> = ({
    children,
    renderElement
}) => {
    return ReactDOM.createPortal(children, renderElement || document.body);
};
