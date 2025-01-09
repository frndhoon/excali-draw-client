import { Excalidraw } from '@excalidraw/excalidraw';

function App() {
  return (
    <div className="h-screen w-screen bg-gray-100 custom-styles">
      <div className="text-center p-4 bg-white shadow-md">
        <p className="text-2xl font-bold">Excalidraw</p>
        <p className="text-xl font-medium">grim-talk</p>
      </div>
      <div className="w-full h-full p-4">
        <Excalidraw />
      </div>
    </div>
  );
}

export default App;
