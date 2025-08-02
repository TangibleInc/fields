export const withContext = (Story, { args, globals }) => {
  // Access the global context value
  const globalContext = globals.context || 'default';

  // Generate a dynamic class name based on context
  const contextClass = `tf-context-${globalContext}`;

  return (
    <div className={contextClass}>
      <Story {...args} />
    </div>
  );
};
