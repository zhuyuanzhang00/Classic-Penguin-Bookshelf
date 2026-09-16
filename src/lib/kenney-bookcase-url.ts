import { KENNEY_BOOKCASE_GLB_BASE64 } from "@/lib/kenney-bookcase-glb";

let objectUrl: string | null = null;

export function kenneyBookcaseObjectUrl() {
  if (objectUrl) return objectUrl;
  const binary = Uint8Array.from(atob(KENNEY_BOOKCASE_GLB_BASE64), (char) =>
    char.charCodeAt(0),
  );
  objectUrl = URL.createObjectURL(
    new Blob([binary], { type: "model/gltf-binary" }),
  );
  return objectUrl;
}
