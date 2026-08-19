import CheckIcon from "@lucide/svelte/icons/check";
import CopyIcon from "@lucide/svelte/icons/copy";
import { mount, unmount } from "svelte";

const iconProps = { size: 15, strokeWidth: 1.75, "aria-hidden": "true" } as const;

export function copyableCode(node: HTMLElement) {
  const cleanups: Array<() => void> = [];

  for (const pre of node.querySelectorAll("pre")) {
    const code = pre.querySelector("code");
    if (!code) continue;

    const frame = document.createElement("div");
    frame.className = "code-frame";
    pre.before(frame);
    frame.append(pre);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.title = "Copy code";

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
        resetTimer = setTimeout(() => void showCopyIcon(), 1600);
      } catch {
        button.setAttribute("aria-label", "Could not copy code");
        button.title = "Could not copy code";
      } finally {
        button.disabled = false;
      }
    };

    button.addEventListener("click", copy);
    frame.append(button);

    cleanups.push(() => {
      destroyed = true;
      clearTimeout(resetTimer);
      button.removeEventListener("click", copy);
      void unmount(icon);
      button.remove();
      frame.replaceWith(pre);
    });
  }

  return {
    destroy() {
      for (const cleanup of cleanups) cleanup();
    },
  };
}
