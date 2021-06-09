import React from 'react'
import { useState } from 'react';
import './Card.css'

const Card = ({ updater, contact, deleteContact }) => {
    const [isEditable, setIsEditable] = useState(false);
    const { fullName, email, phone, address, avatar } = contact;
    const [bgColor, setBgColor] = useState('rgba(173, 174, 247, 0.342)')

    /* const editedContact = {...contact} */
    //we can send only the specific edited fields
    const editedContact = {_id: contact._id };

    const editToggle = () => {
        setIsEditable(!isEditable);
        setBgColor(isEditable ? 'rgba(173, 174, 247, 0.342)' : 'gray')
    }

    const editCardHandler = (e) => {
        const id = e.target.getAttribute("data-id");

        let info;
        if (id == 'file') {
            info = e.target.files[0];
        } else {
            info = e.target.innerText;
        }
        editedContact[id] = info;
    }

    const editCheckHandler = (e) => {
        console.log('input', e);
        if (e.charCode == 13) {
            e.preventDefault();
        }
    }

    const updateContactHandler = () => {
        console.log(editedContact);

        let finalForm = new FormData();

        Object.keys(editedContact).forEach(key => {
            finalForm.append(key, editedContact[key]) 
        })

        const url = 'https://contact-list-backend-2021.herokuapp.com/contacts/update';
        const options = {
        method: 'POST',
        headers: {
            'x-auth-token': localStorage.getItem('token')
        },
        body: finalForm
        }

        fetch(url, options)
        .then( data => data.json().then(output => {
            if (output.status === 'success') {
                setIsEditable(false)
                setBgColor('green')
                setTimeout(() => {
                    setBgColor('rgba(173, 174, 247, 0.342)')
                }, 1000);
                if (output.data.avatar) {
                    console.log(output.data);
                    updater(output.data._id, output.data.avatar);
                }
                
            } else {
                setBgColor('coral')
                alert(output.message.message);
            }
        })
        ).catch(err => setBgColor('coral'))
    }

    return (
        <div className = "card" style = {{backgroundColor: bgColor}}>
            {isEditable ? 
            <input data-id="file" type="file" onChange = {editCardHandler} /> : 
            <img src={"https://contact-list-backend-2021.herokuapp.com/avatars/" + avatar}/>}
            <div>
                <p>name: &nbsp;</p>
                <p data-id="fullName" 
                    onKeyPress = {editCheckHandler} 
                    onBlur = {editCardHandler} 
                    contentEditable = {isEditable}
                >
                    {fullName}
                </p>
            </div>
            <div>
                <p>email: &nbsp;</p>
                <p data-id="email" 
                    onKeyPress = {editCheckHandler} 
                    onBlur = {editCardHandler} 
                    contentEditable = {isEditable}
                >
                    {email}
                </p>
            </div>
            <div>
                <p>phone: &nbsp;</p>
                <p data-id="phone" 
                    onKeyPress = {editCheckHandler} 
                    onBlur = {editCardHandler} 
                    contentEditable = {isEditable}
                >
                    {phone}
                </p>
            </div>
            <div>
                <p>address: &nbsp;</p>
                <p data-id="address" 
                    onKeyPress = {editCheckHandler} 
                    onBlur = {editCardHandler} 
                    contentEditable = {isEditable}
                >
                    {address}
                </p>
            </div>
            <div>
                <button onClick = {editToggle}>Edit</button>
                <button onClick = {updateContactHandler}>Save</button>
                <button onClick = {deleteContact}>Delete</button>
            </div>
        </div>
    )
}

export default Card
