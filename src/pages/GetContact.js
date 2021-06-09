import React from 'react'
import './GetContacts.css'

const GetContact = () => {

    const submitHandler = (e) => {
        e.preventDefault();
/* 
        let data = {};

        data.fullName = e.target[0].value;
        data.email = e.target[1].value;
        data.phone = e.target[2].value;
        data.message = e.target[3].value; */

        console.log(e.target[4].files);
        let data = new FormData();
        data.append('fullName', e.target[0].value);
        data.append('email', e.target[1].value);
        data.append('phone', e.target[2].value);
        data.append('message', e.target[3].value);
        
        //append stringifies the array so we have to append one by one
        // we can append be sending with the same key
        Array.from(e.target[4].files).forEach(file => {
            data.append('attachments', file);
        });

        //way no.1 to do it
        for (var value of data.values()) {
            console.log(value);
        }

        //way no.2 to do it
        console.log(Object.fromEntries(data));

        let url = 'https://contact-list-backend-2021.herokuapp.com/get-contact';
        
        let options = {
            method :'POST',
            body:data
        }

        fetch(url, options)
            .then(result => result.json().then(output => {
                    if (output.status === 'success') {
                        alert('Congrats, your message was successfully sent!')
                    } else {
                        alert(output.message)
                    }
                    console.log(output);
                })
            );
    }

    return (
        <div className="get-contact">
            <h1>Contact Us</h1>
            <form  className="contact-form" onSubmit={submitHandler}>
                <input type="text" placeholder="Full Name"/>
                <input type="email" placeholder="Email"/>
                <input type="tel" placeholder="Phone"/>
                <textarea type="text" placeholder="Message"/>
                <input type="file" multiple/>
                <button>Send message</button>
            </form>
        </div>
    )
}

export default GetContact
