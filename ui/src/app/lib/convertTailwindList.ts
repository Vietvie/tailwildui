import { TailwildType } from '../page';

const convertTailwindList = (list: string[]) => {
    const regexTailwildList = /([a-zA-Z]+)(\d+)/;
    return list.reduce((acc: TailwildType[], cur) => {
        const match = cur.match(regexTailwildList);
        if (!match) return acc;
        const key = match[1];
        const value = match[2];

        if (acc.every((el) => el.component !== key)) {
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
    }, []);
};

export default convertTailwindList;
