import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { TDragData, TItemData, TOnItemDrop } from "../types";
import { Item } from "../item/Item";
import { ACCEPT_TYPE } from "../App";

type TProps = {
	items: TItemData[];
	dropBoxId: string;
	onItemDropped: TOnItemDrop;
};

export const DropBox = (props: TProps) => {
	const [{ isOver, canDrop }, dropRef] = useDrop({
		accept: ACCEPT_TYPE,
		drop: (items: TDragData) => {
			// What is returned here ends up in-- end:() fn of useDrag
			return { dropBoxId: props.dropBoxId };
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	const [selectedItems, setSelectedItems] = useState<TItemData[]>([]);

	// Callbacks
	const handleItemChecked = (item: TItemData, isChecked: boolean) => {
		let newSelectedItems: TItemData[] = [];
		if (!isChecked) {
			// remove if item already exists
			const index = selectedItems.findIndex(({ id }) => id === item.id);
			if (index > -1) {
				newSelectedItems = [...selectedItems];
				newSelectedItems.splice(index, 1);
			}
		} else {
			newSelectedItems = [...selectedItems, item];
		}

		const finalList = props.items.filter((item) =>
			newSelectedItems.find((neItem) => neItem.id === item.id)
		);

		setSelectedItems(finalList);
	};

	const handleItemDropped: TOnItemDrop = (items, source, dropResult) => {
		props.onItemDropped(items, source, dropResult);
		setSelectedItems([]);
	};

	// Effects
	useEffect(() => {
		setSelectedItems([]);
	}, []);

	// Items
	const itemsToShow = props.items.map((item, index) => (
		<Item
			key={`${item.id}-${index}`}
			data={{ ...item, index }}
			dropBoxId={props.dropBoxId}
			onCheckChange={handleItemChecked}
			onItemDrop={handleItemDropped}
			selectedItemsToDrag={selectedItems}
		/>
	));

	return (
		<div className="box" ref={dropRef}>
			{itemsToShow}
		</div>
	);
};
