import { useState, useCallback } from "react";
import { AlertTriangle, BellOff, CheckCircle2, Info, X, Megaphone } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import EmptyState from "@/components/blood/EmptyState";
import Modal from "@/components/blood/Modal";
import { toast } from "@/components/blood/Toast";
import { cn } from "@/lib/utils";
import { 
  useGetNotificationsQuery, 
  useMarkAllAsReadMutation, 
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  useRespondToBroadcastMutation
} from "@/features/notifications/notificationApiSlice";
import { useUpdateRequestStatusMutation } from "@/features/requests/requestApiSlice";

const icons = {
  request_accepted: { icon: CheckCircle2, cls: "bg-success-soft text-success" },
  request_declined: { icon: AlertTriangle, cls: "bg-primary-soft text-primary" },
  request_received: { icon: Info, cls: "bg-warning-soft text-warning" },
  broadcast: { icon: Megaphone, cls: "bg-info-soft text-info" },
  system: { icon: Info, cls: "bg-info-soft text-info" },
};

function Notifications() {
  const [isClearOpen, setIsClearOpen] = useState(false);
  const { data: response, isLoading } = useGetNotificationsQuery();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
  const [respondToBroadcast] = useRespondToBroadcastMutation();
  const [updateStatus] = useUpdateRequestStatusMutation();
  
  const handleStatus = useCallback(async (reqId, status) => {
    try {
      await updateStatus({ id: reqId, status }).unwrap();
      toast.success(`Request ${status}`);
    } catch (e) {
      toast.error("Action failed");
    }
  }, [updateStatus]);

  const items = response?.data || [];
  const unreadCount = items.filter((i) => !i.isRead).length;

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread updates`}
        actions={
          <>
            <Button
              variant="secondary"
              disabled={items.length === 0}
              onClick={() => setIsClearOpen(true)}
            >
              Clear all
            </Button>
            <Button
              variant="secondary"
              disabled={unreadCount === 0}
              onClick={async () => {
                await markAllAsRead();
                toast.success("All notifications marked as read");
              }}
            >
              Mark all read
            </Button>
          </>
        }
      />

      {items.length === 0 ? (
        <div className="surface">
          <EmptyState
            icon={BellOff}
            title="You are all caught up"
            description="New donor matches and request updates will appear here."
          />
        </div>
      ) : (
        <div className="surface divide-y divide-border">
          {items.map((n) => {
            const meta = icons[n.type] || icons.system;
            const hasResponded = n.message.includes('(Responded)');
            return (
              <div
                key={n.id}
                className={cn("flex gap-4 p-5", !n.isRead && "bg-primary-soft/40 cursor-pointer")}
                onClick={() => {
                  if (!n.isRead) markAsRead(n.id);
                }}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    meta.cls,
                  )}
                >
                  <meta.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                  
                  {n.type === 'request_received' && n.relatedRequestId && (
                     <div className="mt-3 flex gap-2">
                       {n.message.includes('(Accepted)') ? (
                         <Button size="sm" disabled>Accepted</Button>
                       ) : n.message.includes('(Declined)') ? (
                         <Button size="sm" variant="secondary" disabled>Declined</Button>
                       ) : (
                         <>
                           <Button size="sm" onClick={(e) => { e.stopPropagation(); handleStatus(n.relatedRequestId, 'accepted'); }}>Accept</Button>
                           <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleStatus(n.relatedRequestId, 'declined'); }}>Decline</Button>
                         </>
                       )}
                     </div>
                  )}

                  {n.type === 'broadcast' && (
                     <div className="mt-3 flex gap-2">
                       <Button 
                         size="sm" 
                         disabled={hasResponded}
                         onClick={async (e) => { 
                           e.stopPropagation(); 
                           if (window.confirm("Are you sure you want to respond to this broadcast alert? Admins will be notified of your availability.")) {
                             try {
                               await respondToBroadcast(n.id).unwrap();
                               toast.success("Response sent to Admins!");
                             } catch (err) {
                               toast.error(err?.data?.message || "Failed to respond");
                             }
                           }
                         }}
                       >
                         {hasResponded ? "Responded" : "I can help"}
                       </Button>
                     </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
                    onClick={async (e) => { 
                      e.stopPropagation(); 
                      await deleteNotification(n.id); 
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={isClearOpen}
        onClose={() => setIsClearOpen(false)}
        title="Clear Notifications"
        description="Are you sure you want to permanently clear all notifications? This action cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsClearOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={async () => {
                await deleteAllNotifications();
                setIsClearOpen(false);
                toast.success("All notifications cleared");
              }}
            >
              Clear All
            </Button>
          </>
        }
      />
    </UserLayout>
  );
}

export default Notifications;
