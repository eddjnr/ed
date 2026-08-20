import CheckIcon from "@lucide/svelte/icons/check";
import CodeXmlIcon from "@lucide/svelte/icons/code-xml";
import CopyIcon from "@lucide/svelte/icons/copy";
import TerminalIcon from "@lucide/svelte/icons/terminal";
import { mount, unmount } from "svelte";

const iconProps = { size: 15, strokeWidth: 1.75, "aria-hidden": "true" } as const;

const languageLabels: Record<string, string> = {
  bash: "Terminal",
  css: "CSS",
  html: "HTML",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  jsx: "JavaScript React",
  shell: "Terminal",
  sh: "Terminal",
  text: "Plain text",
  ts: "TypeScript",
  tsx: "TypeScript React",
  typescript: "TypeScript",
};

function getLanguage(code: HTMLElement): string {
  return (
    Array.from(code.classList)
      .find((className) => className.startsWith("language-"))
      ?.replace("language-", "") ?? "text"
  );
}

function extractFilename(code: HTMLElement): string | undefined {
  const content = code.textContent ?? "";
  const firstLine = content.split("\n", 1)[0]?.trim();
  const filename = firstLine?.match(
    /^(?:\/\/|#)\s+((?:[\w@.-]+[\\/])*[\w@.-]+\.(?:css|html?|jsx?|json|md|svelte|tsx?|ya?ml))$/i,
  )?.[1];

  if (!filename) return undefined;

  let remaining = content.indexOf("\n") + 1;
  if (remaining === 0) return filename;

  const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current = walker.nextNode();

  while (current && remaining > 0) {
    const text = current as Text;
    nodes.push(text);

    if (text.data.length <= remaining) {
      remaining -= text.data.length;
    } else {
      text.data = text.data.slice(remaining);
      remaining = 0;
    }

    current = walker.nextNode();
  }

  for (const text of nodes) {
    if (text.data === "") text.parentElement?.remove();
  }

  return filename.replaceAll("\\", "/");
}

export function copyableCode(node: HTMLElement) {
  const cleanups: Array<() => void> = [];

  for (const pre of node.querySelectorAll("pre")) {
    const code = pre.querySelector("code");
    if (!code) continue;

    const originalCodeHtml = code.innerHTML;
    const language = getLanguage(code);
    const title = extractFilename(code) ?? languageLabels[language] ?? language.toUpperCase();

    const frame = document.createElement("div");
    frame.className = "code-frame";
    pre.before(frame);

    const header = document.createElement("div");
    header.className = "code-header";

    const meta = document.createElement("div");
    meta.className = "code-meta";

    const languageIcon = document.createElement("span");
    languageIcon.className = "code-language-icon";
    const LanguageIcon = ["bash", "shell", "sh"].includes(language) ? TerminalIcon : CodeXmlIcon;
    const mountedLanguageIcon = mount(LanguageIcon, {
      target: languageIcon,
      props: iconProps,
    });

    const label = document.createElement("span");
    label.className = "code-title";
    label.textContent = title;

    meta.append(languageIcon, label);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.title = "Copy code";

    const status = document.createElement("span");
    status.className = "code-copy-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    let icon = mount(CopyIcon, { target: button, props: iconProps });
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    let destroyed = false;

    const showCopyIcon = async () => {
      await unmount(icon);
      if (destroyed) return;
      icon = mount(CopyIcon, { target: button, props: iconProps });
      button.classList.remove("is-copied");
      button.setAttribute("aria-label", "Copy code to clipboard");
      button.title = "Copy code";
      status.textContent = "";
    };

    const copy = async () => {
      button.disabled = true;
      clearTimeout(resetTimer);

      try {
        await navigator.clipboard.writeText(code.textContent ?? "");
        await unmount(icon);
        if (destroyed) return;
        icon = mount(CheckIcon, { target: button, props: iconProps });
        button.classList.add("is-copied");
        button.setAttribute("aria-label", "Code copied to clipboard");
        button.title = "Copied";
        status.textContent = "Code copied to clipboard";
        resetTimer = setTimeout(() => void showCopyIcon(), 1600);
      } catch {
        button.setAttribute("aria-label", "Could not copy code");
        button.title = "Could not copy code";
        status.textContent = "Could not copy code";
      } finally {
        button.disabled = false;
      }
    };

    button.addEventListener("click", copy);
    header.append(meta, button, status);
    frame.append(header, pre);

    cleanups.push(() => {
      destroyed = true;
      clearTimeout(resetTimer);
      button.removeEventListener("click", copy);
      void unmount(icon);
      void unmount(mountedLanguageIcon);
      code.innerHTML = originalCodeHtml;
      frame.replaceWith(pre);
    });
  }

  return {
    destroy() {
      for (const cleanup of cleanups) cleanup();
    },
  };
}
