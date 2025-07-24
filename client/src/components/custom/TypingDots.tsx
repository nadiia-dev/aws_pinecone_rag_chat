const TypingDots = () => {
  return (
    <div className="flex space-x-1 text-xl bg-muted text-muted-foreground font-bold">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce delay-200">.</span>
      <span className="animate-bounce delay-400">.</span>
    </div>
  );
};

export default TypingDots;
