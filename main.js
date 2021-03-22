const taskTable = document.getElementById("taskTable");
const addTaskButton = document.getElementById("addTaskButton");
const addTaskNameButton = document.getElementById("addTaskNameButton");
const addTaskDeadlineDateButton = document.getElementById("addTaskDeadlineDateButton");
const addTaskDeadlineTimeButton = document.getElementById("addTaskDeadlineTimeButton");
const progressBar = document.getElementById("progressBar");

const everyTaskDialog = document.getElementById("everyTaskDialog");
const everyTaskDialogShowButton = document.getElementById("everyTaskDialogShowButton");
const everyTaskDialogCloseButton = document.getElementById("everyTaskDialogCloseButton");
const everyTaskTable = document.getElementById("everyTaskTable");
const addEveryTaskNameButton = document.getElementById("addEveryTaskNameButton");
const addEveryTaskAddDayButton = document.getElementById("addEveryTaskAddDayButton");
const addEveryTaskGraceButton = document.getElementById("addEveryTaskGraceButton");
const addEveryTaskDeadlineTimeButton = document.getElementById("addEveryTaskDeadlineTimeButton");
const addEveryTaskButton = document.getElementById("addEveryTaskButton");

const reloadButton = document.getElementById("reloadButton");

const updateTable = () => {
    const tasks = taskList.get();
    taskTable.innerHTML = "";
    tasks.forEach((task, i) => {
        const tr = document.createElement("tr");
        const nameTd = document.createElement("td");
        const nameTdText = document.createTextNode(task.name);
        nameTd.appendChild(nameTdText);
        tr.appendChild(nameTd);
        const deadlineTd = document.createElement("td");
        const deadlineTdText = document.createTextNode(dateToYYYYMMDDHHMM(task.deadline));
        deadlineTd.appendChild(deadlineTdText);
        tr.appendChild(deadlineTd);
        const doneTd = document.createElement("td");
        const doneTdText = document.createTextNode(task.done?"o":"x");
        doneTd.style.textAlign = "center";
        doneTd.appendChild(doneTdText);
        tr.appendChild(doneTd);
        const checkTd = document.createElement("td");
        if(!task.done){
            const checkButton = document.createElement("button");
            const checkButtonText = document.createTextNode("完了");
            checkButton.onclick = () => doneTask(i);
            checkButton.appendChild(checkButtonText);
            checkTd.appendChild(checkButton);
        }
        tr.appendChild(checkTd);
        const deleteTd = document.createElement("td");
        const deleteButton = document.createElement("button");
        const deleteButtonText = document.createTextNode("削除");
        deleteButton.onclick = () => deleteTask(i);
        deleteButton.appendChild(deleteButtonText);
        deleteTd.appendChild(deleteButton);
        tr.appendChild(deleteTd);
        if(task.deadline-new Date()<0) tr.style.color = "#aa0000";
        taskTable.appendChild(tr);
    })

    const taskNum = tasks.length;
    if(taskNum > 0){
        const doneTaskNum = tasks.filter(e => e.done).length;
        progressBar.max = taskNum;
        progressBar.value = doneTaskNum;
        progressBar.innerHTML = `${doneTaskNum}/${taskNum}`;
    }else{
        progressBar.removeAttribute("value");
        progressBar.innerHTML = "タスク無し";
    }
}

const updateEveryTable = () => {
    const everyTasks = taskList.eGet();
    everyTaskTable.innerHTML = "";
    everyTasks.forEach((everyTask, i) => {
        const tr = document.createElement("tr");
        const nameTd = document.createElement("td");
        const nameTdText = document.createTextNode(everyTask.name);
        nameTd.appendChild(nameTdText);
        tr.appendChild(nameTd);
        const addTd = document.createElement("td");
        const addTdText = document.createTextNode(dayString[everyTask.addDay]);
        addTd.appendChild(addTdText);
        tr.appendChild(addTd);
        const deadlineTd = document.createElement("td");
        const deadlineTdText = document.createTextNode(`${dayString[(everyTask.addDay+everyTask.grace)%7]}(${everyTask.grace}日後) ${everyTask.deadlineTime}`);
        deadlineTd.appendChild(deadlineTdText);
        tr.appendChild(deadlineTd);
        const deleteTd = document.createElement("td");
        const deleteButton = document.createElement("button");
        const deleteButtonText = document.createTextNode("削除");
        deleteButton.onclick = ()=>deleteEveryTask(i);
        deleteButton.appendChild(deleteButtonText);
        deleteTd.appendChild(deleteButton);
        tr.appendChild(deleteTd);
        everyTaskTable.appendChild(tr);
    })
}

const addTask = () => {
    const name = addTaskNameButton.value;
    const date = addTaskDeadlineDateButton.value;
    const time = addTaskDeadlineTimeButton.value;
    if(name.trim()!=="" && date!=="" && time!==""){
        const deadline = new Date(`${date}T${time}`);
        taskList.add({name, deadline});
        addTaskNameButton.value = "";
        addTaskDeadlineDateButton.value = "";
        addTaskDeadlineTimeButton.value = "23:59";
        updateTable();
    }else{
        alert("不正な入力です。");
    }
}
addTaskButton.onclick = () => addTask();

const addEveryTask = () => {
    const name = addEveryTaskNameButton.value;
    const addDay = +addEveryTaskAddDayButton.value;
    const grace = +addEveryTaskGraceButton.value;
    const deadlineTime = addEveryTaskDeadlineTimeButton.value;
    if(name.trim()!=="" && Number.isInteger(grace) && deadlineTime!==""){
        taskList.eAdd({name, addDay, grace, deadlineTime});
        addEveryTaskNameButton.value = "";
        addEveryTaskAddDayButton.value = 1;
        addEveryTaskGraceButton.value = 7;
        addEveryTaskDeadlineTimeButton.value = "23:59";
        updateEveryTable();
    }else{
        alert("不正な入力です。");
    }
}
addEveryTaskButton.onclick = () => addEveryTask();

const doneTask = (i) => {
    const rowData = taskList.get()[i];
    const ok = window.confirm(`名前: ${rowData.name}\n期限: ${dateToYYYYMMDDHHMM(rowData.deadline)}\nを完了状態にしますか？`);
    if(ok){
        taskList.done(i);
        updateTable();
        const tweetOk = window.confirm("ぜひツイートしましょう！");
        if(tweetOk){
            const text = `${rowData.name} submission completed...`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURI(text)}`, "_blank");
        }
    }
}

const deleteTask = (i) => {
    const rowData = taskList.get()[i];
    const ok = window.confirm(`名前: ${rowData.name}\n期限: ${dateToYYYYMMDDHHMM(rowData.deadline)}\n状態: ${rowData.done?"完了":"未完了"}\nを本当に削除しますか？\n(※完了したタスクは期限を過ぎると自動で削除されます。)`);
    if(ok){
        taskList.delete(i);
        updateTable();
    }
}

const deleteEveryTask = (i) => {
    const rowData = taskList.eGet()[i];
    const ok = window.confirm(`名前: ${rowData.name}\n追加: ${dayString[rowData.addDay]}\n期限: ${dayString[(rowData.addDay+rowData.grace)%7]}(${rowData.grace}日後) ${rowData.deadlineTime}\nを本当に削除しますか？`);
    if(ok){
        taskList.eDelete(i);
        updateEveryTable();
    }
}

const showDialog = () => {
    everyTaskDialog.showModal();
}
everyTaskDialogShowButton.onclick = () => showDialog();

const closeDialog = () => {
    everyTaskDialog.close();
}
everyTaskDialogCloseButton.onclick = () => closeDialog();

const main = () => {
    taskList.load();
    updateTable();
    updateEveryTable();
}
reloadButton.onclick = () => main();
main();