import { XYCoord, useDragLayer } from "react-dnd";
import { TDragData, TItemData } from "../types";
import { ACCEPT_TYPE } from "../App";
import { CSSProperties } from "react";

/**
 * This component is to be attached at the top the tree but under <DndProvider
 */
export const ItemDragLayer = () => {
	const { itemType, isDragging, item, currentOffset } = useDragLayer(
		(monitor) => ({
			item: monitor.getItem(),
			itemType: monitor.getItemType(),
			currentOffset: monitor.getSourceClientOffset(),
			isDragging: monitor.isDragging(),
		})
	);

	const renderItem = (type: string, dragInfo: TDragData) => {
		switch (type) {
			case ACCEPT_TYPE:
				return <ItemDragPreview draggedItems={dragInfo.dragItems} />;
			default:
				return null;
		}
	};
	if (!isDragging) {
		return null;
	}

	return (
		<div style={layerStyles}>
			<div style={getItemStyles(currentOffset)}>
				<div style={getFieldStyle(isDragging)}>
					{renderItem(itemType as string, item)}
				</div>
			</div>
		</div>
	);
};

const ItemDragPreview = (props: { draggedItems: TItemData[] }) => {
	return (
		<div>
			{props.draggedItems.map((item) => (
				<div key={item.id} style={{ padding: "10px", backgroundColor: "cyan" }}>
					{item.text}
				</div>
			))}
		</div>
	);
};

// Styles
const layerStyles: CSSProperties = {
	position: "fixed",
	pointerEvents: "none",
	zIndex: 100,
	left: 0,
	top: 0,
	width: "100%",
	height: "100%",
};
const getFieldStyle = (isDragging: boolean) => ({
	width: 300,
	maxWidth: 300,
	opacity: isDragging ? 0.8 : 1,
});
const getItemStyles = (currentOffset: XYCoord | null) => {
	if (!currentOffset) {
		return {
			display: "none",
		};
	}
	const { x, y } = currentOffset;

	const transform = `translate(${x}px, ${y}px)`;
	return {
		transform,
		WebkitTransform: transform,
	};
};
