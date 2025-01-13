import { useEffect, useState, useCallback } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [leftElements, setLeftElements] = useState([]);
  const [rightElements, setRightElements] = useState([]);
  const [isLeftBoard, setIsLeftBoard] = useState(true);

  useEffect(() => {
    socket.on('assignBoard', (board) => {
      setIsLeftBoard(board === 'left');
    });

    socket.on('updateLeftBoard', (elements) => {
      if (!isLeftBoard) {
        console.log('Received left board update:', elements);
        setLeftElements(elements);
      }
    });

    socket.on('updateRightBoard', (elements) => {
      if (isLeftBoard) {
        console.log('Received right board update:', elements);
        setRightElements(elements);
      }
    });

    return () => {
      socket.off('assignBoard');
      socket.off('updateLeftBoard');
      socket.off('updateRightBoard');
    };
  }, [isLeftBoard]);

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

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '50%', height: '100%' }}>
        <div className="text-center p-2 bg-blue-100">
          <h2>{isLeftBoard ? '내 보드' : '다른 사용자의 보드'}</h2>
        </div>
        <Excalidraw
          onChange={onChangeLeft}
          elements={leftElements}
          viewModeEnabled={!isLeftBoard}
        />
      </div>
      <div style={{ width: '50%', height: '100%' }}>
        <div className="text-center p-2 bg-blue-100">
          <h2>{!isLeftBoard ? '내 보드' : '다른 사용자의 보드'}</h2>
        </div>
        <Excalidraw
          onChange={onChangeRight}
          elements={rightElements}
          viewModeEnabled={isLeftBoard}
        />
      </div>
    </div>
  );
}

export default App;
