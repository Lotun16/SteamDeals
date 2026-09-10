import { useRef, useEffect } from "react";

const useAutoFocus = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.querySelector('input')?.focus();
    }, []);

    return ref;
};

export default useAutoFocus;
