import Button from "./components/Button.tsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">
        Tailwind + React + TypeScript is Working! 🚀
      </h1>

      <Button onClick={() => alert("Button clicked!")}>
        Click Me
      </Button>
    </div>
  );
}

export default App;

