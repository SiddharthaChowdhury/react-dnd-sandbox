import { useCallback, useEffect, useState } from "react";
import { TDragData, TItemData, TOnItemDrop } from "../types";
import { useDrag } from "react-dnd";
import { ACCEPT_TYPE } from "../App";
import { getEmptyImage } from "react-dnd-html5-backend";

type TProps = {
	data: TItemData;
	dropBoxId: string;
	onCheckChange: (item: TItemData, isChecked: boolean) => void;
	onItemDrop: TOnItemDrop;
	selectedItemsToDrag: TItemData[];
};

export const Item = (props: TProps) => {
	// DND
	const [, dragRef, dragPreview] = useDrag({
		type: ACCEPT_TYPE,

		item: (): TDragData => {
			let dragItems;

			if (props.selectedItemsToDrag.find((item) => item.id === props.data.id)) {
				dragItems = props.selectedItemsToDrag;
			} else {
				dragItems = [...props.selectedItemsToDrag, props.data];
			}
			return { dragItems, sourceId: props.dropBoxId };
		},

		end: (item, monitor) => {
			const dropResult: any = monitor.getDropResult();
			// dropResult data is received from useDrop.drop() function
			if (dropResult) {
				props.onItemDrop(item.dragItems, item.sourceId, dropResult.dropBoxId);
			}
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});
	// State
	const [isChecked, setChecked] = useState(false);

	// Callbacks
	const handleCheckChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setChecked(event.target.checked);
			props.onCheckChange(props.data, event.target.checked);
		},
		[props]
	);

	// Effects
	useEffect(() => {
		// This gets called after every render, by default
		// (the first one, and every one after that)

		// Use empty image as a drag preview so browsers don't draw it
		// and we can draw whatever we want on the custom drag layer instead.
		dragPreview(getEmptyImage(), {
			// IE fallback: specify that we'd rather screenshot the node
			// when it already knows it's being dragged so we can hide it with CSS.
			captureDraggingState: true,
		});
		// If you want to implement componentWillUnmount,
		// return a function from here, and React will call
		// it prior to unmounting.
		// return () => console.log('unmounting...');
	}, [dragPreview]);

	return (
		<div
			ref={dragRef}
			className="draggable"
			style={isChecked ? { backgroundColor: "greenyellow" } : {}}
		>
			<input type="checkbox" onChange={handleCheckChange} />
			{props.data.text}
		</div>
	);
};
