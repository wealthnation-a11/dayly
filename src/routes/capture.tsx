import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, FileText, Loader2, Mail, Mic, PenLine, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dayly/app-shell";
import { FileCard, SurfaceCard } from "@/components/dayly/cards";
import { PageHeader, Section } from "@/components/dayly/section";
import { LoadingCards } from "@/components/dayly/states";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { daylyService, queryKeys } from "@/lib/dayly/service";

export const Route = createFileRoute("/capture")({
  head: () => ({
    meta: [
      { title: "Capture — Dayly" },
      {
        name: "description",
        content:
          "Capture a photo, document, note or voice memo. Dayly reads it and proposes items for you to approve.",
      },
      { property: "og:title", content: "Capture — Dayly" },
      { property: "og:description", content: "Give Dayly information in any format." },
    ],
  }),
  component: CaptureScreen,
});

type Mode = "photo" | "document" | "text" | "voice";

const modeCopy: Record<Mode, { label: string; hint: string; Icon: typeof Camera }> = {
  photo: {
    label: "Photo",
    hint: "Snap a notice, letter, invitation or whiteboard.",
    Icon: Camera,
  },
  document: {
    label: "Document",
    hint: "Attach a PDF or scan you already have.",
    Icon: FileText,
  },
  text: { label: "Note", hint: "Type or paste anything you want remembered.", Icon: PenLine },
  voice: { label: "Voice", hint: "Speak it and Dayly will transcribe the details.", Icon: Mic },
};

function CaptureScreen() {
  const navigate = useNavigate();
  const filesQ = useQuery({ queryKey: queryKeys.files, queryFn: daylyService.getFiles });
  const [mode, setMode] = useState<Mode>("photo");
  const [note, setNote] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [pickedName, setPickedName] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  const docInput = useRef<HTMLInputElement>(null);

  function onPick(file: File | undefined) {
    if (!file) return;
    setPickedName(file.name);
    setSelectedFile(file.name);
  }

  const canSubmit =
    mode === "text" ? note.trim().length > 3 : mode === "voice" ? recording : Boolean(selectedFile);

  function submit() {
    setProcessing(true);
    window.setTimeout(() => {
      setProcessing(false);
      toast.success("Dayly is done reading", {
        description: "Review the proposed items before anything is added.",
      });
      void navigate({ to: "/review" });
    }, 1600);
  }

  return (
    <AppShell>
      <PageHeader
        title="Capture"
        description="Give Dayly information in any format. Nothing is added to your day until you approve it."
      />

      <div className="mt-6 space-y-8">
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList className="grid w-full grid-cols-4">
            {(Object.keys(modeCopy) as Mode[]).map((key) => {
              const { label, Icon } = modeCopy[key];
              return (
                <TabsTrigger key={key} value={key} className="gap-1.5">
                  <Icon className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <p className="mt-3 text-sm text-muted-foreground">{modeCopy[mode].hint}</p>

          <TabsContent value="photo" className="mt-4">
            <SurfaceCard className="border-dashed">
              <div className="flex flex-col items-center py-8 text-center">
                <span className="grid size-16 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Camera className="size-7" aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm text-muted-foreground">
                  {pickedName ?? "Take a photo, or choose one from your library."}
                </p>
                <input
                  ref={photoInput}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => onPick(e.target.files?.[0])}
                />
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => photoInput.current?.click()}
                >
                  {pickedName ? "Choose a different photo" : "Take or choose a photo"}
                </Button>
              </div>
            </SurfaceCard>
          </TabsContent>

          <TabsContent value="document" className="mt-4">
            <Section title="Choose a file">
              <SurfaceCard className="border-dashed">
                <div className="flex flex-col items-center py-6 text-center">
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <FileText className="size-6" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {pickedName ?? "PDF, image or scan — up to 20 MB."}
                  </p>
                  <input
                    ref={docInput}
                    type="file"
                    accept="application/pdf,image/*"
                    className="hidden"
                    onChange={(e) => onPick(e.target.files?.[0])}
                  />
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => docInput.current?.click()}
                  >
                    {pickedName ? "Choose a different file" : "Choose a file"}
                  </Button>
                </div>
              </SurfaceCard>
              {filesQ.isPending ? (
                <LoadingCards count={2} />
              ) : filesQ.data && filesQ.data.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {filesQ.data.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      selected={selectedFile === file.id}
                      onSelect={() => setSelectedFile(file.id)}
                    />
                  ))}
                </div>
              ) : null}
            </Section>
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="note">Your note</Label>
              <Textarea
                id="note"
                rows={6}
                placeholder="e.g. Parent meeting next Friday at 6:30pm, bring the report card"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="mt-4">
            <SurfaceCard>
              <div className="flex flex-col items-center py-6 text-center">
                <div className="flex h-12 items-end gap-1.5" aria-hidden="true">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <span
                      key={i}
                      className={
                        recording
                          ? "dayly-wave-bar h-10 w-1.5 rounded-full bg-primary"
                          : "h-3 w-1.5 rounded-full bg-muted"
                      }
                      style={recording ? { animationDelay: `${i * 90}ms` } : undefined}
                    />
                  ))}
                </div>
                <Button
                  className="mt-5"
                  variant={recording ? "destructive" : "default"}
                  onClick={() => setRecording((r) => !r)}
                >
                  <Mic className="size-4" aria-hidden="true" />
                  {recording ? "Stop recording" : "Start recording"}
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  {recording ? "Listening…" : "Tap to record. Dayly transcribes it after you stop."}
                </p>
              </div>
            </SurfaceCard>
          </TabsContent>
        </Tabs>

        <SurfaceCard className="bg-sun-soft">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-card text-sun-foreground">
              <Mail className="size-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="font-bold">Forward by email</h2>
              <p className="mt-0.5 text-sm text-sun-foreground">
                Forward school notices, bills and confirmations to your Dayly address and they
                arrive here as proposals.
              </p>
              <code className="mt-2 inline-block rounded-lg bg-card px-2 py-1 font-mono text-xs">
                household@in.dayly.app
              </code>
            </div>
          </div>
        </SurfaceCard>

        <div className="sticky bottom-24 md:bottom-6">
          <Button className="w-full" size="lg" disabled={!canSubmit || processing} onClick={submit}>
            {processing ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Dayly is reading this…
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden="true" />
                Send to Dayly
              </>
            )}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Dayly only proposes. You approve everything.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
