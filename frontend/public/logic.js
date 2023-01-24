const apiURL = 'http://localhost:3005/api/';
const apiVersion = 'v1';
let todos = [];

const htmlTemplate = {
    login: `<div class="auth">
           <b class="auth_text">Войдите в аккаунт, или зарегистрируйтесь</b>
           <div>
           <input class="inputLogin" type="text" placeholder="Логин">
           <input class="inputPassword" type="password" placeholder="Пароль">
           </div>
           <div id="btn_auth_block">
           <button class="btn_reg" onclick="register()">Зарегистрироваться</button>
           <button class="btn_log" onclick="login()">Войти</button>
           </div>
           </div>`,

    todos: `<div class="todos">
            <b class="addTodo_text">Ваши задачи</b>
            <div class="block_input_todo">
            <input id="input_todo" type="text" placeholder="Введите задачу">
            <button class="btn_addTodo" onclick="addTodo()">Добавить</button>
            </div>      
            <div class="todo">
            </div>
            <div class="leave">
            <div class="divider"></div>
            <button class="btn_leave" onclick="logoutREQ()">Выйти c аккаунта</button>
            </div>
            </div>`,

    buttonMarkTodoDiv: function(checked, index){
        if(checked){
            return `<div id="${index}_markTodoBtn" class="editTodo_div">
                   <button class="btn_todo" onclick="noMarkingTodo(${index})">Убрать метку</button>
                   </div>`;
        }
        return `<div id="${index}_markTodoBtn" class="editTodo_div">
                <button class="btn_todo" onclick="markingTodo(${index})">Отметить</button>
                </div>`
    },

    todo: function(element, index){
        const {text, checked} = element;
        const htmlText = text.replace(/&/gi, "&amp")
                           .replace(/</gi, "&lt")
                           .replace(/>/gi, "&gt")
                           .replace(/"/gi, "&quot")
                           .replace(/`/gi, "&#x60")
                           .replace(/'/gi, "&apos");
        divClass = checked ? `todo_markedText` : `todo_text`;
        return `<div class="divider"></div>
               <div class="${divClass}">
               <b class="textTodo">${index+1}. </b>
               <div class="textTodo" id="${index}_textTodo_div"><a>${htmlText}</a></div>
               </div>
               <div>
               <div id="${index}_btnEditTodo_div" class="editTodo_div">
               ${this.editTodoBtn(index)}
               </div>
               ${this.buttonMarkTodoDiv(checked, index)}
               <button class="btn_todo" onclick="dellTodoREQ(${index})"">Удалить</button>
               </div>`
    },

    inputEditTodo: function(index){
        return `<input class="input_edit_todo" id="${index}_todo_editInput" type="text" value="${todos[index].text}">`
    },

    saveAndCanselEditBtn: function(index){
        return `<button class="btn_todoCancell" id="${index}_todo_btnCancell" onclick="cancellEditTodo(${index})">
               Отменить
               </button>
               <button class="btn_todoUpd" id="${index}_todo_btnUpd" onclick="updTodo(${index})">
               Сохранить
               </button>`
    },

    editTodoBtn: function(index){
        return `<button class="btn_todo" onclick="editTodo(${index})">Редактировать</button>`
    }
}

function updTodoList(){
    let todosBody = "";
    const body = document.querySelector(`.todo`);

    for(let i =0; i < todos.length; i++){
        todosBody += htmlTemplate.todo(todos[i],i); 
    }
    body.innerHTML = todosBody;
}

function createTodoObj(_id,text,checked){
    return {_id,text,checked};
}

function addTodoArray(_id,text,checked){
    const todo = createTodoObj(_id,text,checked);
    todos.push(todo);
    updTodoList();
}

function addTodo(){
    const text = document.getElementById("input_todo").value;
    document.getElementById("input_todo").value = "";
    if(text.trim() != "" && text.length <= 1000){
        addTodoREQ(text)
    } else {
        setError(`Поле должно содержать от 1 до 1000 символов`)
    }

}

function editTodo(index){
    let textTodoHtml = document.getElementById(`${index}_textTodo_div`)
    let btnTodoHtml = document.getElementById(`${index}_btnEditTodo_div`)
    textTodoHtml.innerHTML = htmlTemplate.inputEditTodo(index);
    btnTodoHtml.innerHTML = htmlTemplate.saveAndCanselEditBtn(index);
    addListenerEditBtn(index);
}

function addListenerEditBtn(index){
    document.getElementById(`${index}_todo_editInput`).addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            updTodo(index);
        }
    });
    document.getElementById(`${index}_todo_editInput`).addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
            cancellEditTodo(index);
        }
    });
}

function cancellEditTodo(index){
    let divTextTodo = document.getElementById(`${index}_textTodo_div`);
    let divBtnTodo = document.getElementById(`${index}_btnEditTodo_div`);
    divTextTodo.innerHTML = `<a>${todos[index].text}</a>`;
    divBtnTodo.innerHTML = htmlTemplate.editTodoBtn(index);
}

function updTodo(index){
    const text = document.getElementById(`${index}_todo_editInput`).value;

    if(text.trim() != "" && text.length <= 1000){
        const todo = createTodoObj(todos[index]._id, text, todos[index].checked);
        editTodoREQ(todo,index);
    } else {
        setError(`Изменённое поле должно содержать от 1 до 1000 символов`);
    }
}

function markingTodo(index){
    const todo = createTodoObj(todos[index]._id, todos[index].text, true);
    editTodoREQ(todo,index);
}

function noMarkingTodo(index){
    const todo = createTodoObj(todos[index]._id, todos[index].text, false);
    editTodoREQ(todo,index);
}

function getErrorValidData(login, pass){
    let errorText = "";
    
    if(login.length > 25 || login.length < 3){
        errorText = "Логин должен состоят из 3 - 25 символов<br>"
    }

    if(pass.length > 30 || pass.length < 6){
        errorText += "Пароль должен состоят из 6 - 30 символов"
    }
    return errorText;
}

function login(){
    const login = document.querySelector(".inputLogin").value;
    const pass = document.querySelector(".inputPassword").value;

    if((login.trim() && pass.trim()) != ""){
        const errorText = getErrorValidData(login, pass);

        if(errorText == ""){
            loginREQ(login, pass);
        } else {
            setError(errorText);
        }
    } else {
        setError("Заполните все поля");
    }
}

function register(){
    const login = document.querySelector(".inputLogin").value;
    const pass = document.querySelector(".inputPassword").value;

    if((login.trim() && pass.trim()) != ""){
        const errorText = getErrorValidData(login, pass);

        if(errorText == ""){
            registerREQ(login, pass);
        } else {
            setError(errorText);
        }
    } else {
        setError("Заполните все поля");
    }
}

function getURL(partURL, action){
    const route = apiVersion === `v1` ? `/${partURL}` : `/router`;
    const qs = {action: apiVersion === `v1` ? `` : `${action}`};
    return `${apiURL}${apiVersion}${route}?${new URLSearchParams(qs)}`
}

async function loginREQ(login, pass){
    try{
        const body = JSON.stringify({login,pass});
        const response = await fetch(
            getURL(`login`, `login`), 
            { method: apiVersion === 'v1' ? 'POST' : 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: body
        });
        const resBody = await response.json()

        if (resBody.ok) {
            localStorage.setItem('name', login);
                getElementREQ();
        } else if (resBody.error === 'not found') {
                setError('Такая комбинация логина и пароля не найдена');
        } else {
                setError('Неудалось войти в аккаунт');
        }
    } catch (error){
        setError('Проблемы с подключением к серверу, попробуйте перезагрузить страницу');
    }
}

async function registerREQ(login, pass){
    try{
        const body = JSON.stringify({login,pass});
        const response = await fetch(
            getURL(`register`, `register`), {
            method: apiVersion === 'v1' ? 'POST' : 'POST',
            body: body,
            headers: { 'Content-Type': 'application/json' },
        });
        const resBody = await response.json();

        if (resBody.ok) {
            loginREQ(login, pass)
        } else {
            setError("Неудалось зарегистрировать пользователя, возможно логин уже занят")
        }
    } catch(error){
        setError('Проблемы с подключением к серверу, попробуйте перезагрузить страницу');
    }
}

async function getElementREQ(){
    try{
        const response = await fetch(
            getURL(`items`, `getItems`), 
            { credentials: 'include',
            method: apiVersion === 'v1' ? 'GET' : 'POST',
        });
        const resBody = await response.json();

        if (resBody.error === 'forbidden') {
            windowAuth();
        } else if (resBody.items) {
            todos = resBody.items;
            windowTodo();
            updTodoList();
        } else {
            setError("Неудалось получить данные")
        }
    } catch(error){
        setError("Отсутствует связь с сервером")
        setTimeout(()=>{
            getElementREQ();
        }, 2000)
    }
}

async function logoutREQ() {
    try{
        const response = await  fetch(
            getURL(`logout`, `logout`), 
            { method: this.apiVersion === 'v1' ? 'POST' : 'POST',
            credentials: 'include',
            });
        const resBody = await response.json()

        if (resBody.ok) {
            todos = [];
            localStorage.clear();
            windowAuth();
        }
    } catch (error){
        setError('Проблемы с подключением к серверу, попробуйте перезагрузить страницу');
    }
}

async function addTodoREQ(text){
    const body = JSON.stringify({text});
    try{
        const response = await fetch(
            getURL(`items`, `createItem`), 
            { method: apiVersion === 'v1' ? 'POST' : 'POST',
            body: body,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
            });

        const resBody = await response.json()

        if (resBody.error === 'forbidden') {
            localStorage.clear();
            windowAuth();
            setError("Войдите в аккаунт");
        } else if (resBody._id) {
            addTodoArray(resBody._id,text,false)
        } else {
            setError('Неудалось добавить новое задание');
        }
    } catch(error){
        setError('Проблемы с подключением к серверу, попробуйте перезагрузить страницу')
    }
}

async function editTodoREQ(todo,index){
    try{
        const body = JSON.stringify({_id: todo._id, text: todo.text, checked: todo.checked});
        const response = await fetch(
            getURL(`items`, `editItem`), {
            method: apiVersion === 'v1' ? 'PUT' : 'POST',
            body: body,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        const resBody = await response.json();

        if (resBody.error === 'forbidden') {
            localStorage.clear();
            windowAuth();
            setError("Войдите в аккаунт");
        } else if (resBody.ok) {
            todos[index] = todo;
            updTodoList();
        } else {
            setError('Неудалось обновить задание');
        }
    } catch {
        setError('Проблемы с подключением к серверу, попробуйте перезагрузить страницу');
    }
}

async function dellTodoREQ(index){
    try {
        const _id = todos[index]._id;
        todos.splice(index,1);
        const body = JSON.stringify({_id});

        const response = await fetch(
            getURL(`items`, `deleteItem`), {
            method: apiVersion === 'v1' ? 'DELETE' : 'POST',
            body: body,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        const resBody = await response.json();

        if (resBody.error === 'forbidden') {
            localStorage.clear();
            windowAuth();
            setError("Войдите в аккаунт");
        } else if (resBody.ok) {
            updTodoList();
        } else {
            setError('Неудалось удалить задание');
        }
    } catch {
        setError('Проблемы с подключением к серверу, попробуйте перезагрузить страницу');
    }
}

function windowAuth(){
    document.querySelector(".window").innerHTML = htmlTemplate.login;
}

function windowTodo(){
    document.querySelector(".window").innerHTML = htmlTemplate.todos;
    document.querySelector('#input_todo').addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
            addTodo();
    }});
}

function setError(text){
    const div = document.createElement('div');
    div.id = "error_block";
    div.innerHTML = text;
    div.style.opacity = 1;
    document.body.append(div);

    setTimeout(()=>{
        dellError();
    }, 3500);

    function dellError(){
        if(div.style.opacity > 0.1){
            setTimeout(()=>{
                div.style.opacity -= 0.1;
                dellError();
            }, 50)
        } else {
            div.remove();
        }
    }
}

getElementREQ();