import classNames from 'classnames';
import React from 'react';

import Cell from './Cell';
import { RowRendererProps } from './common/types';
import { preventDefault, wrapEvent } from './utils';

export default function Row<R, SR = unknown>({
  cellRenderer: CellRenderer = Cell,
  className,
  enableCellRangeSelection,
  eventBus,
  height,
  rowIdx,
  isRowSelected,
  lastFrozenColumnIndex,
  onRowClick,
  row,
  viewportColumns,
  width,
  onDragEnter,
  onDragOver,
  onDrop,
  ...props
}: RowRendererProps<R, SR>) {
  function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
    // Prevent default to allow drop
    event.preventDefault();
    eventBus.dispatch('DRAG_ENTER', rowIdx);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  function getCells() {
    return viewportColumns.map(column => {
      return (
        <CellRenderer
          key={column.key}
          rowIdx={rowIdx}
          column={column}
          lastFrozenColumnIndex={lastFrozenColumnIndex}
          row={row}
          isRowSelected={isRowSelected}
          eventBus={eventBus}
          onRowClick={onRowClick}
          enableCellRangeSelection={enableCellRangeSelection}
        />
      );
    });
  }

  className = classNames(
    'rdg-row',
    `rdg-row-${rowIdx % 2 === 0 ? 'even' : 'odd'}`,
    { 'rdg-row-selected': isRowSelected },
    className
  );

  // Regarding onDrop: the default in Firefox is to treat data in dataTransfer as a URL,
  // and perform navigation on it, even if the data type used is 'text'.
  // To bypass this, we need to capture and prevent the drop event.
  return (
    <div
      className={className}
      style={{ width, height }}
      onDragEnter={wrapEvent(handleDragEnter, onDragEnter)}
      onDragOver={wrapEvent(handleDragOver, onDragOver)}
      onDrop={wrapEvent(preventDefault, onDrop)}
      {...props}
    >
      {getCells()}
    </div>
  );
}
