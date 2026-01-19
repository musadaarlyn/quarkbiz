import {
  useOptimistic,
  useRef,
  startTransition,
  useState,
} from "react";

type Message = {
  id: string;
  text: string;
  adding: boolean;
};

export default function MyList() {
  const formRef = useRef<HTMLFormElement>(null);

  // Source-of-truth state
  const [messages, setMessages] = useState<Message[]>([]);

  // Optimistic overlay
  const [optimisticList, addOptimisticList] = useOptimistic(
    messages,
    (state: Message[], newItem: Message) => [
      newItem,
      ...state,
    ]
  );

  function formAction(formData: FormData) {
    const text = formData.get("item") as string;
    if (!text.trim()) return;

    const id = crypto.randomUUID();

    const optimisticItem: Message = {
      id,
      text,
      adding: true,
    };

    // Optimistic UI update
    addOptimisticList(optimisticItem);
    formRef.current?.reset();

    // Background server update
    startTransition(async () => {
      await addListItem(text);

      // Commit real state → optimistic item disappears
      setMessages((prev) => [
        {
          id,
          text,
          adding: false,
        },
        ...prev,
      ]);
    });
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      {/* Form */}
      <form
        ref={formRef}
        action={formAction}
        className="flex items-center gap-3"
      >
        <input
          type="text"
          name="item"
          placeholder="Add a list item..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Add
        </button>
      </form>

      {/* List */}
      <div className="space-y-2">
        {optimisticList.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm
              transition-all
              ${
                item.adding
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-800"
              }`}
          >
            <span>{item.text}</span>

            {item.adding && (
              <span className="text-xs italic text-blue-500">
                adding…
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------
// Fake server call
// -----------------
async function addListItem(text: string) {
  await new Promise((res) => setTimeout(res, 1000));
  return { text };
}
