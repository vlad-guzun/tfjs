import { Button } from "./ui/button";

const NotificationModal = ({ message, onClose }: { message: string, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-black text-white rounded-lg font-serif px-8 py-1 shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] relative">
        <div className="flex flex-col items-center justify-center p-4">
          <p>{message}</p>
        </div>
        <Button
          onClick={onClose}
          className="absolute bottom-2 right-1 text-white bg-none hover:bg-black bg-black hover:text-slate-300 pt-2 pl-5 rounded"
        >
          close
        </Button>
      </div>
    </div>
  );
};

export default NotificationModal;
