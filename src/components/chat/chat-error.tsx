const ChatError = ({ error }: { error: string }) => {
  return (
    <div className="mb-2 md:mb-0">
      <div className="ml-1 flex h-full justify-center gap-0 md:m-auto md:mb-2 md:w-full md:gap-2">
        <span className="text-sm text-red-500">{error}</span>
      </div>
    </div>
  );
};

export { ChatError };
