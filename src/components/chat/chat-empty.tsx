import { LightbulbIcon, SearchIcon } from "lucide-react";

const ChatEmpty = ({
  setCurrentTask,
}: {
  setCurrentTask: (task: string) => void;
}) => {
  return (
    <div className="flex h-full w-full items-center justify-center px-4">
      <div className="max-w-2xl flex-1 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Chat with your documents
          </h1>
          <p className="text-lg text-muted-foreground">
            Ask questions about your documents and get answers instantly.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="rounded-xl border border-border p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <SearchIcon />
              </div>
              <h2 className="text-xl font-medium">Search</h2>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                className="w-full rounded-lg bg-muted px-4 py-3 text-left text-muted-foreground transition hover:bg-muted/10"
                aria-label="Find key information about a topic"
                onClick={() =>
                  setCurrentTask(
                    "Find key information about [topic] in the document",
                  )
                }
              >
                "Find key information about [topic] in the document"
              </button>
              <button
                type="button"
                className="w-full rounded-lg bg-muted px-4 py-3 text-left text-muted-foreground transition hover:bg-muted/10"
                aria-label="Explain a specific section of the document"
                onClick={() =>
                  setCurrentTask(
                    "Explain the main points of [specific section] in simple terms",
                  )
                }
              >
                "Explain the main points of [specific section] in simple terms"
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-border p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <LightbulbIcon />
              </div>
              <h2 className="text-xl font-medium">Analysis</h2>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                className="w-full rounded-lg bg-muted px-4 py-3 text-left text-muted-foreground transition hover:bg-muted/10"
                aria-label="Summarize key points of a document"
                onClick={() =>
                  setCurrentTask("Summarize the key points of [document name]")
                }
              >
                "Summarize the key points of [document name]"
              </button>
              <button
                type="button"
                className="w-full rounded-lg bg-muted px-4 py-3 text-left text-muted-foreground transition hover:bg-muted/10"
                aria-label="Compare documents"
                onClick={() =>
                  setCurrentTask(
                    "Compare this document with [another document] regarding [specific aspect]",
                  )
                }
              >
                "Compare this document with [another document] regarding
                [specific aspect]"
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export { ChatEmpty };
