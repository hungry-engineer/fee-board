import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import subDays from 'date-fns/subDays';
import Button from './Button';

const DateButton = forwardRef<HTMLButtonElement, { onClick?: any; value?: string }>(
  ({ onClick, value }, ref) => (
    <Button ref={ref} onClick={onClick}>
      {value || 'Yesterday'}
    </Button>
  )
);

interface ToolbarProps {
  date?: Date;
  onDateChange?: (date: Date) => void;
  onFilterToggle?: () => void;
  numFilters?: number;
}

const Toolbar: React.FC<ToolbarProps> = ({ date, onDateChange, onFilterToggle, numFilters }) => {
  return (
    <div className="toolbar">
      <Button onClick={onFilterToggle}>
        Filters
        {numFilters > 0 && <span className="chip">{numFilters}</span>}
      </Button>

      {onDateChange && (
        <DatePicker
          selected={date}
          customInput={<DateButton />}
          onChange={onDateChange}
          maxDate={subDays(new Date(), 1)}
          popperPlacement="bottom-end"
        />
      )}

      <style jsx>{`
        .toolbar {
          display: flex;
          justify-content: flex-end;
          align-self: stretch;
          margin: 0 4px;
        }
        .chip {
          background: #828282;
          color: #f9fafc;
          border-radius: 6px;
          font-size: 10px;
          padding: 2px 4px;
          margin-left: 6px;
        }
      `}</style>
    </div>
  );
};

export default Toolbar;
