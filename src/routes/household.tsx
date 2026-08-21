import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dayly/app-shell";
import { MemberCard, SurfaceCard, TaskCard } from "@/components/dayly/cards";
import { PageHeader, Section } from "@/components/dayly/section";
import { LoadingCards } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { daylyService, queryKeys } from "@/lib/dayly/service";

export const Route = createFileRoute("/household")({
  head: () => ({
    meta: [
      { title: "Household — Dayly" },
      {
        name: "description",
        content:
          "See who is in your household, invite one additional adult, and track who is doing what.",
      },
      { property: "og:title", content: "Household — Dayly" },
      { property: "og:description", content: "Shared tasks and members in your Dayly household." },
    ],
  }),
  component: HouseholdScreen,
});

function HouseholdScreen() {
  const membersQ = useQuery({ queryKey: queryKeys.members, queryFn: daylyService.getMembers });
  const tasksQ = useQuery({ queryKey: queryKeys.tasks, queryFn: daylyService.getTasks });
  const [inviteEmail, setInviteEmail] = useState("");
  const [open, setOpen] = useState(false);

  const nameFor = (id?: string) => membersQ.data?.find((m) => m.id === id)?.name;
  const assignedToMe = tasksQ.data?.filter((t) => t.assigneeId === "u_owner") ?? [];
  const assignedByMe = tasksQ.data?.filter((t) => t.assignedById === "u_owner") ?? [];

  return (
    <AppShell>
      <PageHeader
        title="Household"
        description="Shared items are visible to household adults. Private items never are."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="size-4" aria-hidden="true" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite an adult</DialogTitle>
                <DialogDescription>
                  They can see and manage household items once they accept. Private items stay
                  private.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="invite">Email address</Label>
                <Input
                  id="invite"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Role: Adult. Dayly households support one additional adult.
                </p>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={!inviteEmail.includes("@")}
                  onClick={() => {
                    setOpen(false);
                    toast.success("Invitation sent", {
                      description: "Access starts only after they accept.",
                    });
                  }}
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Send invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mt-6 space-y-8">
        <Section title="Members" count={membersQ.data?.length}>
          {membersQ.isPending ? (
            <LoadingCards count={2} />
          ) : (
            <div className="space-y-3">
              {membersQ.data?.map((m) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  action={
                    m.status === "pending" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Invitation resent")}
                      >
                        Resend
                      </Button>
                    ) : undefined
                  }
                />
              ))}
            </div>
          )}
        </Section>

        <SurfaceCard className="bg-muted/50">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Items marked Private are never shown to other household members, even in shared
              lists.
            </p>
          </div>
        </SurfaceCard>

        <Section title="Assignments">
          <Tabs defaultValue="mine">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mine">Assigned to me</TabsTrigger>
              <TabsTrigger value="theirs">Assigned by me</TabsTrigger>
            </TabsList>
            <TabsContent value="mine" className="mt-4 space-y-3">
              {assignedToMe.map((t) => (
                <TaskCard key={t.id} task={t} assigneeName={nameFor(t.assigneeId)} />
              ))}
            </TabsContent>
            <TabsContent value="theirs" className="mt-4 space-y-3">
              {assignedByMe.map((t) => (
                <TaskCard key={t.id} task={t} assigneeName={nameFor(t.assigneeId)} />
              ))}
            </TabsContent>
          </Tabs>
        </Section>
      </div>
    </AppShell>
  );
}
