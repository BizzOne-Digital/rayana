"use client";

import {
  AdminBadge,
  AdminButton,
  AdminHeader,
  AdminTabs,
} from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { adminFetch, adminFetchList } from "@/lib/admin/api";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ContactRow = {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  submittedAt: string;
};

type ReviewRow = {
  _id: string;
  name: string;
  email?: string;
  quote: string;
  excerpt: string;
  status: string;
  submittedAt: string;
};

function reviewStatusTone(status: string): "neutral" | "success" | "warning" | "danger" {
  if (status === "approved") return "success";
  if (status === "pending") return "warning";
  if (status === "rejected" || status === "spam") return "danger";
  return "neutral";
}

export default function AdminSubmissionsPage() {
  const [tab, setTab] = useState("contact");
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminFetchList<ContactRow>("/api/admin/submissions/contact?limit=100"),
      adminFetchList<ReviewRow>("/api/admin/submissions/reviews?limit=100"),
    ])
      .then(([contactRows, reviewRows]) => {
        setContacts(contactRows);
        setReviews(reviewRows);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load submissions"))
      .finally(() => setLoading(false));
  }, []);

  const newContactCount = useMemo(
    () => contacts.filter((item) => item.status === "new").length,
    [contacts],
  );

  const pendingReviewCount = useMemo(
    () => reviews.filter((item) => item.status === "pending").length,
    [reviews],
  );

  const updateReviewStatus = async (id: string, status: string) => {
    try {
      await adminFetch(`/api/admin/submissions/reviews?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setReviews((current) =>
        current.map((item) => (item._id === id ? { ...item, status } : item)),
      );
      toast.success(status === "approved" ? "Review approved — now live on site" : "Review updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      await adminFetch(`/api/admin/submissions/contact/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setContacts((current) =>
        current.map((item) => (item._id === id ? { ...item, status } : item)),
      );
      toast.success("Submission updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  return (
    <>
      <AdminHeader
        title="Submissions"
        description="Review contact messages and write-a-review submissions."
        breadcrumbs={[{ label: "Submissions" }]}
      />

      <AdminTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "contact", label: "Contact", count: newContactCount },
          { id: "reviews", label: "Reviews", count: pendingReviewCount },
        ]}
      />

      {tab === "contact" ? (
        <DataTable
          isLoading={loading}
          data={contacts}
          keyExtractor={(row) => row._id}
          columns={[
            {
              key: "from",
              header: "From",
              render: (row) => (
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-[var(--admin-muted)]">{row.email}</p>
                </div>
              ),
            },
            {
              key: "subject",
              header: "Subject",
              render: (row) => row.subject || "General inquiry",
            },
            {
              key: "message",
              header: "Message",
              render: (row) => (
                <p className="max-w-md truncate text-sm text-[var(--admin-muted)]">{row.message}</p>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <AdminBadge tone={row.status === "new" ? "warning" : "neutral"}>
                  {row.status}
                </AdminBadge>
              ),
            },
            {
              key: "date",
              header: "Submitted",
              render: (row) => format(new Date(row.submittedAt), "MMM d, yyyy"),
            },
            {
              key: "actions",
              header: "",
              className: "text-right",
              render: (row) => (
                <div className="flex justify-end gap-2">
                  {row.status === "new" && (
                    <AdminButton
                      size="sm"
                      variant="secondary"
                      onClick={() => updateContactStatus(row._id, "read")}
                    >
                      Mark read
                    </AdminButton>
                  )}
                  <AdminButton
                    size="sm"
                    variant="ghost"
                    onClick={() => updateContactStatus(row._id, "archived")}
                  >
                    Archive
                  </AdminButton>
                </div>
              ),
            },
          ]}
        />
      ) : (
        <DataTable
          isLoading={loading}
          data={reviews}
          keyExtractor={(row) => row._id}
          columns={[
            {
              key: "name",
              header: "Name",
              render: (row) => (
                <div>
                  <p className="font-medium">{row.name}</p>
                  {row.email && (
                    <p className="text-xs text-[var(--admin-muted)]">{row.email}</p>
                  )}
                </div>
              ),
            },
            {
              key: "review",
              header: "Review",
              render: (row) => (
                <p className="max-w-lg text-sm text-[var(--admin-muted)] whitespace-pre-wrap">
                  {row.quote || row.excerpt}
                </p>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <AdminBadge tone={reviewStatusTone(row.status)}>{row.status}</AdminBadge>
              ),
            },
            {
              key: "date",
              header: "Submitted",
              render: (row) => format(new Date(row.submittedAt), "MMM d, yyyy"),
            },
            {
              key: "actions",
              header: "",
              className: "text-right",
              render: (row) => (
                <div className="flex justify-end gap-2">
                  {row.status === "pending" && (
                    <>
                      <AdminButton
                        size="sm"
                        variant="primary"
                        onClick={() => updateReviewStatus(row._id, "approved")}
                      >
                        Approve
                      </AdminButton>
                      <AdminButton
                        size="sm"
                        variant="danger"
                        onClick={() => updateReviewStatus(row._id, "rejected")}
                      >
                        Reject
                      </AdminButton>
                    </>
                  )}
                  {row.status === "approved" && (
                    <AdminButton
                      size="sm"
                      variant="ghost"
                      onClick={() => updateReviewStatus(row._id, "rejected")}
                    >
                      Unpublish
                    </AdminButton>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}
    </>
  );
}
