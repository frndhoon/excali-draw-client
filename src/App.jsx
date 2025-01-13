import { useEffect, useState, useCallback } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [leftElements, setLeftElements] = useState([]);
  const [rightElements, setRightElements] = useState([]);
  const [isLeftBoard, setIsLeftBoard] = useState(true);
  const [leftExcalidrawAPI, setLeftExcalidrawAPI] = useState(null);
  const [rightExcalidrawAPI, setRightExcalidrawAPI] = useState(null);
  const [isOverlayMode, setIsOverlayMode] = useState(false);

  const updateLeftScene = useCallback(() => {
    if (leftExcalidrawAPI) {
      const leftSceneData = {
        elements: leftElements,
      };
      leftExcalidrawAPI.updateScene(leftSceneData);
    }
  }, [leftExcalidrawAPI, leftElements]);

  const updateRightScene = useCallback(() => {
    if (rightExcalidrawAPI) {
      const rightSceneData = {
        elements: rightElements,
      };
      rightExcalidrawAPI.updateScene(rightSceneData);
    }
  }, [rightExcalidrawAPI, rightElements]);

  useEffect(() => {
    socket.on('assignBoard', (board) => {
      setIsLeftBoard(board === 'left');
    });

    socket.on('updateLeftBoard', (elements) => {
      if (!isLeftBoard) {
        console.log('Received left board update:', elements);
        setLeftElements(elements);
        setTimeout(() => updateLeftScene(), 0);
      }
    });

    socket.on('updateRightBoard', (elements) => {
      if (isLeftBoard) {
        console.log('Received right board update:', elements);
        setRightElements(elements);
        setTimeout(() => updateRightScene(), 0);
      }
    });

    return () => {
      socket.off('assignBoard');
      socket.off('updateLeftBoard');
      socket.off('updateRightBoard');
    };
  }, [isLeftBoard, updateLeftScene, updateRightScene]);

  const onChangeLeft = useCallback(
    (elements) => {
      if (isLeftBoard) {
        setLeftElements(elements);
        socket.emit('updateLeftBoard', elements);
      }
    },
    [isLeftBoard]
  );

  const onChangeRight = useCallback(
    (elements) => {
      if (!isLeftBoard) {
        setRightElements(elements);
        socket.emit('updateRightBoard', elements);
      }
    },
    [isLeftBoard]
  );

  const toggleOverlayMode = () => {
    setIsOverlayMode(!isOverlayMode);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <div
          className={`${isOverlayMode ? 'w-full' : 'w-1/2'} h-full relative`}
        >
          <div className="text-center p-2 bg-blue-100">
            <h2>{isLeftBoard ? '내 보드' : '다른 사용자의 보드'}</h2>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={toggleOverlayMode}
            >
              {isOverlayMode ? '겹치기 해제' : '겹치기'}
            </button>
          </div>
          <Excalidraw
            onChange={onChangeLeft}
            elements={leftElements}
            viewModeEnabled={!isLeftBoard}
            excalidrawAPI={(api) => setLeftExcalidrawAPI(api)}
          />
          {isOverlayMode && (
            <div className="absolute top-[53px] left-0 right-0 bottom-0 opacity-50 pointer-events-none z-[1000]">
              <Excalidraw
                onChange={onChangeRight}
                elements={rightElements}
                viewModeEnabled={true}
                excalidrawAPI={(api) => setRightExcalidrawAPI(api)}
              />
            </div>
          )}
        </div>
        {!isOverlayMode && (
          <div className="w-1/2 h-full">
            <div className="text-center p-2 bg-blue-100">
              <h2>{!isLeftBoard ? '내 보드' : '다른 사용자의 보드'}</h2>
            </div>
            <Excalidraw
              onChange={onChangeRight}
              elements={rightElements}
              viewModeEnabled={isLeftBoard}
              excalidrawAPI={(api) => setRightExcalidrawAPI(api)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
