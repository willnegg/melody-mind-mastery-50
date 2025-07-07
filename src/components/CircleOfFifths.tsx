import React from 'react';
import { cn } from '@/lib/utils';
import { circleOfFifths, relativeMinors } from '@/constants/musicTheory';

interface CircleOfFifthsProps {
  highlightedNotes?: string[];
  size?: number;
  onNoteClick?: (note: string) => void;
  className?: string;
}

const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({
  highlightedNotes = [],
  size = 200,
  onNoteClick,
  className
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.25;

  const getPosition = (index: number, radius: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180); // Start from top, 30 degrees apart
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <div className={cn('flex justify-center', className)}>
      <svg width={size} height={size} className="border border-border rounded-full bg-card">
        {/* Outer circle (major keys) */}
        {circleOfFifths.map((note, index) => {
          const pos = getPosition(index, outerRadius);
          const isHighlighted = highlightedNotes.includes(note);
          
          return (
            <g key={`major-${note}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                className={cn(
                  'fill-muted stroke-border stroke-2 cursor-pointer transition-all duration-200',
                  'hover:fill-accent hover:stroke-accent-foreground',
                  isHighlighted && 'fill-primary stroke-primary-foreground'
                )}
                onClick={() => onNoteClick?.(note)}
              />
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  'fill-muted-foreground text-sm font-semibold cursor-pointer',
                  isHighlighted && 'fill-primary-foreground'
                )}
                onClick={() => onNoteClick?.(note)}
              >
                {note}
              </text>
            </g>
          );
        })}

        {/* Inner circle (relative minors) */}
        {circleOfFifths.map((note, index) => {
          const pos = getPosition(index, innerRadius);
          const minorKey = relativeMinors[note as keyof typeof relativeMinors];
          const isHighlighted = highlightedNotes.includes(minorKey?.replace('m', '') || '');
          
          return (
            <g key={`minor-${note}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="15"
                className={cn(
                  'fill-muted/50 stroke-border cursor-pointer transition-all duration-200',
                  'hover:fill-accent/50 hover:stroke-accent-foreground',
                  isHighlighted && 'fill-secondary stroke-secondary-foreground'
                )}
                onClick={() => onNoteClick?.(minorKey?.replace('m', '') || '')}
              />
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  'fill-muted-foreground text-xs font-medium cursor-pointer',
                  isHighlighted && 'fill-secondary-foreground'
                )}
                onClick={() => onNoteClick?.(minorKey?.replace('m', '') || '')}
              >
                {minorKey}
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-xs font-medium"
        >
          Circle
        </text>
        <text
          x={centerX}
          y={centerY + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-xs font-medium"
        >
          of Fifths
        </text>
      </svg>
    </div>
  );
};

export default CircleOfFifths;