"use client";

import {
  AdminBadge,
  AdminButton,
  AdminField,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminHeader";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { PAGE_SECTION_TYPES } from "@/lib/constants";
import type { Button, ImageMedia, PageSection } from "@/models/shared";
import { cn } from "@/lib/utils";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, GripVertical, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type SectionEditorProps = {
  sections: PageSection[];
  onChange: (sections: PageSection[]) => void;
};

function emptyImage(): ImageMedia {
  return { url: "", alt: "", width: 1200, height: 800, mimeType: "image/jpeg" };
}

function emptyButton(): Button {
  return { label: "", href: "", variant: "primary", openInNewTab: false };
}

function SortableSection({
  section,
  expanded,
  onToggle,
  onUpdate,
  onRemove,
}: {
  section: PageSection;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (next: PageSection) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const images = section.images ?? [];

  const updateImage = (index: number, patch: Partial<ImageMedia>) => {
    const next = [...images];
    next[index] = { ...next[index], ...patch };
    onUpdate({ ...section, images: next });
  };

  const buttons = section.buttons ?? [];

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--admin-border)] bg-white",
        isDragging && "shadow-lg ring-2 ring-[var(--admin-accent-soft)]",
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]/50 px-3 py-3">
        <button
          type="button"
          className="cursor-grab rounded p-1 text-[var(--admin-muted)] hover:bg-white active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[var(--admin-muted)] transition-transform",
              expanded && "rotate-180",
            )}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--admin-text)]">
              {section.label || section.heading || section.type}
            </p>
            <p className="truncate text-xs text-[var(--admin-muted)]">
              {section.type} · {section.id}
            </p>
          </div>
        </button>
        <AdminBadge tone={section.enabled ? "success" : "neutral"}>
          {section.enabled ? "Enabled" : "Hidden"}
        </AdminBadge>
        <AdminButton variant="ghost" size="sm" onClick={onRemove} aria-label="Remove section">
          <Trash2 className="h-4 w-4" />
        </AdminButton>
      </div>

      {expanded && (
        <div className="space-y-5 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Section label">
              <AdminInput
                value={section.label ?? ""}
                onChange={(event) => onUpdate({ ...section, label: event.target.value })}
              />
            </AdminField>
            <AdminField label="Section type">
              <select
                value={section.type}
                onChange={(event) => onUpdate({ ...section, type: event.target.value })}
                className="w-full rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm"
              >
                {PAGE_SECTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Eyebrow">
              <AdminInput
                value={section.eyebrow ?? ""}
                onChange={(event) => onUpdate({ ...section, eyebrow: event.target.value })}
              />
            </AdminField>
            <AdminField label="Heading">
              <AdminInput
                value={section.heading ?? ""}
                onChange={(event) => onUpdate({ ...section, heading: event.target.value })}
              />
            </AdminField>
            <AdminField label="Layout variant">
              <AdminInput
                value={section.layoutVariant ?? ""}
                onChange={(event) =>
                  onUpdate({ ...section, layoutVariant: event.target.value })
                }
              />
            </AdminField>
            <AdminField label="Theme variant">
              <AdminInput
                value={section.themeVariant ?? ""}
                onChange={(event) =>
                  onUpdate({ ...section, themeVariant: event.target.value })
                }
              />
            </AdminField>
          </div>

          <AdminField label="Body (rich text)">
            <RichTextEditor
              value={section.body ?? ""}
              onChange={(body) => onUpdate({ ...section, body })}
            />
          </AdminField>

          <AdminField label="Images">
            <div className="space-y-4">
              {images.map((image, index) => (
                <div
                  key={`${section.id}-image-${index}`}
                  className="rounded-lg border border-[var(--admin-border)] p-4 space-y-3"
                >
                  <LocalImageField
                    label={`Image ${index + 1}`}
                    folder="pages"
                    value={image.url}
                    onChange={(url) => updateImage(index, { url })}
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <AdminField label="Alt text">
                      <AdminInput
                        value={image.alt ?? ""}
                        onChange={(event) => updateImage(index, { alt: event.target.value })}
                      />
                    </AdminField>
                    <AdminField label="Caption">
                      <AdminInput
                        value={image.caption ?? ""}
                        onChange={(event) =>
                          onUpdate({
                            ...section,
                            images: images.map((img, i) =>
                              i === index ? { ...img, caption: event.target.value } : img,
                            ),
                          })
                        }
                      />
                    </AdminField>
                  </div>
                  <AdminButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onUpdate({
                        ...section,
                        images: images.filter((_, i) => i !== index),
                      })
                    }
                  >
                    Remove image slot
                  </AdminButton>
                </div>
              ))}
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onUpdate({ ...section, images: [...images, emptyImage()] })}
              >
                <Plus className="h-4 w-4" />
                Add image
              </AdminButton>
            </div>
          </AdminField>

          <AdminField label="Buttons">
            <div className="space-y-3">
              {buttons.map((button, index) => (
                <div
                  key={`${section.id}-btn-${index}`}
                  className="grid gap-3 rounded-lg border border-[var(--admin-border)] p-3 md:grid-cols-2"
                >
                  <AdminInput
                    placeholder="Label"
                    value={button.label}
                    onChange={(event) => {
                      const next = [...buttons];
                      next[index] = { ...button, label: event.target.value };
                      onUpdate({ ...section, buttons: next });
                    }}
                  />
                  <AdminInput
                    placeholder="Href"
                    value={button.href}
                    onChange={(event) => {
                      const next = [...buttons];
                      next[index] = { ...button, href: event.target.value };
                      onUpdate({ ...section, buttons: next });
                    }}
                  />
                  <select
                    value={button.variant ?? "primary"}
                    onChange={(event) => {
                      const next = [...buttons];
                      next[index] = {
                        ...button,
                        variant: event.target.value as Button["variant"],
                      };
                      onUpdate({ ...section, buttons: next });
                    }}
                    className="rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm"
                  >
                    <option value="primary">primary</option>
                    <option value="secondary">secondary</option>
                    <option value="ghost">ghost</option>
                    <option value="link">link</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={button.openInNewTab ?? false}
                      onChange={(event) => {
                        const next = [...buttons];
                        next[index] = { ...button, openInNewTab: event.target.checked };
                        onUpdate({ ...section, buttons: next });
                      }}
                    />
                    Open in new tab
                  </label>
                </div>
              ))}
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  onUpdate({ ...section, buttons: [...buttons, emptyButton()] })
                }
              >
                Add button
              </AdminButton>
            </div>
          </AdminField>

          <AdminField label="Items (JSON)">
            <AdminTextarea
              rows={6}
              value={JSON.stringify(section.items ?? [], null, 2)}
              onChange={(event) => {
                try {
                  const parsed = JSON.parse(event.target.value) as unknown;
                  onUpdate({ ...section, items: Array.isArray(parsed) ? parsed : [] });
                } catch {
                  // keep typing
                }
              }}
            />
          </AdminField>

          <AdminField label="Settings (JSON)">
            <AdminTextarea
              rows={4}
              value={JSON.stringify(section.settings ?? {}, null, 2)}
              onChange={(event) => {
                try {
                  const parsed = JSON.parse(event.target.value) as Record<string, unknown>;
                  onUpdate({ ...section, settings: parsed });
                } catch {
                  // keep typing
                }
              }}
            />
          </AdminField>

          <label className="flex items-center gap-2 text-sm text-[var(--admin-text)]">
            <input
              type="checkbox"
              checked={section.enabled ?? true}
              onChange={(event) => onUpdate({ ...section, enabled: event.target.checked })}
              className="rounded border-[var(--admin-border)] text-[var(--admin-accent)]"
            />
            Show this section on the published page
          </label>
        </div>
      )}
    </div>
  );
}

export function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [sections],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedSections.findIndex((section) => section.id === active.id);
    const newIndex = sortedSections.findIndex((section) => section.id === over.id);
    const reordered = arrayMove(sortedSections, oldIndex, newIndex).map((section, index) => ({
      ...section,
      order: index,
    }));
    onChange(reordered);
  };

  const updateSection = (id: string, next: PageSection) => {
    onChange(sortedSections.map((section) => (section.id === id ? next : section)));
  };

  const removeSection = (id: string) => {
    onChange(sortedSections.filter((section) => section.id !== id));
    setCollapsedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  };

  const addSection = () => {
    const next: PageSection = {
      id: uuidv4(),
      type: "richText",
      label: "New section",
      enabled: true,
      order: sortedSections.length,
      eyebrow: "",
      heading: "",
      body: "",
      buttons: [],
      images: [],
      items: [],
      settings: {},
    };
    onChange([...sortedSections, next]);
  };

  const expandAll = () => setCollapsedIds(new Set());
  const collapseAll = () => setCollapsedIds(new Set(sortedSections.map((s) => s.id)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--admin-text)]">Page sections</h3>
          <p className="text-sm text-[var(--admin-muted)]">
            All sections are listed below. Use Publish to push changes to the live site.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton type="button" variant="secondary" size="sm" onClick={expandAll}>
            Expand all
          </AdminButton>
          <AdminButton type="button" variant="secondary" size="sm" onClick={collapseAll}>
            Collapse all
          </AdminButton>
          <AdminButton type="button" onClick={addSection}>
            <Plus className="h-4 w-4" />
            Add section
          </AdminButton>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortedSections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sortedSections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                expanded={!collapsedIds.has(section.id)}
                onToggle={() =>
                  setCollapsedIds((current) => {
                    const next = new Set(current);
                    if (next.has(section.id)) next.delete(section.id);
                    else next.add(section.id);
                    return next;
                  })
                }
                onUpdate={(next) => updateSection(section.id, next)}
                onRemove={() => removeSection(section.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
