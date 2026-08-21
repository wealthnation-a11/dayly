import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, LifeBuoy, LogOut, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dayly/app-shell";
import { StatusBadge } from "@/components/dayly/badges";
import { SurfaceCard } from "@/components/dayly/cards";
import { PageHeader, Section } from "@/components/dayly/section";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/dayly/auth";
import { daylyService, queryKeys } from "@/lib/dayly/service";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Dayly" },
      {
        name: "description",
        content:
          "Manage your profile, notification channels and quiet hours, privacy and data controls, plan and support.",
      },
      { property: "og:title", content: "Settings — Dayly" },
      { property: "og:description", content: "Profile, notifications, privacy and support." },
    ],
  }),
  component: SettingsScreen,
});

const notificationCategories = [
  { id: "reminders", label: "Reminders" },
  { id: "review", label: "Review requests" },
  { id: "assignments", label: "Assignments" },
  { id: "updates", label: "Dayly updates" },
] as const;

function SettingsScreen() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const profileQ = useQuery({ queryKey: queryKeys.profile, queryFn: daylyService.getProfile });

  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [categories, setCategories] = useState<Record<string, boolean>>({
    reminders: true,
    review: true,
    assignments: true,
    updates: false,
  });
  const [quietHours, setQuietHours] = useState(true);
  const [retention, setRetention] = useState("forever");
  const [feedback, setFeedback] = useState("");

  return (
    <AppShell>
      <PageHeader title="Settings" description="Your profile, alerts, privacy and support." />

      <div className="mt-6 space-y-10">
        <Section title="Profile">
          <SurfaceCard className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={profileQ.data?.name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pemail">Email</Label>
              <Input id="pemail" type="email" defaultValue={profileQ.data?.email ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tz">Timezone</Label>
              <Input id="tz" defaultValue={profileQ.data?.timezone ?? ""} />
            </div>
            <Button onClick={() => toast.success("Profile saved")}>Save profile</Button>
          </SurfaceCard>
        </Section>

        <Section title="Notification settings">
          <SurfaceCard className="divide-y">
            <ToggleRow
              id="push"
              label="Push notifications"
              hint="On this device"
              checked={push}
              onChange={setPush}
            />
            <ToggleRow
              id="emailn"
              label="Email notifications"
              hint="Daily digest and urgent items"
              checked={email}
              onChange={setEmail}
            />
            {notificationCategories.map((c) => (
              <ToggleRow
                key={c.id}
                id={c.id}
                label={c.label}
                checked={Boolean(categories[c.id])}
                onChange={(v) => setCategories((prev) => ({ ...prev, [c.id]: v }))}
                disabled={!push && !email}
              />
            ))}
            <ToggleRow
              id="quiet"
              label="Quiet hours"
              hint="Silence alerts from 10:00 PM to 7:00 AM"
              checked={quietHours}
              onChange={setQuietHours}
            />
          </SurfaceCard>
        </Section>

        <Section title="Privacy & data">
          <SurfaceCard className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retention">Data retention</Label>
              <Select value={retention} onValueChange={setRetention}>
                <SelectTrigger id="retention">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forever">Keep until I delete it</SelectItem>
                  <SelectItem value="12">Delete captures after 12 months</SelectItem>
                  <SelectItem value="24">Delete captures after 24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={() => toast.success("Export requested")}>
              <Download className="size-4" aria-hidden="true" />
              Export my data
            </Button>
            <p className="text-sm text-muted-foreground">
              Dayly stores your information securely and never shares it without your
              authorisation.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your Dayly account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes your captures, tasks, events and household data. This
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep my account</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => toast("Deletion is disabled in this demo")}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SurfaceCard>
        </Section>

        <Section title="Plan">
          <SurfaceCard>
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="size-4.5 text-primary" aria-hidden="true" />
              <h3 className="font-bold">Your entitlement</h3>
              <StatusBadge tone="success">Active</StatusBadge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Plan details and billing are not yet configured for this build. Subscription options
              will appear here once enabled.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" disabled>
                Manage subscription
              </Button>
              <Button variant="ghost" onClick={() => toast("Nothing to restore yet")}>
                Restore purchase
              </Button>
            </div>
          </SurfaceCard>
        </Section>

        <Section title="Help & feedback">
          <SurfaceCard className="space-y-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="q1">
                <AccordionTrigger>Does Dayly add things automatically?</AccordionTrigger>
                <AccordionContent>
                  No. Dayly only proposes items. Nothing appears on Today until you confirm it.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Who can see my private items?</AccordionTrigger>
                <AccordionContent>
                  Only you. Household members see items marked Household.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>What can I capture?</AccordionTrigger>
                <AccordionContent>
                  Photos, documents, typed or pasted notes, voice memos, and forwarded email.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="space-y-2">
              <Label htmlFor="feedback">Send feedback or report an issue</Label>
              <Textarea
                id="feedback"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what happened or what would help"
              />
              <Button
                disabled={feedback.trim().length < 5}
                onClick={() => {
                  setFeedback("");
                  toast.success("Thanks — feedback sent");
                }}
              >
                <LifeBuoy className="size-4" aria-hidden="true" />
                Send
              </Button>
            </div>
          </SurfaceCard>
        </Section>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            signOut();
            void navigate({ to: "/signin" });
          }}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>
    </AppShell>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <Label htmlFor={id} className="font-semibold">
          {label}
        </Label>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
