import { FC, useEffect, useState } from "react";
import { TaskData } from "../types/data";
import { generateRandomString } from "../utils/util";
import { numberTo2Digits, ISOStringToYYYYMMDDdHHMM } from "../utils/dateUtil";

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
        const date = new Date(`${taskDeadlineDate} ${taskDeadlineTime}`);
        setTaskDeadline(date);
    }, [taskDeadlineDate, taskDeadlineTime]);

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
                                        deadline: taskDeadline.toISOString(),
                                        isDone: false,
                                    };
                                    setTaskDatas([...taskDatas, newTaskData]);
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
                <p>
                    最終更新: {ISOStringToYYYYMMDDdHHMM(nowDate.toISOString())}
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>名前</th>
                            <th>期限</th>
                            <th>状況</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taskDatas.map((taskData) => (
                            <tr key={taskData.id}>
                                <td>{taskData.name}</td>
                                <td>
                                    {ISOStringToYYYYMMDDdHHMM(
                                        taskData.deadline
                                    )}
                                </td>
                                <td>{taskData.isDone ? "完了" : "未"}</td>
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
