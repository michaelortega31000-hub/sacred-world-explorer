import { useEffect } from 'react';
import { format } from 'date-fns';

interface CalendarMultiDotsProps {
  eventsByDay: Map<string, Set<string>>;
  traditionColors: Record<string, string>;
}

/**
 * Component that adds multiple colored dots to calendar days with multiple traditions
 * Uses DOM manipulation to insert dots after calendar rendering
 */
export const CalendarMultiDots = ({ eventsByDay, traditionColors }: CalendarMultiDotsProps) => {
  useEffect(() => {
    // Find all calendar day buttons
    const calendarDays = document.querySelectorAll('[role="gridcell"] button');
    
    calendarDays.forEach((button) => {
      const buttonEl = button as HTMLButtonElement;
      const dateAttr = buttonEl.getAttribute('data-date') || buttonEl.getAttribute('aria-label');
      
      if (!dateAttr) return;
      
      // Try to extract date from button
      const buttonDate = buttonEl.getAttribute('name');
      if (!buttonDate) return;
      
      const dateKey = buttonDate;
      const traditions = eventsByDay.get(dateKey);
      
      if (traditions && traditions.size > 1) {
        // Remove existing multi-dots if any
        const existing = buttonEl.querySelector('.multi-tradition-dots');
        if (existing) existing.remove();
        
        // Create dots container
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'multi-tradition-dots';
        dotsContainer.style.cssText = `
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 2px;
          pointer-events: none;
          z-index: 10;
        `;
        
        // Create individual dots
        const colors = Array.from(traditions).map(t => traditionColors[t]);
        colors.forEach((color, idx) => {
          const dot = document.createElement('div');
          dot.className = 'animate-pulse-subtle';
          dot.style.cssText = `
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: ${color};
            box-shadow: 0 0 6px ${color};
            animation-delay: ${idx * 0.2}s;
          `;
          dotsContainer.appendChild(dot);
        });
        
        // Remove the default single dot for multi-tradition days
        if (buttonEl.classList.contains('has-religious-event')) {
          buttonEl.style.setProperty('--hide-single-dot', '1');
        }
        
        buttonEl.style.position = 'relative';
        buttonEl.appendChild(dotsContainer);
      }
    });
  }, [eventsByDay, traditionColors]);
  
  return null;
};
