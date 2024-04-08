const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = document.querySelector('#domoName').value;
    const age = document.querySelector('#domoAge').value;
    const color = document.querySelector('#domoColor').value;

    if (!name || !age || !color) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, color }, onDomoAdded);
    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm" onSubmit={(e) => { handleDomo(e, props.triggerReload) }} name="domoForm" action="/maker" method="POST" className="domoForm">
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="color">Color: </label>
            <input id="domoColor" type="text" name="color" placeholder="Domo Color" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />

        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos])

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map((domo) => {
        console.log(domo);
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoColor">Color: {domo.color}</h3>
                <a href="#" className="deleteDomo" onClick={(e)=>{
                    e.target.parentNode.querySelector('.domoName').value;
                    e.target.parentNode.querySelector('.domoAge').value;
                    e.target.parentNode.querySelector('.domoColor').value;
                    helper.sendPost('/deleteDomo', {name: domo.name, age: domo.age, color: domo.color}, props.triggerReload);
                }}>Delete</a>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => { setReloadDomos(!reloadDomos) }} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => { setReloadDomos(!reloadDomos) }}/>
            </div>

        </div>
    );
};

const init = () =>{
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;