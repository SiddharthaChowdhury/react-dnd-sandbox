export type TItemData = {
	id: string;
	text: string;
	index?: number;
};

export type TDragData = {
	dragItems: TItemData[];
	sourceId: string;
};

export type TOnItemDrop = (
	droppedItems: TItemData[],
	sourceId: string,
	destinationId: string
) => void;
