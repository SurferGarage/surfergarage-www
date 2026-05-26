/** 把字标文本拆成 `.wordmark-letter` span，Hero / Footer 共用 */
export function splitWordmarkToLetters(host: HTMLElement): HTMLSpanElement[] {
  if (host.dataset.wordmarkLettersSplit === "1") {
    return Array.from(host.querySelectorAll<HTMLSpanElement>(".wordmark-letter"));
  }

  const raw = host.textContent ?? "";
  const chars = Array.from(raw);
  host.textContent = "";

  const spans: HTMLSpanElement[] = [];
  chars.forEach((c) => {
    const span = document.createElement("span");
    span.className = "wordmark-letter";
    if (c === " ") {
      span.innerHTML = "&nbsp;";
    } else {
      span.textContent = c;
    }
    host.appendChild(span);
    spans.push(span);
  });

  host.dataset.wordmarkLettersSplit = "1";
  return spans;
}
