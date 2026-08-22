import { useState, useCallback } from "react";
import { Megaphone, RefreshCw, X } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Modal from "@/components/blood/Modal";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import StatusBadge from "@/components/blood/StatusBadge";
import { toast } from "@/components/blood/Toast";
import { BLOOD_GROUPS, CITIES } from "@/data/mock";
import { useGetBroadcastsQuery, useSendBroadcastMutation } from "@/features/admin/adminApiSlice";
import { useDeleteBroadcastMutation, useDeleteNotificationMutation } from "@/features/notifications/notificationApiSlice";

function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { data: response, isLoading, isFetching, isError, refetch } = useGetBroadcastsQuery();
  const [sendBroadcast, { isLoading: isSending }] = useSendBroadcastMutation();
  const [deleteBroadcast, { isLoading: isDeletingBroadcast }] = useDeleteBroadcastMutation();
  const [deleteNotification, { isLoading: isDeletingNotification }] = useDeleteNotificationMutation();

  const broadcasts = response?.data || [];

  const handleDelete = useCallback((n) => {
    setItemToDelete(n);
    setIsDeleteOpen(true);
  }, []);

  const executeDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'broadcast') {
        await deleteBroadcast({ title: itemToDelete.title, message: itemToDelete.body }).unwrap();
        toast.success("Broadcast history entry deleted");
      } else if (itemToDelete.type === 'response') {
        const realId = itemToDelete.id.replace('resp-', '');
        await deleteNotification(realId).unwrap();
        toast.success("Response deleted");
      }
      setIsDeleteOpen(false);
      setItemToDelete(null);
    } catch (err) {
      toast.error("Failed to delete notification alert");
    }
  }, [itemToDelete, deleteBroadcast, deleteNotification]);

  const handleSend = useCallback(async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in both the Title and Message fields.");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        message: message.trim(),
        bloodGroup: bloodGroup || "All",
        city: city || "All",
      };

      const res = await sendBroadcast(payload).unwrap();
      toast.success(`Broadcast sent successfully!`, {
        description: `Delivered to ${res.data?.sentToCount || 0} matched donors.`,
      });
      
      // Reset form and close modal
      setTitle("");
      setMessage("");
      setBloodGroup("");
      setCity("");
      setOpen(false);
    } catch (err) {
      console.error("Failed to send broadcast:", err);
      toast.error(err?.data?.message || "Failed to send broadcast alert.");
    }
  }, [title, message, bloodGroup, city, sendBroadcast]);

  return (
    <AdminLayout>
      <PageHeader
        title="Notifications"
        description="System activity and donor broadcasts."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={refetch} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Megaphone className="h-4 w-4" /> New broadcast
            </Button>
          </div>
        }
      />

      <Card>
        <h2 className="text-base font-semibold text-foreground">Recent broadcasts</h2>
        
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-red-500">Failed to load broadcast history.</div>
        ) : broadcasts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No broadcasts have been sent yet. Click "New broadcast" to create one.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {broadcasts.map((n) => (
              <div key={n.id} className="flex flex-wrap items-center gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    {n.type === 'broadcast' && n.sentToCount !== null && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                        Reached {n.sentToCount} {n.sentToCount === 1 ? "donor" : "donors"}
                      </span>
                    )}
                    {n.type === 'response' && (
                      <span className="rounded bg-success-soft px-1.5 py-0.5 text-xs text-success font-semibold">
                        Donor Replied
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{n.body}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={n.type === 'response' ? 'low' : 'completed'} />
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
                    onClick={() => handleDelete(n)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => !isSending && setOpen(false)}
        title="Send broadcast alert"
        description="Reach donors filtered by blood group and city. They will receive an in-app notification and an email."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isSending}>
              {isSending ? "Sending..." : "Send Broadcast"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Title" required>
            <Input 
              placeholder="e.g., Urgent: O- needed in Karachi" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSending}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Blood group">
              <Select 
                options={BLOOD_GROUPS} 
                placeholder="All groups" 
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                disabled={isSending}
              />
            </Field>
            <Field label="City">
              <Select 
                options={CITIES} 
                placeholder="All cities" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isSending}
              />
            </Field>
          </div>
          <Field label="Message" required>
            <Textarea 
              placeholder="Write the notification body…" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
              rows={4}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={isDeleteOpen}
        onClose={() => !isDeletingBroadcast && !isDeletingNotification && setIsDeleteOpen(false)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this item? This action cannot be undone."
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => setIsDeleteOpen(false)} 
              disabled={isDeletingBroadcast || isDeletingNotification}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={executeDelete} 
              disabled={isDeletingBroadcast || isDeletingNotification}
            >
              {isDeletingBroadcast || isDeletingNotification ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground mt-2">
          {itemToDelete?.type === 'broadcast' 
            ? "This will delete the broadcast history and remove the notification for all users who received it."
            : "This will remove this specific donor response from your history."}
        </p>
      </Modal>
    </AdminLayout>
  );
}

export default AdminNotifications;
