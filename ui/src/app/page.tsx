'use client';
import { DragEvent, MouseEvent, useEffect, useState } from 'react';
import axios from 'axios';
import convertTailwindList from './lib/convertTailwindList';

export type TailwildType = {
    component: string;
    layouts: number[];
    selected: boolean;
    onDrag: boolean;
};

interface UiList {
    name: string;
    onDrag: boolean;
}

interface GetLayoutsResponse {
    tailwindLayouts: string[];
}

interface PostLayoutsResponse {
    status: number | string;
}

export default function Home() {
    const [componentSelected, setComponentSelected] = useState<string>('');
    const [uiList, setUiList] = useState<UiList[]>([]);
    const [tailwindList, setTailwindList] = useState<TailwildType[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);

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
            {
                name: `${componentSelected + layout}`,
                onDrag: false,
            },
        ]);
    };

    const handleHover = (index: number) => {
        setUiList((prev) =>
            prev.map((el, i) => {
                if (i !== index) return el;
                return { ...el, onHover: true };
            })
        );
    };

    const handleStartDrag = (e: DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
        setUiList((prev) =>
            prev.map((el, i) => {
                if (index !== i) return el;
                return { ...el, onDrag: true };
            })
        );
    };

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        console.log('End');
        setUiList((prev) => prev.map((el) => ({ ...el, onDrag: false })));
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, newIndex: number) => {
        e.preventDefault();
        const oldIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const newUiList = [...uiList];
        const [draggedItem] = newUiList.splice(oldIndex, 1);
        newUiList.splice(newIndex, 0, draggedItem);
        setUiList(newUiList);
    };

    const handleRemove = (index: number) => {
        const newUiList = [...uiList];
        newUiList.splice(index, 1);
        setUiList(newUiList);
    };

    const handleRemoveAll = () => {
        setUiList([]);
    };

    const handleSave = async () => {
        if (!uiList.length) return;
        setIsSaving(true);
        try {
            const baseURL = 'http://localhost:3232/generate';
            const { data } = await axios.post<PostLayoutsResponse>(baseURL, {
                layouts: uiList.map((el) => el.name),
            });
            console.log(data);
            window.alert('Save Layouts Success');
        } catch (error) {
            console.log(error);
        }
        setIsSaving(false);
    };

    useEffect(() => {
        const fetchTailwindList = async () => {
            const baseURL = 'http://localhost:3232/layouts';
            try {
                const { data } = await axios.get<GetLayoutsResponse>(baseURL);
                const tailwindLayouts: string[] = data.tailwindLayouts;
                const tailwildListFilter = convertTailwindList(tailwindLayouts);
                setTailwindList(tailwildListFilter);
            } catch (error) {
                console.log(error);
            }
        };
        fetchTailwindList();
    }, []);

    return (
        <div className="flex justify-between bg-zinc-100 h-screen text-black p-4 ">
            <div className="flex">
                <div className="bg-white px-4 pb-4 overflow-auto relative">
                    <div className="sticky bg-white p-2 mb-2  top-0 w-full">
                        Components
                    </div>
                    <div className="flex flex-col w-48 gap-2 overflow-auto">
                        {tailwindList.map((el, index) => (
                            <div
                                onClick={handleSelectComponent}
                                key={index}
                                className={`cursor-default p-2 ${
                                    componentSelected === el.component
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-200'
                                }`}
                                data-name={el.component}
                            >
                                {el.component}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white px-4 pb-4 overflow-auto  border-l">
                    <div className="sticky bg-white p-2 mb-2  top-0 w-full">
                        Layouts
                    </div>
                    <ul className="flex w-48 justify-center flex-wrap gap-1 bg-white">
                        {tailwindList
                            .find((el) => el.component === componentSelected)
                            ?.layouts.map((el, index) => (
                                <li
                                    onClick={hanldeSelectLayout}
                                    data-layout={el}
                                    className="p-4 w-1/4 border  cursor-default hover:bg-slate-200"
                                    key={index}
                                >
                                    {el}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
            <div className="w-full flex flex-col p-2">
                <div className="flex justify-between">
                    <p>Preview</p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRemoveAll}
                            disabled={isSaving}
                            className='className="bg-green-600 border text-black p-2 disabled:opacity-60"'
                        >
                            Remove All
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-green-600 text-white p-2 disabled:opacity-60"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-start items-center gap-2 p-4 overflow-auto">
                    {uiList.map((el, index) => (
                        <div
                            data-index={index}
                            onDragStart={(el) => handleStartDrag(el, index)}
                            onDragEnd={handleDragEnd}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                            onMouseOver={() => handleHover(index)}
                            draggable
                            className={`p-2 w-40 bg-white border cursor-move relative group ${
                                el.onDrag && 'opacity-30 dragging'
                            }`}
                            key={index}
                        >
                            <span key={index}>{el.name}</span>
                            <span
                                onClick={() => handleRemove(index)}
                                className={`absolute cursor-pointer hidden left-full h-full aspect-square top-0 justify-center items-center bg-white border-l ${
                                    el.onDrag ? 'hidden' : 'group-hover:flex '
                                }`}
                            >
                                <span>&#x2715;</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
