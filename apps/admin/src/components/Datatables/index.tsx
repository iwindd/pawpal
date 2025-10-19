import { IconDrag } from "@pawpal/icons";
import { clsx } from "@pawpal/ui/clsx";
import { Center, DataTableDraggableRow, TableTd } from "@pawpal/ui/core";
import { Draggable, Droppable } from "@pawpal/ui/draggable";
import classes from "./style.module.css";

export const DragTableWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Droppable droppableId="datatable">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export const DragRowFactory = ({ record, index, rowProps, children }: any) => {
  return (
    <Draggable key={record.id} draggableId={record.id} index={index}>
      {(provided, snapshot) => (
        <DataTableDraggableRow
          isDragging={snapshot.isDragging}
          {...rowProps}
          className={clsx(rowProps.className, classes.draggableRow)}
          {...provided.draggableProps}
        >
          <TableTd>
            <Center {...provided.dragHandleProps} ref={provided.innerRef}>
              <IconDrag size={22} color="gray" />
            </Center>
          </TableTd>
          {children}
        </DataTableDraggableRow>
      )}
    </Draggable>
  );
};
