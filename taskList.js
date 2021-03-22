const taskList = {
    data: [],
    eData: [],
    lastUpdate: dateToYYYYMMDD(new Date()),
    save: function (){
        const tasksJSON = JSON.stringify(this.data);
        localStorage.setItem("tasks", tasksJSON);
        const everyTasksJSON = JSON.stringify(this.eData);
        localStorage.setItem("everyTasks", everyTasksJSON);
    },
    load: function (){
        const tasksJSON = localStorage.getItem("tasks");
        if(tasksJSON!=null){
            const tasks = JSON.parse(tasksJSON);
            for(const task of tasks){
                task.deadline = new Date(task.deadline);
            }
            this.data = tasks;
            this.check();
        }
        const everyTasksJSON = localStorage.getItem("everyTasks");
        if(everyTasksJSON!=null){
            const everyTasks = JSON.parse(everyTasksJSON);
            this.eData = everyTasks;
        }
        const lastUpdateString = localStorage.getItem("lastUpdate");
        if(lastUpdateString!=null){
            this.lastUpdate = lastUpdateString;
        }
        const todayYMD = dateToYYYYMMDD(new Date());
        const today = new Date(todayYMD)
        let lastUpdateYMD = this.lastUpdate;
        const everyTasks = this.eGet();
        while(today-new Date(lastUpdateYMD)>=0){
            const lastUpdateDay = new Date(lastUpdateYMD).getDay();
            const tasks = everyTasks.filter(e=>e.addDay===lastUpdateDay);
            for(const task of tasks){
                const name = task.name;
                const deadline = new Date(`${dateToYYYYMMDD(afterDate(new Date(lastUpdateYMD),task.grace)).split("/").join("-")}T${task.deadlineTime}`);
                this.add({name, deadline});
            }
            lastUpdateYMD = dateToYYYYMMDD(afterDate(new Date(lastUpdateYMD),1));
        }
        localStorage.setItem("lastUpdate", lastUpdateYMD);
    },
    add: function ({name, deadline}){
        const taskData = {
            name: name,
            deadline: deadline,
            done: false,
        };
        this.data.push(taskData);
        this.sort();
        this.save();
    },
    eAdd: function ({name, addDay, grace, deadlineTime}){
        const everyTaskData = {
            name: name,
            addDay: addDay,
            grace: grace,
            deadlineTime: deadlineTime,
        }
        this.eData.push(everyTaskData);
        this.eSort();
        this.save();
    },
    delete: function (i){
        this.data.splice(i, 1);
        this.save();
    },
    eDelete: function (i){
        this.eData.splice(i, 1);
        this.save();
    },
    get: function (){
        this.check();
        return this.data;
    },
    eGet: function (){
        return this.eData;
    },
    sort: function (){
        this.data.sort((a, b) => a.deadline - b.deadline);
    },
    eSort: function (){
        this.eData.sort((a, b) => a.addDay - b.addDay);
    },
    done: function (i){
        this.data[i].done = true;
        this.check();
        this.save();
    },
    check: function (){
        this.data.forEach((task, i) => {
            if(task.done && task.deadline-new Date<0){
                this.delete(i);
            }
        })
    }
}