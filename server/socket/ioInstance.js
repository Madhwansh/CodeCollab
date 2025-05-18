let _io = null;
export const setIO = (io) => {
  _io = io;
};
export const getIO = () => {
  if (!_io) throw new Error("Socket.IO has not been initialized");
  return _io;
};
