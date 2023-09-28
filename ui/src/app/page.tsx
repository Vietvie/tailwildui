'use client';
import { DragEvent, MouseEvent, useState } from 'react';
import tailwindLayouts from './lib/tailwildlist';

interface TailwildType {
    component: string;
    layouts: number[];
    selected: boolean;
    onDrag: boolean;
}

export default function Home() {
    const regexTailwildList = /([a-zA-Z]+)(\d+)/;
    const [componentSelected, setComponentSelected] = useState<string>('');
    const [uiList, setUiList] = useState<{ name: string; onDrag: boolean }[]>(
        []
    );
    const tailwildListFilter = tailwindLayouts.reduce(
        (acc: TailwildType[], cur) => {
            const match = cur.match(regexTailwildList);
            if (!match) return acc;
            const key = match[1];
            const value = match[2];
            const componentList = acc.map((el) => el.component);
            if (!componentList.includes(key)) {
                acc.push({
                    component: key,
                    layouts: [parseInt(value)],
                    selected: false,
                    onDrag: false,
                });
            } else {
                acc = acc.map((el) => {
                    if (el.component !== key) return el;

                    return {
                        ...el,
                        layouts: [...el.layouts, parseInt(value)].sort(
                            (a, b) => a - b
                        ),
                    };
                });
            }
            return acc;
        },
        []
    );

    const handleSelectComponent = (e: MouseEvent<HTMLDivElement>) => {
        const name = e.currentTarget.dataset.name;
        if (!name) return;
        setComponentSelected(name);
    };

    const hanldeSelectLayout = (e: MouseEvent<HTMLLIElement>) => {
        const layout = e.currentTarget.dataset.layout;
        if (!layout) return;
        setUiList((prev) => [
            ...prev,
            { name: `${componentSelected + layout}`, onDrag: false },
        ]);
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        // e.preventDefault();
        const elementDragging = e.currentTarget.dataset.index;

        if (!elementDragging) return;
        setUiList((prev) =>
            prev.map((el, index) => {
                if (index === parseInt(elementDragging)) {
                    return { ...el, onDrag: true };
                }
                return el;
            })
        );
    };

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        // e.preventDefault();
        setUiList((prev) => prev.map((el) => ({ ...el, onDrag: false })));
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const draggingElement = e.currentTarget.querySelector('.dragging');
        const indexOfDraggingElement =
            draggingElement?.getAttribute('data-index');

        if (!draggingElement) return;
        const childNote = e.currentTarget.querySelectorAll(':not(.dragging)');
        let indexOfAfterElement: number | string | null = null;
        let closest = Number.NEGATIVE_INFINITY;
        childNote.forEach((el) => {
            const div = el.getBoundingClientRect();
            const offset = e.clientY - div.top - div.height / 2;
            if (offset < 0 && offset > closest) {
                closest = offset;
                indexOfAfterElement = el.getAttribute('data-index');
            }
            console.log({ offset, indexOfAfterElement, el });
        });
        if (!indexOfAfterElement && indexOfDraggingElement) {
            const newUiList = [...uiList];
            const movedElement = newUiList.splice(
                parseInt(indexOfDraggingElement),
                1
            );
            newUiList.push(movedElement[0]);
            // return setUiList(newUiList);
        }

        if (indexOfAfterElement && indexOfDraggingElement) {
            const newUiList = [...uiList];
            const movedElement = newUiList.splice(
                parseInt(indexOfDraggingElement),
                1
            );
            //First List
            if (parseInt(indexOfAfterElement) - 1 < 0) {
                newUiList.splice(0, 0, movedElement[0]);
            } else {
                newUiList.splice(
                    parseInt(indexOfAfterElement) - 1,
                    0,
                    movedElement[0]
                );
            }

            // return setUiList(newUiList);
        }
    };

    return (
        <div className="flex justify-between bg-zinc-100 h-screen text-black p-4 ">
            <div className="flex">
                <div className="bg-white p-2">
                    <div>Components</div>
                    <div>
                        {tailwildListFilter.map((el, index) => (
                            <div
                                onClick={handleSelectComponent}
                                key={index}
                                className="p-2"
                                data-name={el.component}
                            >
                                {el.component}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white border-l p-2">
                    <div>Layouts</div>
                    <ul className="flex w-40 flex-wrap bg-white">
                        {tailwildListFilter
                            .find((el) => el.component === componentSelected)
                            ?.layouts.map((el, index) => (
                                <li
                                    onClick={hanldeSelectLayout}
                                    data-layout={el}
                                    className="p-4"
                                    key={index}
                                >
                                    {el}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
            <div className="w-full p-2">
                <div className="flex justify-between">
                    <p>Preview</p>
                    <button className="bg-green-600 text-white p-2">
                        Save
                    </button>
                </div>

                <div
                    className="flex flex-col justify-center items-center gap-2 p-4"
                    onDragOver={handleDragOver}
                >
                    {uiList.map((el, index) => (
                        <div
                            data-index={index}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            draggable
                            className={`p-2 w-40 bg-white border cursor-move ${
                                el.onDrag && 'opacity-30 dragging'
                            }`}
                            key={index}
                        >
                            {el.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
