type TimeFormat = "%H:%M" | "%H:%M:%S";

type DateFormat = string | Date;

const timeFormat: Record<TimeFormat, (date: DateFormat) => string> = {
    "%H:%M": (date: DateFormat) =>
        new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        }),
    "%H:%M:%S": (date: DateFormat) =>
        new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })
};

export const formatTime = (
    date: DateFormat | undefined,
    format: TimeFormat = "%H:%M"
) => {
    return date ? timeFormat[format](date) : "";
};
