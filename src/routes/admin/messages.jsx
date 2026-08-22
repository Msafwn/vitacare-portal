import { CheckCircle2, MessageSquare, Mail, Phone, Clock } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import { useGetMessagesQuery, useResolveMessageMutation } from "@/features/admin/adminApiSlice";
import StatusBadge from "@/components/blood/StatusBadge";
import Button from "@/components/blood/Button";
import { toast } from "@/components/blood/Toast";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function AdminMessages() {
  const { data: response, isLoading } = useGetMessagesQuery();
  const [resolveMessage, { isLoading: isResolving }] = useResolveMessageMutation();
  const messages = response?.data || [];

  const handleResolve = async (id) => {
    try {
      await resolveMessage(id).unwrap();
      toast.success("Message resolved");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to resolve message");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Contact Messages"
        description="Manage inquiries and support requests from the public portal."
      />

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-card">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">No messages</h3>
            <p className="mt-1 text-sm text-muted-foreground">Inbox is clear.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-border bg-muted/30 p-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-foreground">{msg.fullName}</h3>
                    <StatusBadge status={msg.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" /> {msg.email}
                    </div>
                    {msg.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" /> {msg.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> {formatDate(msg.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                    Topic: {msg.topic || "General"}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{msg.message}</p>
                
                {msg.status === "pending" && (
                  <div className="mt-6 flex justify-end">
                    <Button 
                      variant="primary" 
                      onClick={() => handleResolve(msg.id)} 
                      disabled={isResolving}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Resolved
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminMessages;
