"use client";

import React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

type DndProviderProps = {
  children: React.ReactNode;
  onDragEnd: (result: DropResult) => void;
};

export function DndProvider({ children, onDragEnd }: DndProviderProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
}

// Using StrictModeDroppable to handle StrictMode double rendering
export const StrictModeDroppable = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = React.useState(false);
  
  React.useEffect(() => {
    // Wait for one tick to ensure StrictMode double rendering is done
    const animation = requestAnimationFrame(() => {
      setEnabled(true);
    });
    
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  
  if (!enabled) {
    return null;
  }

  // Ensure isCombineEnabled is a proper boolean if passed
  const sanitizedProps = { ...props };
  if ('isCombineEnabled' in sanitizedProps) {
    sanitizedProps.isCombineEnabled = Boolean(sanitizedProps.isCombineEnabled);
  }
  if ('isDropDisabled' in sanitizedProps) {
    sanitizedProps.isDropDisabled = Boolean(sanitizedProps.isDropDisabled);
  }
  if ('ignoreContainerClipping' in sanitizedProps) {
    sanitizedProps.ignoreContainerClipping = Boolean(sanitizedProps.ignoreContainerClipping);
  }
  
  return <Droppable {...sanitizedProps}>{children}</Droppable>;
}; 