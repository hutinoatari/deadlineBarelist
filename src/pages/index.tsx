import { FC, useState } from "react";

const TopPage: FC<{}> = () => {
    const [taskDatas, setTaskDatas] = useState<string[]>([]);
    return (
        <>
            <header>
                <h1>期限ギリギリスト</h1>
            </header>
            <main>
                <button
                    onClick={() =>
                        setTaskDatas([
                            ...taskDatas,
                            "" + Math.floor(Math.random() * 100),
                        ])
                    }
                >
                    追加
                </button>
                <table>
                    {taskDatas.map((e, i) => (
                        <tr key={i}>
                            <td>{e}</td>
                        </tr>
                    ))}
                </table>
            </main>
            <footer>
                <p>
                    <small>&copy;2022 淵野アタリ</small>
                </p>
            </footer>
        </>
    );
};

export default TopPage;
