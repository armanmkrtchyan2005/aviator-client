export const formatDate = (date?: string | Date) => {
    return date
        ? new Date(date).toLocaleDateString()
        : new Date().toLocaleDateString();
};
