export default function BeforeRoom({
  codeRef,
  isInRoom,
  setIsInRoom,
  setRoomId,
}: any) {
  const enterRoom = () => {
    console.log(codeRef.current.value);
    setRoomId(codeRef.current.value);
    setIsInRoom(!isInRoom);
  };

  return (
    <div>
      Enter Code:
      <input ref={codeRef} type="text" placeholder="code" />
      <button onClick={enterRoom}>Enter</button>
    </div>
  );
}
