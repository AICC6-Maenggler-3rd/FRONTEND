import React from 'react'

interface KanbanListProps {
  getItem: (id: string) => any;
  getColumn: (item: number) => any;
  className?: string;
  columnHeader: (columnIndex: number) => React.ReactNode;
  itemRenderer: (item: any) => React.ReactNode;
}

const KanbanList = ({getItem, getColumn, columnHeader, itemRenderer, className}: KanbanListProps) => {
  
  return (
    <div className={className}>
      {
        getColumn(0).map((column: any) => (
          <div key={column.id}>
            {columnHeader(column.id)}
            {
              getItem(column.id).map((item: any) => (
                <div key={item.id}>
                  {itemRenderer(item)}
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default KanbanList
