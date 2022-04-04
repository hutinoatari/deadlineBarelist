import { FC, useEffect, useState } from "react";
import { TaskData } from "../types/data";
import { generateRandomString } from "../utils/util";
import { numberTo2Digits, dateToYYYYMMDDdHHMM } from "../utils/dateUtil";

const TopPage: FC<{}> = () => {
    const [taskDatas, setTaskDatas] = useState<TaskData[]>([]);
    const [nowDate, setNowDate] = useState<Date>(new Date());
    const [taskName, setTaskName] = useState<string>("");
    const [taskDeadlineDate, setTaskDeadlineDate] = useState<string>(
        `${nowDate.getFullYear()}-${numberTo2Digits(
            nowDate.getMonth() + 1
        )}-${numberTo2Digits(nowDate.getDate())}`
    );
    const [taskDeadlineTime, setTaskDeadlineTime] = useState<string>("23:59");
    const [taskDeadline, setTaskDeadline] = useState<Date>(
        new Date(`${taskDeadlineDate} ${taskDeadlineTime}`)
    );
    useEffect(() => {
        (async () => {
            const json = await localStorage.getItem("tasks");
            if (json === null) return;
            setTaskDatas(
                JSON.parse(json).map((e: any) => ({
                    ...e,
                    deadline: new Date(e.deadline),
                }))
            );
        })();
    }, []);
    useEffect(() => {
        const json = JSON.stringify(
            taskDatas.map((e: TaskData) => ({
                ...e,
                deadline: e.deadline.toISOString(),
            }))
        );
        localStorage.setItem("tasks", json);
    }, [taskDatas]);
    useEffect(() => {
        const date = new Date(`${taskDeadlineDate} ${taskDeadlineTime}`);
        setTaskDeadline(date);
    }, [taskDeadlineDate, taskDeadlineTime]);

    const addTask = (newTask: TaskData) => {
        const newTaskDatas = [...taskDatas, newTask].sort(
            (a, b) => a.deadline.getTime() - b.deadline.getTime()
        );
        setTaskDatas(newTaskDatas);
    };
    const deleteTask = (id: string) => {
        if (!window.confirm("強制的に課題を削除します。よろしいですか？"))
            return;
        const newTaskDatas = taskDatas.filter((e) => e.id !== id);
        setTaskDatas(newTaskDatas);
    };
    const doneTask = (id: string) => {
        if (!window.confirm("課題を完了しますか？")) return;
        const newTaskDatas = taskDatas.map((e) =>
            e.id === id ? { ...e, isDone: true } : e
        );
        setTaskDatas(newTaskDatas);
    };

    return (
        <>
            <header>
                <h1>期限ギリギリスト</h1>
            </header>
            <main>
                <form>
                    <fieldset>
                        <legend>課題追加</legend>
                        <div>
                            <label>
                                名前:{" "}
                                <input
                                    type="text"
                                    value={taskName}
                                    onChange={(e) =>
                                        setTaskName(e.target.value)
                                    }
                                    placeholder="課題名"
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                期限:{" "}
                                <input
                                    type="date"
                                    value={taskDeadlineDate}
                                    onChange={(e) => {
                                        if (e.target.value === "") {
                                            alert("不正な入力です。");
                                            return;
                                        }
                                        setTaskDeadlineDate(e.target.value);
                                    }}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                時刻:{" "}
                                <input
                                    type="time"
                                    value={taskDeadlineTime}
                                    onChange={(e) => {
                                        if (e.target.value === "") {
                                            alert("不正な入力です。");
                                            return;
                                        }
                                        setTaskDeadlineTime(e.target.value);
                                    }}
                                />
                            </label>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => {
                                    const trimedTaskName = taskName.trim();
                                    if (trimedTaskName === "") {
                                        alert("課題名を入力してください。");
                                        return;
                                    }
                                    const newTaskData: TaskData = {
                                        id: generateRandomString(),
                                        name: trimedTaskName,
                                        deadline: taskDeadline,
                                        isDone: false,
                                    };
                                    addTask(newTaskData);
                                    setTaskName("");
                                    setTaskDeadlineDate(
                                        `${nowDate.getFullYear()}-${numberTo2Digits(
                                            nowDate.getMonth() + 1
                                        )}-${numberTo2Digits(
                                            nowDate.getDate()
                                        )}`
                                    );
                                    setTaskDeadlineTime("23:59");
                                }}
                            >
                                追加
                            </button>
                        </div>
                    </fieldset>
                </form>
                <p>最終更新: {dateToYYYYMMDDdHHMM(nowDate)}</p>
                <div>
                    <button onClick={() => setNowDate(new Date())}>更新</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>名前</th>
                            <th>期限</th>
                            <th>状況</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taskDatas.map((taskData) => (
                            <tr key={taskData.id}>
                                <td>{taskData.name}</td>
                                <td>
                                    {dateToYYYYMMDDdHHMM(taskData.deadline)}
                                </td>
                                <td>{taskData.isDone ? "完了" : "未"}</td>
                                <td>
                                    <button
                                        onClick={() => doneTask(taskData.id)}
                                        disabled={taskData.isDone}
                                    >
                                        提出
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (
                                                !window.confirm(
                                                    "ツイートしますか？"
                                                )
                                            )
                                                return;
                                            const tweetText = `${taskData.name} submission complete...`;
                                            const url = `https://twitter.com/intent/tweet?text=${encodeURI(
                                                tweetText
                                            )}`;
                                            window.open(url, "_blank");
                                        }}
                                        disabled={!taskData.isDone}
                                    >
                                        共有
                                    </button>
                                    <button
                                        onClick={() => deleteTask(taskData.id)}
                                    >
                                        削除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
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
