'use strict';

class User {
    constructor(username, phone, email, city, pay, address, img, ...arg) {
        this.username = username || 'not enter';
        this.phone = phone || 'not enter';
        this.email = email || 'not enter';
        this.city = city || 'not enter';
        this.pay = pay || 'not enter';
        this.address = address || 'not enter';
        this.img = img || 'not enter';
        this.dateReg = arg[0] || new Date().toLocaleString('ru-RU').replace(/,/, '');
        this.dateUpd = arg[1] || 'not updated';
    }
    showInConsole() {
        if (this.parseData()) {
            let obj = this.parseData();
            console.log(obj);
        } else {
            console.log('Data is not');
        }
    }
    _addInfoToLS() {
        if (localStorage.length) {
            if (localStorage.getItem(this.email)) {
                console.log("Такой чел уже есть. Введи другие данные");
                return false;
            } else {
                localStorage.setItem(this.email, `${this.username}, ${this.phone}, ${this.email}, ${this.city}, ${this.pay}, ${this.address}, ${this.img}, ${this.dateReg}, ${this.dateUpd || 'not updated'}`);
                return true;
            }
        } else {
            localStorage.setItem(this.email, `${this.username}, ${this.phone}, ${this.email}, ${this.city}, ${this.pay}, ${this.address}, ${this.img}, ${this.dateReg}, ${this.dateUpd || 'not updated'}`);
            return true;
        }
    }
    _addInfoToTable(values) {
        if (values) {
            let table = document.querySelector('table tbody');
            let tr = document.createElement('tr');
            let inpUpd = document.createElement('input'),
                inpDel = document.createElement('input');

            if (!tr.children.length) {
                let count = table.children.length + 1;
                let td = document.createElement('td');
                td.innerHTML = count;
                count++;
                tr.append(td);
            }

            for (const iterator of Object.values(values)) {
                let td = document.createElement('td');
                td.innerHTML = iterator;
                tr.append(td);
            }

            [inpUpd.type, inpDel.type] = ['button', 'button'];
            [inpUpd.name, inpDel.name] = ['update', 'delete'];
            [inpUpd.value, inpDel.value] = ['upd', 'del'];

            tr.append(inpDel, inpUpd);

            table.append(tr);
            return true;
        } else {
            return false;
        }
    }
    addInfo() {
        if (this._addInfoToLS()) {
            if (this._addInfoToTable(this.parseData())) {
                console.log('Data is added');
            } else {
                console.log('Data is not added in Locale Storage');
            }
        } else {
            console.log('Data is not added in Table');
        }
    }
    parseData() {
        if (localStorage.length) {
            if (localStorage.getItem(this.email)) {
                let tmpData = localStorage.getItem(this.email).split(',').map(elem => elem.trim());
                return {
                    username: tmpData[0],
                    phone: tmpData[1],
                    email: tmpData[2],
                    city: tmpData[3],
                    pay: tmpData[4],
                    address: tmpData[5],
                    img: tmpData[6],
                    dateReg: tmpData[7],
                    dateUpd: tmpData[8],
                };
            } else {
                console.log('Data is not finded');
                return false;
            }
        } else {
            console.log('Local Storage is empty');
            return false;
        }
    }
    static showData() {
        this.clearTable();
        for (const key in localStorage) {
            let table = document.querySelector('table tbody');
            if (localStorage.hasOwnProperty(key)) {
                const element = localStorage.getItem(key).split(',').map(el => el.trim());

                let tr = document.createElement('tr');
                let inpUpd = document.createElement('input'),
                    inpDel = document.createElement('input');

                if (!tr.children.length) {
                    let count = table.children.length + 1;
                    let td = document.createElement('td');
                    td.innerHTML = count;
                    count++;
                    tr.append(td);
                }

                for (const iterator of Object.values(element)) {
                    let td = document.createElement('td');
                    td.innerHTML = iterator;
                    tr.append(td);
                }

                [inpUpd.type, inpDel.type] = ['button', 'button'];
                [inpUpd.name, inpDel.name] = ['update', 'delete'];
                [inpUpd.value, inpDel.value] = ['upd', 'del'];

                tr.append(inpDel, inpUpd);

                table.append(tr);
            }
        }
    }
    static deleteInfoFromLS(key) {
        localStorage.removeItem(key);
    }
    static clearTable() {
        let tbody = document.querySelector('table tbody');

        for (let i = 0; i < tbody.rows.length; i++) {
            // console.log(tbody.rows);
            tbody.rows[i--].remove();
        }
    }
}

let t = document.getElementsByTagName('table')[0];
//buttons DELETE, UPDATE
t.addEventListener('click', (e) => {
    let elem = e.target;
    if (elem.tagName.toLowerCase() === 'input') {
        let parent = elem.parentElement;
        let email = parent.children[3].innerHTML;
        if (elem.name === 'delete') {
            console.log(`User with  email ${email} deleted`);
            User.deleteInfoFromLS(email);
            parent.remove();
        }
        if (elem.name === 'update') {
            let dateUpd = new Date().toLocaleString('ru-RU').replace(/,/, '');
            let tmp = localStorage.getItem(email).split(',').map(el => el.trim());
            let obj = {
                username: prompt('Enter new username', tmp[0]),
                phone: prompt('Enter new phone', tmp[1]),
                email: prompt('Enter new email', tmp[2]),
                city: prompt('Enter new city', tmp[3]),
                pay: prompt('Enter new pay', tmp[4]),
                address: prompt('Enter new address', tmp[5]),
                img: prompt('Enter new img', tmp[6]),
                dateReg: tmp[7],
                dateUpd: dateUpd,
            };
            // console.log(obj);
            User.deleteInfoFromLS(email);
            let userUpd = new User(...Object.values(obj));
            userUpd.addInfo();
            User.showData();
        }
    }
});

//button ADD
let addButton = document.querySelector('button[name="add"]');
addButton.addEventListener('click', () => {
    let user = new User(prompt('Enter the username', 'John'), prompt('Enter the number phone', '111-22-33'), prompt('Enter the email', 'john@domain.com'), prompt('Enter the city', 'New-York'), prompt('Enter the pay', '0.00$'), prompt('Enter the address', 'st. Madison 124'), prompt('Choose img', 'file IMG'));
    user.addInfo();
});

User.showData();





//test postMessage
window.addEventListener('message', (e) => {
    if (e.data == 'set') {
        localStorage.setItem('set', 'message');
    } else if (e.data == 'get') {
        localStorage.setItem('get', 'message');
    }
});
