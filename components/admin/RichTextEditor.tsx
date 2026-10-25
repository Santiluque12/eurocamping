"use client";

import { useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Minus, Quote, Redo2, Undo2,
} from "lucide-react";
import { Field, inputCls } from "./fields";
import { btn, useMarkDirty } from "./form";
import { MediaLibrary } from "./media";

/**
 * Editor sencillo para el cuerpo de las publicaciones. Guarda HTML que el
 * servidor vuelve a sanitizar antes de guardarlo y al mostrarlo.
 */
export function RichTextEditor({ name, label, defaultValue, help }: { name: string; label: string; defaultValue: string; help?: string }) {
  const [html, setHtml] = useState(defaultValue);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const markDirty = useMarkDirty();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, protocols: ["https", "mailto"], defaultProtocol: "https" },
      }),
      Image.configure({ inline: false }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "rich-text min-h-[320px] px-4 py-3 focus:outline-none text-base",
        "aria-label": label,
      },
    },
    onUpdate: ({ editor }) => {
      setHtml(editor.isEmpty ? "" : editor.getHTML());
      markDirty();
    },
  });

  return (
    <Field label={label} name={name} help={help}>
      <input type="hidden" name={name} value={html} />
      <div className="rounded-xl border border-[#d1d5db] bg-white focus-within:border-[#F5A623] focus-within:ring-2 focus-within:ring-[#F5A623]/30">
        {editor && <Toolbar editor={editor} onImage={() => setLibraryOpen(true)} onLink={() => setLinkOpen((v) => !v)} />}
        {editor && linkOpen && <LinkBar editor={editor} onClose={() => setLinkOpen(false)} />}
        <EditorContent editor={editor} />
      </div>
      <MediaLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={(m) => {
          setLibraryOpen(false);
          editor?.chain().focus().setImage({ src: m.url, alt: m.alt }).run();
        }}
      />
    </Field>
  );
}

function Toolbar({ editor, onImage, onLink }: { editor: Editor; onImage: () => void; onLink: () => void }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const b = (label: string, icon: React.ReactNode, onClick: () => void, active?: boolean, disabled?: boolean) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`p-2 rounded-lg ${active ? "bg-[#FFF3DC] text-[#1a1a1a]" : "text-[#4b5563] hover:bg-[#f3f4f6]"} disabled:opacity-30`}
    >
      {icon}
    </button>
  );
  const c = () => editor.chain().focus();
  return (
    <div className="flex flex-wrap gap-0.5 border-b border-[#e5e7eb] p-1.5 sticky top-14 lg:top-0 bg-white rounded-t-xl z-10">
      {b("Negrita", <Bold size={18} />, () => c().toggleBold().run(), state.bold)}
      {b("Cursiva", <Italic size={18} />, () => c().toggleItalic().run(), state.italic)}
      {b("Subtítulo", <Heading2 size={18} />, () => c().toggleHeading({ level: 2 }).run(), state.h2)}
      {b("Subtítulo menor", <Heading3 size={18} />, () => c().toggleHeading({ level: 3 }).run(), state.h3)}
      {b("Lista con viñetas", <List size={18} />, () => c().toggleBulletList().run(), state.bullet)}
      {b("Lista numerada", <ListOrdered size={18} />, () => c().toggleOrderedList().run(), state.ordered)}
      {b("Cita", <Quote size={18} />, () => c().toggleBlockquote().run(), state.quote)}
      {b("Enlace", <Link2 size={18} />, onLink, state.link)}
      {b("Insertar imagen", <ImagePlus size={18} />, onImage)}
      {b("Separador", <Minus size={18} />, () => c().setHorizontalRule().run())}
      <span className="mx-1 w-px bg-[#e5e7eb]" />
      {b("Deshacer", <Undo2 size={18} />, () => c().undo().run(), false, !state.canUndo)}
      {b("Rehacer", <Redo2 size={18} />, () => c().redo().run(), false, !state.canRedo)}
    </div>
  );
}

function LinkBar({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [url, setUrl] = useState<string>(editor.getAttributes("link").href ?? "");
  const [error, setError] = useState<string | null>(null);
  const apply = () => {
    const v = url.trim();
    if (!v) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      onClose();
      return;
    }
    if (!/^(https:\/\/|mailto:)[^\s]+$/.test(v)) {
      setError("El enlace debe empezar con https:// (o mailto:)");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: v }).run();
    onClose();
  };
  return (
    <div className="flex flex-col sm:flex-row gap-2 border-b border-[#e5e7eb] p-2 bg-[#f9fafb]">
      <input
        className={inputCls}
        placeholder="https://…"
        value={url}
        autoFocus
        onChange={(e) => {
          setUrl(e.target.value);
          setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            apply();
          }
        }}
      />
      <div className="flex gap-2">
        <button type="button" className={btn.primary} onClick={apply}>
          Aplicar
        </button>
        <button type="button" className={btn.secondary} onClick={onClose}>
          Cancelar
        </button>
      </div>
      {error && <p className="text-sm text-red-700 sm:self-center">{error}</p>}
    </div>
  );
}
