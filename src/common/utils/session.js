import { v4 as uuidv4 } from "uuid";

export function getSessionId() {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}
