import { KeyboardEvent } from "react";

// A function that executes a callback function when the enter key is pressed
export function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>, callback: () => void) {
  if (event.key === "Enter") {
    event.preventDefault();
    callback();
  }
}
