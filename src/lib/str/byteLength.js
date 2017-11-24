export default function(str) {
    return (str || "").replace(/[^\x00-\xff]/g, "aa").length;
}