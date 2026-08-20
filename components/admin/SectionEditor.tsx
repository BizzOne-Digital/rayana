"use client";

import {
  AdminBadge,
  AdminButton,
  AdminField,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminHeader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { PAGE_SECTION_TYPES } from "@/lib/constants";
import type { PageSection } from "@/models/shared";
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
            <p className="truncate text-xs text-[var(--admin-muted)]">{section.type}</p>
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
        <div className="space-y-4 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Section label">
              <AdminInput
                value={section.label ?? ""}
                onChange={(event) =>
                  onUpdate({ ...section, label: event.target.value })
                }
              />
            </AdminField>
            <AdminField label="Section type">
              <select
                value={section.type}
                onChange={(event) =>
                  onUpdate({ ...section, type: event.target.value })
                }
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
                onChange={(event) =>
                  onUpdate({ ...section, eyebrow: event.target.value })
                }
              />
            </AdminField>
            <AdminField label="Heading">
              <AdminInput
                value={section.heading ?? ""}
                onChange={(event) =>
                  onUpdate({ ...section, heading: event.target.value })
                }
              />
            </AdminField>
          </div>

          <AdminField label="Body">
            <RichTextEditor
              value={section.body ?? ""}
              onChange={(body) => onUpdate({ ...section, body })}
            />
          </AdminField>

          <AdminField label="Plain text fallback">
            <AdminTextarea
              value={section.body ?? ""}
              onChange={(event) => onUpdate({ ...section, body: event.target.value })}
              rows={4}
            />
          </AdminField>

          <label className="flex items-center gap-2 text-sm text-[var(--admin-text)]">
            <input
              type="checkbox"
              checked={section.enabled ?? true}
              onChange={(event) =>
                onUpdate({ ...section, enabled: event.target.checked })
              }
              className="rounded border-[var(--admin-border)] text-[var(--admin-accent)]"
            />
            Show this section on the page
          </label>
        </div>
      )}
    </div>
  );
}

export function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    sections[0]?.id ?? null,
  );

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
    const reordered = arrayMove(sortedSections, oldIndex, newIndex).map(
      (section, index) => ({ ...section, order: index }),
    );
    onChange(reordered);
  };

  const updateSection = (id: string, next: PageSection) => {
    onChange(sortedSections.map((section) => (section.id === id ? next : section)));
  };

  const removeSection = (id: string) => {
    onChange(sortedSections.filter((section) => section.id !== id));
    if (expandedId === id) setExpandedId(null);
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
    setExpandedId(next.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--admin-text)]">Page sections</h3>
          <p className="text-sm text-[var(--admin-muted)]">
            Drag to reorder. Expand a section to edit its content.
          </p>
        </div>
        <AdminButton type="button" onClick={addSection}>
          <Plus className="h-4 w-4" />
          Add section
        </AdminButton>
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
                expanded={expandedId === section.id}
                onToggle={() =>
                  setExpandedId((current) => (current === section.id ? null : section.id))
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
