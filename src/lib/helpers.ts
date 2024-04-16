import { base } from "$app/paths";
import type { Message, Person } from "./definitions";

export function getDisplayTime(date = new Date()) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${formattedHours}:${formattedMinutes}`;
}

export function to12(military: string): string {
    const [hoursString, minutesString] = military.split(":");
    const hours = parseInt(hoursString, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    const standardHour = hours % 12 || 12; 
    return `${standardHour}:${minutesString} ${ampm}`;
}

export function setMessageType(message: Message | string, type: "text" | "image" | "label"): Message | string {
    if (typeof message === "string") {
        if (type === "image") return {
            sender: 0,
            time: getDisplayTime(),
            header: true,
            src: `${base}/img.png`
        }; else if (type === "text") return {
            sender: 0,
            time: getDisplayTime(),
            header: true,
            text: ""
        }; else return message;
    } else if (type === "image") {
        delete message.text;
        message.src = `${base}/img.png`;
        return message;
    } else if (type === "text") {
        delete message.src;
        message.text = "";
        return message;
    } else return "";
}

export function getMessageType(message: Message | string): "text" | "image" | "label" {
    if (typeof message === "string") return "label";
    if (message.src && !message.text) return "image";
    else return "text";
}

export function getNewMessage(convo: (Message | string)[]): Message | string {
    if (convo.length) {
        const last = convo[convo.length - 1];
        if (typeof last === "string") return last;
        return { ...last };
    }
    return {
        sender: 0,
        time: getDisplayTime(),
        header: true,
        text: ""
    };
}

export function setSrc(files: FileList, update: (src: string) => void) {
    var reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => update(event.target?.result as string);
    reader.readAsDataURL(files[0]);
}